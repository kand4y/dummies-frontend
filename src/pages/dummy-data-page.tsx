import { useParams, Link } from "react-router-dom";
import { useDummyData } from "@/hooks/use-dummy-data";
import { useApi } from "@/hooks/use-api";
import type { ColumnDefinition, ColumnType } from "@/types/column-types";
import { PageLayout } from "@/components/layout/page-layout";
import { DummyBuilder } from "@/components/dummy-builder/dummy-builder";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";

export function DummyDataPage() {
  const { id, uuid } = useParams<{ id: string; uuid: string }>();
  const api = useApi();
  const { data, loading, error } = useDummyData(uuid!);

  const handleSave = async (
    tableName: string,
    columns: ColumnDefinition[],
  ) => {
    await api(`/api/v1/dummies/${uuid}`, {
      method: "PUT",
      body: JSON.stringify({
        table_name: tableName,
        column_name: columns.map((c) => c.name),
        column_type: columns.map((c) => c.type),
        column_validate: columns.map((c) => c.validate),
      }),
    });
  };

  if (loading) {
    return (
      <PageLayout>
        <Loading />
      </PageLayout>
    );
  }
  if (error || !data) {
    return (
      <PageLayout>
        <ErrorMessage message={error || "Not found"} />
      </PageLayout>
    );
  }

  const initialColumns: ColumnDefinition[] = data.column_name.map(
    (name, i) => ({
      name,
      type: (data.column_type[i] ?? "TEXT") as ColumnType,
      validate: data.column_validate[i] ?? "",
    }),
  );

  return (
    <PageLayout>
      <div className="mb-6">
        <Link
          to={`/projects/${id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          &larr; Back to Project
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          {data.table_name}
        </h1>
      </div>
      <DummyBuilder
        initialTableName={data.table_name}
        initialColumns={initialColumns}
        onSave={handleSave}
      />
    </PageLayout>
  );
}
