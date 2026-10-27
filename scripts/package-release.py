#!/usr/bin/env python3
"""Package only explicitly selected hosting files; never ship runtime data."""
import hashlib
import json
from pathlib import Path
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
version = json.loads((ROOT / "package.json").read_text())["version"]
if not re.fullmatch(r"[0-9]+\.[0-9]+\.[0-9]+", version):
    raise SystemExit("Unsupported release version")
output = ROOT / "dist" / "releases"
output.mkdir(parents=True, exist_ok=True)
archive = output / f"finans-paneli-{version}.zip"
files = {"hosting/index.html": ROOT / "dist/client/index.html",
         "hosting/update.php": ROOT / "public/update.php",
         "KURULUM.md": ROOT / "docs/HOSTING-KURULUM.md",
         "GUNCELLEME.md": ROOT / "docs/GUNCELLEME.md"}
# Vite assets are generated; public/ is deliberately not copied wholesale.
for source in (ROOT / "dist/client/assets").rglob("*"):
    if source.is_file():
        files["hosting/assets/" + source.relative_to(ROOT / "dist/client/assets").as_posix()] = source
# Use tracked PHP files only, excluding any production/local configuration.
import subprocess
tracked = subprocess.check_output(["git", "ls-files", "-z", "public/api", "database"], cwd=ROOT).decode().split("\0")
for name in filter(None, tracked):
    source = ROOT / name
    if name.startswith("public/api/") and source.suffix == ".php" and source.name != "config.php":
        files["hosting/" + name.removeprefix("public/")] = source
    elif name.startswith("database/") and source.suffix == ".sql" and source.name != "sample-data.sql":
        files[name] = source
        if name.startswith("database/migrations/"):
            files["hosting/api/v2/migrations/" + source.name] = source
files["licenses/Inter-OFL.txt"] = ROOT / "src/assets/fonts/OFL.txt"
def write_archive(path, entries):
    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for name, source in sorted(entries.items()):
            if source.is_symlink():
                raise SystemExit(f"Refusing symlink: {source}")
            info = zipfile.ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            z.writestr(info, source.read_bytes())
    checksum = hashlib.sha256(path.read_bytes()).hexdigest()
    (output / f"{path.name}.sha256").write_text(f"{checksum}  {path.name}\n")
    print(f"Created {path.relative_to(ROOT)} ({len(entries)} files)")

write_archive(archive, files)
# Ready to extract directly into the web root. Keep runtime migrations and font license.
hosting_files = {name.removeprefix("hosting/"): source for name, source in files.items() if name.startswith("hosting/")}
hosting_files["licenses/Inter-OFL.txt"] = files["licenses/Inter-OFL.txt"]
write_archive(output / f"finans-paneli-{version}-hosting.zip", hosting_files)
