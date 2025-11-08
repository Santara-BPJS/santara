"use client";

import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import { motion } from "motion/react";
import { Button } from "../../../shared/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../../../shared/components/ui/field";
import { Input } from "../../../shared/components/ui/input";
import { Textarea } from "../../../shared/components/ui/textarea";

export default function ContactSection() {
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

  return (
    <section id="contact">
      <div className="container mx-auto space-y-16 px-4 py-20">
        <motion.div
          className="space-y-4 text-center"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          <h2 className="text-balance font-extrabold text-4xl">Hubungi Kami</h2>
          <p className="text-muted-foreground text-xl">
            Ada pertanyaan? Tim kami siap membantu.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-2xl"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true }}
          whileInView="visible"
        >
          <Card className="group hover:-translate-y-1 h-full cursor-pointer space-y-4 transition-all duration-300">
            <CardContent>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Nama</FieldLabel>
                    <Input
                      autoComplete="off"
                      id="name"
                      placeholder="Masukkan nama lengkap Anda"
                    />
                    <FieldError />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      autoComplete="off"
                      id="email"
                      placeholder="Masukkan alamat email Anda"
                    />
                    <FieldError />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="message">Pesan</FieldLabel>
                    <Textarea
                      id="message"
                      placeholder="Tulis pesan Anda di sini"
                      rows={4}
                    />
                    <FieldError />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Kirim Pesan</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
