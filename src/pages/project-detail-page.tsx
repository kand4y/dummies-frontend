import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProject } from "@/hooks/use-projects";
import { useDummyDataList } from "@/hooks/use-dummy-data";
import { useApi } from "@/hooks/use-api";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const api = useApi();
  const { project, loading: pLoading, error: pError } = useProject(id!);
  const {
    data: dummies,
    loading: dLoading,
    error: dError,
    refetch,
  } = useDummyDataList(id!);

  const [showCreate, setShowCreate] = useState(false);
  const [tableName, setTableName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCreateDummy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableName.trim()) {
      setCreateError("Table name is required");
      return;
    }
    setCreating(true);
    setCreateError("");
    try {
      await api(`/api/v1/projects/${id}/dummies`, {
        method: "POST",
        body: JSON.stringify({
          table_name: tableName,
          column_name: ["id", "name"],
          column_type: ["INTEGER", "TEXT"],
          column_validate: [],
        }),
      });
      setShowCreate(false);
      setTableName("");
      refetch();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteDummy = async (uuid: string) => {
    try {
      await api(`/api/v1/dummies/${uuid}`, { method: "DELETE" });
      refetch();
    } catch {
      // silent
    }
  };

  const handleDeleteProject = async () => {
    setDeleting(true);
    try {
      await api(`/api/v1/projects/${id}`, { method: "DELETE" });
      navigate("/projects");
    } catch {
      setDeleting(false);
    }
  };

  if (pLoading || dLoading) {
    return (
      <PageLayout>
        <Loading />
      </PageLayout>
    );
  }
  if (pError) {
    return (
      <PageLayout>
        <ErrorMessage message={pError} />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="mb-6">
        <Link
          to="/projects"
          className="text-sm text-blue-600 hover:underline"
        >
          &larr; Back to Projects
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {project?.name}
            </h1>
            {project?.description && (
              <p className="mt-1 text-sm text-gray-500">
                {project.description}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowCreate(true)}>
              + New Dummy Data
            </Button>
            <Button
              variant="danger"
              onClick={() => setShowDeleteProject(true)}
            >
              Delete Project
            </Button>
          </div>
        </div>
      </div>

      {dError && <ErrorMessage message={dError} />}

      {dummies.length === 0 ? (
        <p className="py-12 text-center text-gray-400">
          No dummy data yet. Create your first table!
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {dummies.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
            >
              <Link
                to={`/projects/${id}/${d.id}`}
                className="font-medium text-gray-900 hover:text-blue-600"
              >
                {d.table_name}
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">
                  {d.column_name.length} columns
                </span>
                <Button
                  variant="danger"
                  className="px-2 py-1 text-xs"
                  onClick={() => handleDeleteDummy(d.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Dummy Data"
      >
        <form onSubmit={handleCreateDummy} className="flex flex-col gap-4">
          <Input
            label="Table Name"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            error={createError}
            placeholder="users"
          />
          <Button type="submit" disabled={creating}>
            {creating ? "Creating..." : "Create"}
          </Button>
        </form>
      </Modal>

      <Modal
        open={showDeleteProject}
        onClose={() => setShowDeleteProject(false)}
        title="Delete Project"
      >
        <p className="mb-4 text-sm text-gray-600">
          Are you sure you want to delete this project? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowDeleteProject(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteProject} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </PageLayout>
  );
}
