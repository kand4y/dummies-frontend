import type { ColumnDefinition, ColumnType } from "@/types/column-types";
import { Button } from "@/components/ui/button";
import { ColumnEditor } from "./column-editor";

interface ColumnListProps {
  columns: ColumnDefinition[];
  onChange: (columns: ColumnDefinition[]) => void;
}

const DEFAULT_COLUMN: ColumnDefinition = {
  name: "",
  type: "TEXT" as ColumnType,
  validate: "",
};

export function ColumnList({ columns, onChange }: ColumnListProps) {
  const handleChange = (index: number, column: ColumnDefinition) => {
    const updated = [...columns];
    updated[index] = column;
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    onChange(columns.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    onChange([...columns, { ...DEFAULT_COLUMN }]);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Columns</h3>
        <Button variant="secondary" onClick={handleAdd} className="text-xs">
          + Add Column
        </Button>
      </div>
      {columns.map((col, i) => (
        <ColumnEditor
          key={i}
          column={col}
          index={i}
          onChange={handleChange}
          onRemove={handleRemove}
          canRemove={columns.length > 1}
        />
      ))}
    </div>
  );
}
