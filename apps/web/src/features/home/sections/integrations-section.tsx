"use client";

import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Cloud, MessageCircle } from "lucide-react";
import { motion } from "motion/react";

const integrations = [
  {
    icon: Cloud,
    title: "Google Drive",
    description: "Hubungkan & analisis dokumen dari Drive Anda.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Bot",
    description:
      "Masukkan Santara ke grup kerja. Percakapan penting otomatis tersimpan sebagai pengetahuan.",
  },
];

export default function IntegrationsSection() {
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
    <section className="bg-secondary" id="integrations">
      <div className="container mx-auto space-y-16 px-4 py-20">
        <motion.div
          className="space-y-4 text-center"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          <h2 className="text-balance font-extrabold text-4xl text-primary">
            Integrasi yang Mendukung
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-6"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true }}
          whileInView="visible"
        >
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <motion.div key={integration.title} variants={itemVariants}>
                <Card className="group hover:-translate-y-1 h-full cursor-pointer space-y-4 transition-all duration-300">
                  <CardHeader>
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-bold text-xl">{integration.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {integration.description}
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
