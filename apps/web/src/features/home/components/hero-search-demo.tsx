/** biome-ignore-all lint/suspicious/noArrayIndexKey: false positive */
/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: false positive */
/** biome-ignore-all lint/style/noMagicNumbers: false positive */

import { Card } from "@/shared/components/ui/card";
import { AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Badge } from "../../../shared/components/ui/badge";

const qaSequence = [
  {
    question: "Cari pasal tentang verifikasi klaim rawat inap darurat",
    answer:
      "Verifikasi klaim rawat inap darurat diatur dalam Pasal 19 Peraturan Menteri Kesehatan No. 28/2014 tentang Panduan Teknis BPJS. Proses verifikasi harus dilakukan dalam 5 hari kerja dengan mempertimbangkan kelengkapan dokumen dan kebenaran kode diagnosa.",
    sources: [
      {
        title: "Pasal 19 Peraturan Menteri Kesehatan No. 28/2014",
        tag: "Regulasi",
        icon: FileText,
      },
      {
        title: "SOP Verifikasi Klaim Rawat Inap - Edisi 3 2024",
        tag: "SOP",
        icon: CheckCircle2,
      },
      {
        title: "Pedoman Teknis BPJS Kesehatan",
        tag: "Panduan",
        icon: FileText,
      },
    ],
  },
  {
    question: "Bagaimana prosedur approval untuk klaim di atas 100 juta?",
    answer:
      "Klaim di atas 100 juta memerlukan persetujuan dari Komite Medis tingkat Provinsi. Dokumen yang diperlukan meliputi hasil pemeriksaan medis lengkap, catatan medis pasien, dan justifikasi medis dari rumah sakit. Waktu proses dapat mencapai 10 hari kerja.",
    sources: [
      {
        title: "Surat Edaran Direktur BPJS No. 45/2023",
        tag: "SE",
        icon: AlertCircle,
      },
      {
        title: "Kebijakan Limit Verifikasi Klaim Besar",
        tag: "Kebijakan",
        icon: CheckCircle2,
      },
      { title: "Template Formulir Komite Medis", tag: "Form", icon: FileText },
    ],
  },
  {
    question: "SOP terbaru untuk penanganan klaim penolakan",
    answer:
      "Penanganan klaim penolakan harus mengikuti prosedur banding berlapis. Tahap pertama adalah banding internal BPJS dalam 3 hari kerja, dilanjutkan dengan mediasi jika diperlukan. Setiap penolakan harus didokumentasikan dengan alasan yang jelas dan terukur.",
    sources: [
      {
        title: "SOP Penanganan Klaim Penolakan - Versi 2024",
        tag: "SOP",
        icon: CheckCircle2,
      },
      { title: "Panduan Proses Banding Klaim", tag: "Panduan", icon: FileText },
      {
        title: "Template Surat Penolakan Klaim",
        tag: "Template",
        icon: AlertCircle,
      },
    ],
  },
];

export default function HeroSearchDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [stage, setStage] = useState<"question" | "answer" | "sources">(
    "question"
  );

  const currentQA = qaSequence[currentIndex];

  useEffect(() => {
    const sequence = async () => {
      if (
        stage === "question" &&
        displayedQuestion.length < currentQA.question.length
      ) {
        await new Promise((resolve) => setTimeout(resolve, 30));
        setDisplayedQuestion(
          currentQA.question.slice(0, displayedQuestion.length + 1)
        );
        return;
      }

      if (
        stage === "question" &&
        displayedQuestion.length === currentQA.question.length
      ) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setStage("answer");
        setShowAnswer(true);
        return;
      }

      if (
        stage === "answer" &&
        displayedAnswer.length < currentQA.answer.length
      ) {
        await new Promise((resolve) => setTimeout(resolve, 20));
        setDisplayedAnswer(
          currentQA.answer.slice(0, displayedAnswer.length + 1)
        );
        return;
      }

      if (
        stage === "answer" &&
        displayedAnswer.length === currentQA.answer.length
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setStage("sources");
        setShowSources(true);
        return;
      }

      if (stage === "sources") {
        await new Promise((resolve) => setTimeout(resolve, 4000));
        setCurrentIndex((prev) => (prev + 1) % qaSequence.length);
        setDisplayedQuestion("");
        setDisplayedAnswer("");
        setShowAnswer(false);
        setShowSources(false);
        setStage("question");
        return;
      }
    };

    sequence();
  }, [displayedQuestion, displayedAnswer, stage, currentQA]);

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
      initial={{ opacity: 0, scale: 0.95 }}
      layout
      transition={{ duration: 0.6 }}
    >
      <Card className="space-y-2 p-6">
        {/* Question Section */}
        <motion.div className="space-y-2" layout>
          <p className="font-semibold text-primary text-xs uppercase tracking-wide">
            Pertanyaan
          </p>
          <div className="flex min-h-16 items-center gap-2 rounded-lg border bg-muted p-4">
            <span className="font-medium text-sm leading-relaxed md:text-base">
              {displayedQuestion}
            </span>
            {displayedQuestion.length < currentQA.question.length && (
              <motion.span
                animate={{ opacity: [0, 1] }}
                className="font-bold text-lg text-primary"
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
              >
                |
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Answer Section */}
        <AnimatePresence>
          {showAnswer && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 border-t pt-2"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              layout
            >
              <p className="font-semibold text-primary text-xs uppercase tracking-wide">
                Jawaban
              </p>
              <motion.p className="line-clamp-4 text-sm leading-relaxed" layout>
                {displayedAnswer}
                {displayedAnswer.length < currentQA.answer.length && (
                  <motion.span
                    animate={{ opacity: [0, 1] }}
                    className="font-bold text-primary"
                    transition={{
                      duration: 0.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    |
                  </motion.span>
                )}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sources Section */}
        <AnimatePresence>
          {showSources && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 border-t pt-2"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              layout
            >
              <p className="font-semibold text-primary text-xs uppercase tracking-wide">
                Sumber
              </p>
              <div className="space-y-2">
                {currentQA.sources.map((source, i) => {
                  const Icon = source.icon;
                  return (
                    <motion.div
                      animate={{ opacity: 1, x: 0 }}
                      className="rounded-lg border p-3 transition duration-200 hover:border-primary"
                      initial={{ opacity: 0, x: -10 }}
                      key={i}
                      layout
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm">{source.title}</p>
                          <Badge variant="secondary">{source.tag}</Badge>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
