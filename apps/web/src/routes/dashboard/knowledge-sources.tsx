import { createFileRoute } from "@tanstack/react-router";
import ComingSoon from "../../shared/components/coming-soon";

export const Route = createFileRoute("/dashboard/knowledge-sources")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-full grow items-center justify-center p-2">
      <ComingSoon />
    </div>
  );
}
