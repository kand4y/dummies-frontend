import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center py-24">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <p className="mt-4 text-lg text-gray-500">Page not found</p>
        <Link to="/" className="mt-6">
          <Button>Go Home</Button>
        </Link>
      </div>
    </PageLayout>
  );
}
