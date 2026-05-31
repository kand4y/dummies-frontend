import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { useApi } from "@/hooks/use-api";
import type { User } from "@/types";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";

export function UserPage() {
  const api = useApi();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [userHandle, setUserHandle] = useState("");
  const [userName, setUserName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api<User>("/api/v1/user")
      .then((u) => {
        if (cancelled) return;
        setUser(u);
        setUserHandle(u.user_handle);
        setUserName(u.user_name);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    try {
      await api("/api/v1/user", {
        method: "PUT",
        body: JSON.stringify({
          user_handle: userHandle,
          user_name: userName,
        }),
      });
      setSaveMsg("Profile updated!");
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api("/api/v1/user", { method: "DELETE" });
      await signOut();
      navigate("/");
    } catch {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <Loading />
      </PageLayout>
    );
  }
  if (error) {
    return (
      <PageLayout>
        <ErrorMessage message={error} />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Account</h1>

      <div className="mx-auto max-w-md">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="text-sm text-gray-500">
            User ID: <span className="font-mono text-xs">{user?.id}</span>
          </div>
          <Input
            label="Handle"
            value={userHandle}
            onChange={(e) => setUserHandle(e.target.value)}
            placeholder="your_handle"
          />
          <Input
            label="Display Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your Name"
          />
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Update Profile"}
          </Button>
          {saveMsg && (
            <p className="text-sm text-gray-600">{saveMsg}</p>
          )}
        </form>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
          <p className="mt-1 text-sm text-gray-500">
            Deleting your account is permanent and cannot be undone.
          </p>
          <Button
            variant="danger"
            className="mt-3"
            onClick={() => setShowDelete(true)}
          >
            Delete Account
          </Button>
        </div>
      </div>

      <Modal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Account"
      >
        <p className="mb-4 text-sm text-gray-600">
          Are you sure? This will permanently delete your account and all
          associated data.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </Modal>
    </PageLayout>
  );
}
