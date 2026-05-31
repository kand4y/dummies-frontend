import { PageLayout } from "@/components/layout/page-layout";
import { DummyBuilder } from "@/components/dummy-builder/dummy-builder";

export function RootPage() {
  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Dummy Data Generator
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Define your columns and generate dummy data instantly. Download as CSV
          or SQL.
        </p>
      </div>
      <DummyBuilder />
    </PageLayout>
  );
}
