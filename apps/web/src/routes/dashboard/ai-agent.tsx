import { Button } from "@/shared/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import AnalysisResults from "../../features/ai-agent/components/analysis-results";
import AnalysisStatistics from "../../features/ai-agent/components/analysis-statistics";
import DocumentUploadZone from "../../features/ai-agent/components/document-upload-zone";

export const Route = createFileRoute("/dashboard/ai-agent")({
  component: RouteComponent,
});

type Finding = {
  id: string;
  title: string;
  description: string;
  status: "sesuai" | "tidak-sesuai";
  sourceFile: string;
  recommendation?: string;
};

function RouteComponent() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const mockFindings: Finding[] = [
    {
      id: "1",
      title: "Pasal 19, SOP Verifikasi Terbaru (Edisi 3 2024)",
      description:
        "Terdapat perbedaan antara biaya yang diajukan dengan standar tarif regional. Total klaim mengalami overestimate sebesar 12-15%. Provider perlu memberikan justifikasi tertulis mengenai komponen biaya tambahan yang tidak sesuai dengan SOP.",
      status: "tidak-sesuai",
      sourceFile: "Web Forensics 2.pdf",
      recommendation:
        "Hubungi provider untuk penjelasan detail dan bukti pendukung biaya",
    },
    {
      id: "2",
      title: "Pasal 15, Peraturan Menteri Kesehatan No. 28/2014",
      description:
        "Dokumen klaim memenuhi persyaratan administratif sesuai PMK 28/2014",
      status: "sesuai",
      sourceFile: "Web Forensics 2.pdf",
    },
    {
      id: "3",
      title: "SE No. 5/2025 tentang Penolakan Klaim",
      description:
        "Prosedur penolakan klaim telah sesuai dengan panduan SE No. 5/2025",
      status: "sesuai",
      sourceFile: "Web Forensics 2.pdf",
    },
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
      // biome-ignore lint/style/noMagicNumbers: temp
    }, 2000);
  };

  const handleNewAnalysis = () => {
    setUploadedFiles([]);
    setHasAnalyzed(false);
  };

  const handleDownloadReport = () => {
    // TODO: Implement report download
  };

  const complianceScore = 82;
  const matchedFindings = 2;
  const potentialIssues = 1;
  const documentsAnalyzed = 1;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-bold text-3xl">AI Agent</h1>
        <p className="text-muted-foreground">
          Analisis ketidaksesuaian dokumen berbasis pengetahuan terverifikasi
        </p>
      </div>

      {hasAnalyzed ? (
        <>
          <AnalysisStatistics
            complianceScore={complianceScore}
            documentsAnalyzed={documentsAnalyzed}
            matchedFindings={matchedFindings}
            potentialIssues={potentialIssues}
          />

          <AnalysisResults
            findings={mockFindings}
            onDownloadReport={handleDownloadReport}
            onNewAnalysis={handleNewAnalysis}
          />
        </>
      ) : (
        <>
          <DocumentUploadZone
            onFilesChange={setUploadedFiles}
            uploadedFiles={uploadedFiles}
          />

          {uploadedFiles.length > 0 && (
            <Button
              className="w-full"
              disabled={isAnalyzing}
              onClick={handleAnalyze}
              size="lg"
            >
              {isAnalyzing
                ? "Menganalisis..."
                : `Generate Analisis (${uploadedFiles.length} dokumen)`}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
