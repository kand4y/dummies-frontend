import { useState } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "@/hooks/use-projects";
import { useApi } from "@/hooks/use-api";
import { projectSchema } from "@/schemas/project";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";

export function ProjectsPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useProjects(page);
  const api = useApi();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = projectSchema.safeParse({ name, description });
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (!errors[path]) errors[path] = issue.message;
      }
      setFormErrors(errors);
      return;
    }

    setCreating(true);
    try {
      await api("/api/v1/projects", {
        method: "POST",
        body: JSON.stringify({
          name,
          description: description || null,
        }),
      });
      setShowCreate(false);
      setName("");
      setDescription("");
      refetch();
    } catch {
      setFormErrors({ name: "Failed to create project" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <PageLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Button onClick={() => setShowCreate(true)}>+ New Project</Button>
      </div>

      {error && <ErrorMessage message={error} />}
      {loading && <Loading />}

      {data && (
        <>
          {data.projects.length === 0 ? (
            <p className="py-12 text-center text-gray-400">
              No projects yet. Create your first project!
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <h3 className="font-semibold text-gray-900">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6">
            <Pagination
              currentPage={data.page}
              totalCount={data.total_count}
              perPage={data.per_page}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Project"
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={formErrors.name}
            placeholder="My Project"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
            {formErrors.description && (
              <p className="text-xs text-red-600">{formErrors.description}</p>
            )}
          </div>
          <Button type="submit" disabled={creating}>
            {creating ? "Creating..." : "Create"}
          </Button>
        </form>
      </Modal>
    </PageLayout>
  );
}
