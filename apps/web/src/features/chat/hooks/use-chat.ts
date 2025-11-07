import { useEffect, useRef, useState } from "react";
import type { Message } from "../types";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim() || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Proses verifikasi klaim rawat inap memerlukan beberapa dokumen penting yang harus disiapkan. Setiap klaim harus diperiksa kelengkapan administratifnya, termasuk dokumen pendukung seperti surat rujukan, riwayat rawat inap, dan rincian biaya medis.\n\nKepatuhan terhadap regulasi adalah prioritas utama dalam setiap proses verifikasi. Tim Anda harus memastikan bahwa setiap keputusan didokumentasikan dengan baik dan dapat dipertanggungjawabkan.\n\nUntuk klaim-klaim kompleks atau yang memerlukan klarifikasi lebih lanjut, hubungi provider secara langsung dan minta penjelasan detail mengenai prosedur atau biaya yang dipertanyakan.",
        sender: "assistant",
        timestamp: new Date(),
        sources: [
          {
            id: "1",
            title: "Pasal 19 Peraturan Menteri Kesehatan No. 28/2014",
            filename: "PMK_28_2014.pdf",
          },
          {
            id: "2",
            title: "SOP Verifikasi Klaim Rawat Inap - Edisi 3 2024",
            filename: "SOP_Verifikasi_2024.pdf",
          },
          {
            id: "3",
            title: "SE No. 5/2025 Klarifikasi Penolakan Klaim",
            filename: "SE_5_2025.pdf",
          },
        ],
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
      // biome-ignore lint/style/noMagicNumbers: temporary simulation
    }, 1000);
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    messagesEndRef,
    handleSendMessage,
  };
}
