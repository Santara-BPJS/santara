import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());

  let status: string | null = null;
  if (healthCheck.isLoading) {
    status = "Checking...";
  } else if (healthCheck.data) {
    status = "Connected";
  } else {
    status = "Disconnected";
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`}
            />
            <span className="text-muted-foreground text-sm">{status}</span>
          </div>
        </section>
      </div>
    </div>
  );
}
