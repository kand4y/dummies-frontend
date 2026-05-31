import { COLUMN_TYPES, type ColumnDefinition } from "@/types/column-types";
import { Button } from "@/components/ui/button";

interface ColumnEditorProps {
  column: ColumnDefinition;
  index: number;
  onChange: (index: number, column: ColumnDefinition) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export function ColumnEditor({
  column,
  index,
  onChange,
  onRemove,
  canRemove,
}: ColumnEditorProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        placeholder="Column Name"
        value={column.name}
        onChange={(e) => onChange(index, { ...column, name: e.target.value })}
      />
      <select
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        value={column.type}
        onChange={(e) =>
          onChange(index, {
            ...column,
            type: e.target.value as ColumnDefinition["type"],
          })
        }
      >
        {COLUMN_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <Button
        variant="danger"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        className="px-3"
      >
        &times;
      </Button>
    </div>
  );
}
