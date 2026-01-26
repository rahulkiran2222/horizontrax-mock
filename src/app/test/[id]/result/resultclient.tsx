"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { examData } from "@/data/questions";
import { Download, Home } from "lucide-react";
import jsPDF from "jspdf";

export default function ResultClient({ id }: { id: string }) {
  const test = examData[id as keyof typeof examData];
  const [stats, setStats] = useState({ correct: 0, score: 0 });
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(`submission-${id}`) || "{}");
    setAnswers(data);
    let c = 0;
    if (test) {
      test.questions.forEach((q, i) => {
        if (data[i] === q.answer) c++;
      });
      setStats({ correct: c, score: c });
    }
  }, [id, test]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("HORIZONTRAX REPORT", 14, 20);
    test?.questions.forEach((q, i) => {
      const y = 40 + (i * 10);
      if (y < 280) doc.text(`Q${i+1}: ${q.answer === answers[i] ? 'Correct' : 'Wrong'}`, 14, y);
    });
    doc.save("Result.pdf");
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] p-12 text-center text-slate-900">
      <div className="bg-white p-16 rounded-[3rem] shadow-xl inline-block">
        <h1 className="text-3xl font-black mb-6 uppercase tracking-tighter text-slate-800">Exam Complete</h1>
        <div className="text-6xl font-black text-green-600 mb-10">{stats.score} / 30</div>
        <div className="flex gap-4 justify-center">
          <button onClick={generatePDF} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all">
            <Download size={18} /> Download PDF
          </button>
          <button onClick={() => window.location.href="/"} className="border-2 border-slate-200 px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all text-slate-600">
            <Home size={18} /> Home
          </button>
        </div>
      </div>
    </div>
  );
}
