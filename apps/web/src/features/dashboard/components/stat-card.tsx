import { Card, CardContent } from "@/shared/components/ui/card";

type StatCardProps = {
  title: string;
  value: string | number;
};

export function StatCard({ title, value }: StatCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">{title}</p>
        <p className="font-bold text-4xl text-green-600">{value}</p>
      </CardContent>
    </Card>
  );
}
