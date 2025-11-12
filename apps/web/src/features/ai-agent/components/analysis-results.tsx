import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { AlertCircleIcon, CheckCircleIcon, DownloadIcon } from "lucide-react";

type Finding = {
  id: string;
  title: string;
  description: string;
  status: "sesuai" | "tidak-sesuai";
  sourceFile: string;
  recommendation?: string;
};

type AnalysisResultsProps = {
  findings: Finding[];
  onDownloadReport: () => void;
  onNewAnalysis: () => void;
};

export default function AnalysisResults({
  findings,
  onDownloadReport,
  onNewAnalysis,
}: AnalysisResultsProps) {
  const requiresAttention = findings.filter((f) => f.status === "tidak-sesuai");
  const compliant = findings.filter((f) => f.status === "sesuai");

  return (
    <div className="space-y-6">
      {requiresAttention.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Temuan yang Memerlukan Perhatian</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {requiresAttention.map((finding) => (
              <div
                className="flex flex-row gap-2 rounded-lg border border-orange-200 bg-orange-50 p-4"
                key={finding.id}
              >
                <AlertCircleIcon className="size-5 shrink-0 text-orange-600" />
                <div className="flex flex-1 flex-col gap-4">
                  <div className="flex flex-1 flex-row items-start justify-between gap-2">
                    <h3 className="font-semibold">{finding.title}</h3>
                    <Badge className="mt-1" variant="outline">
                      Potensi Tidak Sesuai
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm">{finding.description}</p>
                  </div>

                  <div className="rounded bg-white p-2">
                    <p className="text-xs">
                      <span className="font-semibold">File Sumber:</span>
                    </p>
                    <p className="text-sm">{finding.sourceFile}</p>
                  </div>

                  {finding.recommendation && (
                    <div className="rounded bg-orange-100 p-2">
                      <p className="font-semibold text-orange-900 text-xs">
                        Tindakan Disarankan:
                      </p>
                      <p className="text-orange-900 text-sm">
                        {finding.recommendation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Semua Temuan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {compliant.map((finding) => (
            <div
              className="flex flex-row gap-2 rounded-lg border border-green-200 bg-green-50 p-3"
              key={finding.id}
            >
              <CheckCircleIcon className="size-5 shrink-0 text-green-600" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-1 flex-row items-center justify-between gap-2">
                  <h4 className="font-semibold text-sm">{finding.title}</h4>
                  <Badge variant="outline">Temuan Sesuai</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">File Sumber:</p>
                  <p className="text-sm">{finding.sourceFile}</p>
                </div>
              </div>
            </div>
          ))}

          {requiresAttention.map((finding) => (
            <div
              className="flex flex-row gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3"
              key={finding.id}
            >
              <AlertCircleIcon className="size-5 shrink-0 text-orange-600" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-1 flex-row items-center justify-between gap-2">
                  <h4 className="font-semibold text-sm">{finding.title}</h4>
                  <Badge variant="outline">Potensi Tidak Sesuai</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">File Sumber:</p>
                  <p className="text-sm">{finding.sourceFile}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-between gap-4">
        <Button className="flex-1" onClick={onDownloadReport} variant="outline">
          <DownloadIcon className="size-4" />
          Unduh Laporan Analisis
        </Button>
        <Button className="flex-1" onClick={onNewAnalysis}>
          Analisis Dokumen Baru
        </Button>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <AlertCircleIcon className="size-5" />
            Catatan
          </CardTitle>
          <CardDescription className="text-blue-800">
            Analisis berbasis pengetahuan terverifikasi Santara. Harap review
            hasil ini dengan tim legal sebelum membuat keputusan final.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
