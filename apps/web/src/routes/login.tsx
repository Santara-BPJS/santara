import { LoginForm } from "@/features/auth/components/login-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-accent p-6">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
