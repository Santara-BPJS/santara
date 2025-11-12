"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { motion } from "motion/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../shared/components/ui/avatar";

const testimonials = [
  {
    stars: 5,
    quote:
      "Sejak pakai Santara, proses verifikasi jadi lebih cepat & konsisten. Kami tak lagi mencari-cari file lama.",
    image: "https://i.pravatar.cc/300?img=47",
    name: "Rani",
    role: "Verifikator Klaim, RS Rujukan",
  },
];

export default function TestimonialsSection() {
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
    <section className="bg-secondary">
      <div className="container mx-auto space-y-16 px-4 py-20">
        <motion.div
          className="space-y-4 text-center"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          <h2 className="text-balance font-extrabold text-4xl text-primary">
            Apa Kata Pengguna Kami
          </h2>
        </motion.div>

        <motion.div
          className="mx-auto max-w-2xl"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true }}
          whileInView="visible"
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.name} variants={itemVariants}>
              <Card className="group hover:-translate-y-1 h-full cursor-pointer space-y-4 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: testimonial.stars }).map((_, i) => (
                      <svg
                        className="text-primary"
                        fill="currentColor"
                        height="16"
                        // biome-ignore lint/suspicious/noArrayIndexKey: false positive
                        key={i}
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Star Icon</title>
                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                      </svg>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={testimonial.image} />
                      <AvatarFallback>
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
