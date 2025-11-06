"use client";

import { Activity, LockIcon, Shield } from "lucide-react";
import { motion } from "motion/react";

const securityFeatures = [
  {
    icon: Shield,
    title: "Akses Berbasis Peran",
    description: "Kontrol granular untuk setiap tingkat organisasi",
  },
  {
    icon: LockIcon,
    title: "Sumber Tepercaya",
    description: "Hanya dokumen terverifikasi yang disimpan dan diakses",
  },
  {
    icon: Activity,
    title: "Jejak Audit",
    description: "Setiap pencarian dan akses tercatat dengan lengkap",
  },
];

export default function SecuritySection() {
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
            Data Aman &amp; Terverifikasi
          </h2>
          <p className="text-muted-foreground text-xl">
            Keamanan dan compliance adalah prioritas utama kami
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-6"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true }}
          whileInView="visible"
        >
          {securityFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={itemVariants}>
                <div className="flex flex-col items-center gap-6 py-6 text-center">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-xl">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
