import type { NamespaceDict } from "@/lib/i18n/types";

// ============================================================
// PUSAKA — Kamus namespace "saka" (Chat widget SAKA)
// Nama "SAKA" dibiarkan. Logika POST/typing/auto-scroll tidak tersentuh.
// ============================================================

export const sakaDict: NamespaceDict = {
  id: {
    welcome:
      "Assalamu'alaikum! 👋\nSaya SAKA, asisten virtual PUSAKA. Tanyakan apa saja seputar sertifikasi PIHK, PPIU, BPW, IATA, izin umrah & haji, verifikasi sertifikat, atau layanan kami di 32 negara.",
    chips: {
      about: "Apa itu PUSAKA?",
      programs: "Program & biaya sertifikasi",
      verify: "Cara verifikasi sertifikat",
      services: "Layanan di negara saya",
    },
    errorReply: "Mohon maaf, koneksi sedang terganggu. Coba lagi ya.",
    header: {
      role: "Asisten AI PUSAKA",
      status: "Online • Balas instan",
    },
    aria: {
      toggleOpen: "Buka SAKA, asisten AI",
      toggleClose: "Tutup SAKA",
      dialog: "SAKA Asisten AI",
      typing: "SAKA sedang mengetik",
      send: "Kirim pesan",
    },
    input: {
      label: "Pertanyaan Anda",
      placeholder: "Tulis pertanyaan Anda…",
      aria: "Tulis pertanyaan Anda untuk SAKA",
    },
  },
  en: {
    welcome:
      "Assalamu'alaikum! 👋\nI am SAKA, PUSAKA's virtual assistant. Ask me anything about PIHK, PPIU, BPW, IATA certification, umrah & hajj licenses, certificate verification, or our services across 32 countries.",
    chips: {
      about: "What is PUSAKA?",
      programs: "Programs & certification fees",
      verify: "How to verify a certificate",
      services: "Services in my country",
    },
    errorReply: "Our apologies, the connection is currently interrupted. Please try again.",
    header: {
      role: "PUSAKA AI Assistant",
      status: "Online • Instant replies",
    },
    aria: {
      toggleOpen: "Open SAKA, AI assistant",
      toggleClose: "Close SAKA",
      dialog: "SAKA AI Assistant",
      typing: "SAKA is typing",
      send: "Send message",
    },
    input: {
      label: "Your question",
      placeholder: "Type your question…",
      aria: "Type your question for SAKA",
    },
  },
  ar: {
    welcome:
      "السلام عليكم! 👋\nأنا ساكا، المساعد الافتراضي لبوساكا. اسألوني عن أي شيء يتعلق بشهادات PIHK وPPIU وBPW وIATA، أو تراخيص العمرة والحج، أو التحقق من الشهادات، أو خدماتنا في 32 دولة.",
    chips: {
      about: "ما هي بوساكا؟",
      programs: "البرامج ورسوم الاعتماد",
      verify: "كيفية التحقق من الشهادة",
      services: "خدماتنا في بلدكم",
    },
    errorReply: "نعتذر، الاتصال متقطع حاليًا. يرجى المحاولة مرة أخرى.",
    header: {
      role: "المساعد الذكي لبوساكا",
      status: "متصل • رد فوري",
    },
    aria: {
      toggleOpen: "افتح ساكا، المساعد الذكي",
      toggleClose: "أغلق ساكا",
      dialog: "ساكا المساعد الذكي",
      typing: "ساكا يكتب الآن",
      send: "إرسال الرسالة",
    },
    input: {
      label: "سؤالكم",
      placeholder: "اكتبوا سؤالكم…",
      aria: "اكتبوا سؤالكم لساكا",
    },
  },
};
