export const COLUMN_TYPES = [
  "TEXT",
  "INTEGER",
  "FLOAT",
  "BOOLEAN",
  "DATE",
  "TIMESTAMP",
  "UUID",
  "EMAIL",
  "NAME",
  "FIRST_NAME",
  "LAST_NAME",
  "PHONE",
  "ADDRESS",
  "URL",
] as const;

export type ColumnType = (typeof COLUMN_TYPES)[number];

export interface ColumnDefinition {
  name: string;
  type: ColumnType;
  validate: string;
}
