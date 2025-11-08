import { RegisterForm } from "@/features/auth/components/register-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-accent p-6">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
