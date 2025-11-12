import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type AnalysisStatisticsProps = {
  complianceScore: number;
  matchedFindings: number;
  potentialIssues: number;
  documentsAnalyzed: number;
};

export default function AnalysisStatistics({
  complianceScore,
  matchedFindings,
  potentialIssues,
  documentsAnalyzed,
}: AnalysisStatisticsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground text-sm">
            Skor Kepatuhan (%)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-bold text-4xl text-green-600">{complianceScore}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground text-sm">
            Temuan Sesuai
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-bold text-4xl text-green-600">{matchedFindings}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground text-sm">
            Potensi Tidak Sesuai
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-bold text-4xl text-orange-600">
            {potentialIssues}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground text-sm">
            Dokumen Dianalisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-bold text-4xl">{documentsAnalyzed}</p>
        </CardContent>
      </Card>
    </div>
  );
}
