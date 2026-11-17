const norm = (s) =>
  String(s || "")
    .toLocaleLowerCase("tr")
    .replace(/[^a-zçğıöşü0-9]/g, "");
export function cardDisplayName(name, bank, program) {
  const standard = [
    `${bank} ${program}`,
    `${bank} ${program} Kart`,
    `${program} Kart`,
    `${program}`,
  ];
  return program && standard.some((v) => norm(v) === norm(name))
    ? program
    : name;
}
