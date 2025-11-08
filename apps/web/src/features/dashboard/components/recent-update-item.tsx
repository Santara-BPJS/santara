import { Badge } from "@/shared/components/ui/badge";
import { FileTextIcon } from "lucide-react";

type RecentUpdateItemProps = {
  title: string;
  description: string;
  date: Date;
  type: string;
};

export function RecentUpdateItem({
  title,
  description,
  date,
  type,
}: RecentUpdateItemProps) {
  return (
    <div className="flex items-start gap-4 py-4">
      <FileTextIcon className="size-5 text-primary" />
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-base">{title}</h3>
          <Badge variant="secondary">{type}</Badge>
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
        <p className="text-muted-foreground text-xs">
          {date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </p>
      </div>
    </div>
  );
}
