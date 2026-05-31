import type { ColumnType } from "@/types/column-types";

const FIRST_NAMES = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael",
  "Linda", "David", "Elizabeth", "Taro", "Hanako", "Yuki", "Sakura",
  "Kenji", "Aoi", "Ren", "Mio", "Haruto", "Yui",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
  "Davis", "Wilson", "Anderson", "Tanaka", "Suzuki", "Sato", "Takahashi",
  "Yamamoto", "Watanabe", "Nakamura", "Kobayashi", "Ito", "Kato",
];

const DOMAINS = [
  "example.com", "test.org", "mail.net", "demo.io", "sample.co",
];

const STREETS = [
  "Main St", "Oak Ave", "Park Blvd", "Elm St", "Cedar Rd",
  "Maple Dr", "Pine Ln", "Washington Ave", "Lake St", "Hill Rd",
];

const CITIES = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
  "Tokyo", "Osaka", "Nagoya", "Sapporo", "Fukuoka",
];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

export function generateValue(type: ColumnType, _validate: string): string {
  switch (type) {
    case "TEXT":
      return `text_${randInt(1, 99999)}`;
    case "INTEGER":
      return String(randInt(1, 10000));
    case "FLOAT":
      return (Math.random() * 10000).toFixed(2);
    case "BOOLEAN":
      return Math.random() > 0.5 ? "true" : "false";
    case "DATE": {
      const d = randomDate(new Date(2020, 0, 1), new Date());
      return d.toISOString().split("T")[0];
    }
    case "TIMESTAMP": {
      const d = randomDate(new Date(2020, 0, 1), new Date());
      return d.toISOString();
    }
    case "UUID":
      return crypto.randomUUID();
    case "EMAIL": {
      const name = pick(FIRST_NAMES).toLowerCase();
      return `${name}${randInt(1, 999)}@${pick(DOMAINS)}`;
    }
    case "NAME":
      return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    case "FIRST_NAME":
      return pick(FIRST_NAMES);
    case "LAST_NAME":
      return pick(LAST_NAMES);
    case "PHONE":
      return `0${randInt(10, 99)}-${randInt(1000, 9999)}-${randInt(1000, 9999)}`;
    case "ADDRESS":
      return `${randInt(1, 9999)} ${pick(STREETS)}, ${pick(CITIES)} ${randInt(10000, 99999)}`;
    case "URL":
      return `https://${pick(DOMAINS)}/page/${randInt(1, 9999)}`;
    default:
      return "";
  }
}

export function generateRows(
  columns: { name: string; type: ColumnType; validate: string }[],
  rowCount: number,
): Record<string, string>[] {
  const rows: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const row: Record<string, string> = {};
    for (const col of columns) {
      row[col.name] = generateValue(col.type, col.validate);
    }
    rows.push(row);
  }
  return rows;
}
