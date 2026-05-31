import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { loginSchema, signUpSchema } from "@/schemas/auth";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "@/components/ui/error-message";

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGlobalError("");

    const schema = mode === "login" ? loginSchema : signUpSchema;
    const data =
      mode === "login"
        ? { email, password }
        : { email, password, confirmPassword };
    const result = schema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate("/projects");
    } catch (err) {
      setGlobalError(
        err instanceof Error ? err.message : "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="mx-auto max-w-sm pt-12">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          {mode === "login" ? "Login" : "Sign Up"}
        </h1>

        {globalError && <ErrorMessage message={globalError} />}

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="••••••"
          />
          {mode === "signup" && (
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              placeholder="••••••"
            />
          )}
          <Button type="submit" disabled={loading}>
            {loading
              ? "..."
              : mode === "login"
                ? "Login"
                : "Create Account"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </PageLayout>
  );
}
