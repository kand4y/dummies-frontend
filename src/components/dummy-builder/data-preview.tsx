interface DataPreviewProps {
  columnNames: string[];
  rows: Record<string, string>[];
}

export function DataPreview({ columnNames, rows }: DataPreviewProps) {
  if (rows.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-xs font-medium text-gray-500">#</th>
            {columnNames.map((name) => (
              <th
                key={name}
                className="px-3 py-2 text-xs font-medium text-gray-500"
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-gray-100">
              <td className="px-3 py-2 text-xs text-gray-400">{i + 1}</td>
              {columnNames.map((name) => (
                <td
                  key={name}
                  className="max-w-[200px] truncate px-3 py-2 text-xs text-gray-700"
                >
                  {row[name]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
