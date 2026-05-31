import { Button } from "@/components/ui/button";

interface ExportControlsProps {
  onExportCSV: () => void;
  onExportSQL: () => void;
  disabled: boolean;
}

export function ExportControls({
  onExportCSV,
  onExportSQL,
  disabled,
}: ExportControlsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="secondary" onClick={onExportCSV} disabled={disabled}>
        Download CSV
      </Button>
      <Button variant="secondary" onClick={onExportSQL} disabled={disabled}>
        Download SQL
      </Button>
    </div>
  );
}
