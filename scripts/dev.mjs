// Development services are processes, not retained setup state.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import net from "node:net";
const config = existsSync(".dev-runtime.json")
  ? JSON.parse(
      readFileSync(".dev-runtime.json", "utf8").replaceAll(
        "${ROOT}",
        process.cwd(),
      ),
    )
  : {};
const children = [];
const env = { ...process.env, ...config.env };
let stopping = false;
function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  children
    .slice()
    .reverse()
    .forEach((child) => child.kill("SIGTERM"));
  const timer = setTimeout(() => {
    children.forEach((child) => child.kill("SIGKILL"));
    process.exit(code);
  }, 2000);
  timer.unref();
}
function run(bin, args, extra = {}) {
  const child = spawn(bin, args, { stdio: "inherit", env, ...extra });
  children.push(child);
  child.on("error", (error) => {
    console.error(`${bin}: ${error.message}`);
    shutdown(1);
  });
  child.on("exit", (code, signal) => {
    if (!stopping) {
      console.error(`${bin} stopped (${signal || code})`);
      shutdown(code || 1);
    }
  });
  return child;
}
process.on("SIGINT", () => shutdown());
process.on("SIGTERM", () => shutdown());
async function ready(check, label) {
  for (let i = 0; i < 100 && !stopping; i++) {
    if (await check()) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw Error(`Service not ready: ${label}`);
}
const socketReady = (port) =>
  new Promise((resolve) => {
    const socket = net.connect(port, "127.0.0.1");
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
    socket.setTimeout(500, () => {
      socket.destroy();
      resolve(false);
    });
  });
try {
  if (config.mysql) {
    run(config.mysql.bin, config.mysql.args);
    await ready(() => socketReady(3307), "MySQL");
  }
  run(
    config.php?.bin || process.env.PHP_BIN || "php",
    [
      ...(config.php?.args || []),
      "-S",
      "127.0.0.1:8088",
      "-t",
      "public",
      ...(config.router ? [config.router] : []),
    ],
    {
      env: {
        ...env,
        ...(process.platform === "win32"
          ? {}
          : { PHP_CLI_SERVER_WORKERS: "4" }),
      },
    },
  );
  await ready(async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8088/api/index.php?action=session",
        { signal: AbortSignal.timeout(500) },
      );
      const body = await response.json();
      return (
        response.ok &&
        typeof body.csrf === "string" &&
        typeof body.setupRequired === "boolean"
      );
    } catch {
      return false;
    }
  }, "PHP API session");
  if (config.initialize) {
    const result = spawnSync("python3", [config.initialize], {
      env,
      stdio: "inherit",
    });
    if (result.status !== 0) throw Error("Integration initialization failed");
  }
  run(process.execPath, [
    "node_modules/vite/bin/vite.js",
    ...process.argv.slice(2),
  ]);
} catch (error) {
  if (!stopping) console.error(error.message);
  shutdown(1);
}
