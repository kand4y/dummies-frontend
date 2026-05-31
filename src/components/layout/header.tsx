import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="text-lg font-bold text-gray-900">
          Dummies
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/projects"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Projects
              </Link>
              <Link
                to="/user"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Account
              </Link>
              <Button variant="ghost" onClick={signOut}>
                Logout
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="primary">Login</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
