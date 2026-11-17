import { Landmark } from "lucide-react";
import { BANKS, PROGRAMS } from "./bank-directory.mjs";
export { BANKS, PROGRAMS } from "./bank-directory.mjs";
export const POS_PROGRAMS = BANKS.filter((b) =>
  ["garanti", "yapikredi", "akbank"].includes(b.code),
).flatMap((bank) =>
  bank.programs.map((program) => ({
    code: bank.code + ":" + program,
    label:
      (bank.code === "garanti" ? "Garanti" : bank.name) +
      " " +
      PROGRAMS[program],
  })),
);
export const bankName = (code) =>
  BANKS.find((b) => b.code === code)?.name || "";
// Optical adaptations of the approved presentation marks, in the app's outline style.
export function BankMark({ code }) {
  return code === "garanti" ? (
    <svg
      viewBox="0 0 32 32"
      width="30"
      height="30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M16 27V13M16 21C5 23 3 14 5 8c8 0 13 4 11 13ZM16 15C14 6 20 3 27 5c0 7-4 12-11 10Z" />
      <path d="m7 11 9 10 8-13" />
    </svg>
  ) : code === "yapikredi" ? (
    <svg
      viewBox="0 0 32 32"
      width="30"
      height="30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M16 26V15C14 7 3 5 4 14c1 5 8 6 8 1 0-3-4-3-4-1M16 26V15c2-8 13-10 12-1-1 5-8 6-8 1 0-3 4-3 4-1M13 25h6" />
    </svg>
  ) : code === "akbank" ? (
    <span className="bank-wordmark" aria-hidden="true">
      AKBANK
    </span>
  ) : (
    <Landmark size={26} />
  );
}
export function ProgramMark({ code }) {
  if (!PROGRAMS[code]) return null;
  return (
    <span className={"program-mark " + code}>
      {code === "bonus" ? (
        <svg
          viewBox="0 0 32 32"
          width="23"
          height="23"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          {[0, 60, 120, 180, 240, 300].map((n) => (
            <ellipse
              key={n}
              cx="16"
              cy="9"
              rx="3.5"
              ry="6"
              transform={`rotate(${n} 16 16)`}
            />
          ))}
        </svg>
      ) : code === "world" ? (
        <svg
          viewBox="0 0 32 32"
          width="23"
          height="23"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="m16 3 4 8 9 2-7 6 1 10-7-5-8 5 2-10-7-6 9-2Z" />
        </svg>
      ) : null}
      <span>{PROGRAMS[code]}</span>
    </span>
  );
}
