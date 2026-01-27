"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { examData } from "@/data/questions";
import { Download, Home, CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";

export default function ResultClient({ id }: { id: string }) {
  const test = examData[id as keyof typeof examData];
  const [score, setScore] = useState(0);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(`submission-${id}`) || "{}");
    let c = 0;
    if (test) {
      test.questions.forEach((q, i) => { if (data[i] === q.answer) c++; });
      setScore(c);
    }
  }, [id, test]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(22, 163, 74);
    doc.text("HORIZONTRAX REPORT", 14, 20);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Exam: ${test?.title}`, 14, 32);
    doc.text(`Final Score: ${score}/30`, 14, 42);
    doc.save(`HorizonTrax_${id}_Result.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex items-center justify-center p-6 text-slate-900">
      <div className="bg-white p-12 md:p-20 rounded-[3rem] shadow-2xl text-center max-w-2xl w-full">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tight">Examination Complete</h1>
        <p className="text-slate-400 mb-12 font-medium">Your score has been processed by HorizonTrax Insights.</p>
        <div className="text-8xl font-black text-green-600 mb-12">{score} <span className="text-2xl text-slate-200">/ 30</span></div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={generatePDF} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all">
            <Download size={20} /> Download PDF
          </button>
          <button onClick={() => window.location.href="/"} className="bg-white border-2 border-slate-200 text-slate-600 px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
            <Home size={20} /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
