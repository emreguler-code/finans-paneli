export function csvText(columns, rows) {
  const cell = (value) =>
    '"' +
    String(value ?? "")
      .replace(/^[=+@\-\t\r\n]/, "'$&")
      .replaceAll('"', '""') +
    '"';
  return (
    "\ufeff" +
    [columns, ...rows].map((row) => row.map(cell).join(";")).join("\r\n")
  );
}
export function exportRows(name, columns, rows) {
  const url = URL.createObjectURL(
    new Blob([csvText(columns, rows)], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = name + ".csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
