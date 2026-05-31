import { useState } from "react";
import type { ColumnDefinition, ColumnType } from "@/types/column-types";
import { generateRows } from "@/utils/generators";
import { generateCSV, downloadCSV } from "@/utils/csv-export";
import { generateSQL, downloadSQL } from "@/utils/sql-export";
import { Button } from "@/components/ui/button";
import { ColumnList } from "./column-list";
import { DataPreview } from "./data-preview";
import { ExportControls } from "./export-controls";

interface DummyBuilderProps {
  initialTableName?: string;
  initialColumns?: ColumnDefinition[];
  onSave?: (
    tableName: string,
    columns: ColumnDefinition[],
  ) => Promise<void>;
}

const DEFAULT_COLUMNS: ColumnDefinition[] = [
  { name: "id", type: "INTEGER" as ColumnType, validate: "" },
  { name: "name", type: "NAME" as ColumnType, validate: "" },
  { name: "email", type: "EMAIL" as ColumnType, validate: "" },
];

export function DummyBuilder({
  initialTableName = "my_table",
  initialColumns,
  onSave,
}: DummyBuilderProps) {
  const [tableName, setTableName] = useState(initialTableName);
  const [columns, setColumns] = useState<ColumnDefinition[]>(
    initialColumns ?? DEFAULT_COLUMNS,
  );
  const [rowCount, setRowCount] = useState(10);
  const [generatedData, setGeneratedData] = useState<
    Record<string, string>[]
  >([]);
  const [saving, setSaving] = useState(false);

  const validColumns = columns.filter((c) => c.name.trim() !== "");

  const handleGenerate = () => {
    if (validColumns.length === 0) return;
    setGeneratedData(generateRows(validColumns, rowCount));
  };

  const handleExportCSV = () => {
    if (generatedData.length === 0) return;
    const csv = generateCSV(
      validColumns.map((c) => c.name),
      generatedData,
    );
    downloadCSV(csv, tableName || "data");
  };

  const handleExportSQL = () => {
    if (generatedData.length === 0) return;
    const sql = generateSQL(tableName || "my_table", validColumns, generatedData);
    downloadSQL(sql, tableName || "data");
  };

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave(tableName, columns);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Table Name</label>
        <input
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="table_name"
        />
      </div>

      <ColumnList columns={columns} onChange={setColumns} />

      <div className="flex items-end gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Row Count</label>
          <input
            type="number"
            className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            min={1}
            max={1000}
            value={rowCount}
            onChange={(e) =>
              setRowCount(Math.max(1, Math.min(1000, Number(e.target.value))))
            }
          />
        </div>
        <Button onClick={handleGenerate} disabled={validColumns.length === 0}>
          Generate
        </Button>
        {onSave && (
          <Button variant="secondary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        )}
      </div>

      {generatedData.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {generatedData.length} rows generated
            </p>
            <ExportControls
              onExportCSV={handleExportCSV}
              onExportSQL={handleExportSQL}
              disabled={generatedData.length === 0}
            />
          </div>
          <DataPreview
            columnNames={validColumns.map((c) => c.name)}
            rows={generatedData.slice(0, 50)}
          />
          {generatedData.length > 50 && (
            <p className="text-center text-xs text-gray-400">
              Showing first 50 of {generatedData.length} rows
            </p>
          )}
        </>
      )}
    </div>
  );
}
