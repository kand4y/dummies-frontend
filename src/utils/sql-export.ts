import type { ColumnType } from "@/types/column-types";

function escapeSQL(value: string): string {
  return value.replace(/'/g, "''");
}

function needsQuotes(type: ColumnType): boolean {
  return !["INTEGER", "FLOAT", "BOOLEAN"].includes(type);
}

export function generateSQL(
  tableName: string,
  columns: { name: string; type: ColumnType }[],
  rows: Record<string, string>[],
): string {
  if (rows.length === 0) return "";

  const colNames = columns.map((c) => `"${c.name}"`).join(", ");
  const statements = rows.map((row) => {
    const values = columns
      .map((col) => {
        const val = row[col.name] ?? "";
        if (needsQuotes(col.type)) {
          return `'${escapeSQL(val)}'`;
        }
        return val;
      })
      .join(", ");
    return `INSERT INTO "${tableName}" (${colNames}) VALUES (${values});`;
  });

  return statements.join("\n");
}

export function downloadSQL(sql: string, filename: string) {
  const blob = new Blob([sql], { type: "text/sql;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".sql") ? filename : `${filename}.sql`;
  a.click();
  URL.revokeObjectURL(url);
}
