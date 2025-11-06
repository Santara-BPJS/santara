"use client";

import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Brain, Database, Zap } from "lucide-react";
import { motion } from "motion/react";

const benefits = [
  {
    icon: Zap,
    title: "Akses Seketika",
    description: "Cari pasal, kebijakan, dan SOP tanpa 'bongkar berkas'.",
  },
  {
    icon: Database,
    title: "Satu Sumber Kebenaran",
    description: "Semua dokumen penting menjadi satu kesatuan pengetahuan.",
  },
  {
    icon: Brain,
    title: "Bantu Keputusan",
    description:
      "Bukan sekadar chatbot: Santara menyajikan alasan, rujukan, dan perhitungan ringkas.",
  },
];

export default function BenefitsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section>
      <div className="container mx-auto space-y-16 px-4 py-20">
        <motion.div
          className="space-y-4 text-center"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          <h2 className="text-balance font-extrabold text-4xl">
            Mengapa Santara?
          </h2>
          <p className="text-muted-foreground text-xl">
            Solusi terpadu untuk mempercepat dan memperkuat verifikasi klaim
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-6"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true }}
          whileInView="visible"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <motion.div key={benefit.title} variants={itemVariants}>
                <Card className="group hover:-translate-y-1 cursor-pointer space-y-4 transition-all duration-300">
                  <CardHeader>
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-bold text-xl">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
