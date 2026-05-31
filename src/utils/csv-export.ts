function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function generateCSV(
  columnNames: string[],
  rows: Record<string, string>[],
): string {
  const header = columnNames.map(escapeCSV).join(",");
  const body = rows
    .map((row) => columnNames.map((col) => escapeCSV(row[col] ?? "")).join(","))
    .join("\n");
  return `${header}\n${body}`;
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
