import { createFileRoute } from "@tanstack/react-router";
import { ClockIcon } from "lucide-react";
import { AnimatedSearchInput } from "../../features/dashboard/components/animated-search-input";
import { RecentUpdateItem } from "../../features/dashboard/components/recent-update-item";
import { StatCard } from "../../features/dashboard/components/stat-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../shared/components/ui/card";
import { Skeleton } from "../../shared/components/ui/skeleton";
import { authClient } from "../../shared/lib/auth-client";

export const Route = createFileRoute("/dashboard/home")({
  component: RouteComponent,
});

function RouteComponent() {
  const stats = [
    { title: "Top 5 Pertanyaan Mingguan", value: "5" },
    { title: "Jumlah Dokumen Pengetahuan", value: "247" },
    { title: "Rata-rata Waktu Temuan Jawaban", value: "7 detik" },
    { title: "Penambahan Knowledge Terbaru", value: "12" },
  ];

  const recentUpdates = [
    {
      id: "1",
      title: "Update SOP Verifikasi Klaim - Edisi 4",
      description: "Pembaruan prosedur verifikasi dengan ketentuan terbaru",
      // biome-ignore lint/style/noMagicNumbers: temp
      date: new Date(2025, 0, 15),
      type: "SOP",
    },
    {
      id: "2",
      title: "Surat Edaran: Perubahan Kriteria Penolakan",
      description: "Klarifikasi mengenai kriteria penolakan klaim tertentu",
      // biome-ignore lint/style/noMagicNumbers: temp
      date: new Date(2025, 0, 14),
      type: "SE",
    },
    {
      id: "3",
      title: "Peraturan Menteri Kesehatan No. 5/2025",
      description: "Regulasi terbaru mengenai standar verifikasi klaim",
      // biome-ignore lint/style/noMagicNumbers: temp
      date: new Date(2025, 0, 13),
      type: "Regulasi",
    },
  ];

  const { data, isPending } = authClient.useSession();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-bold text-3xl">
          Selamat datang,{" "}
          {isPending ? (
            <Skeleton className="w-48" />
          ) : (
            <span className="text-primary">{data?.user.name}</span>
          )}
        </h1>
        <p className="text-muted-foreground">
          Akses pengetahuan terverifikasi dan percepat verifikasi klaim Anda
        </p>
      </div>

      <AnimatedSearchInput />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ClockIcon className="size-6 text-primary" />
            Perubahan/Penambahan Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {recentUpdates.map((update) => (
            <RecentUpdateItem
              date={update.date}
              description={update.description}
              key={update.id}
              title={update.title}
              type={update.type}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
