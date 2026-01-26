"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { examData } from "@/data/questions";
import { Download, Home } from "lucide-react";
import jsPDF from "jspdf";

export default function ResultClient({ id }: { id: string }) {
  const test = examData[id as keyof typeof examData];
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(`submission-${id}`) || "{}");
    setAnswers(data);
    let c = 0;
    if (test) {
      test.questions.forEach((q, i) => { if (data[i] === q.answer) c++; });
      setScore(c);
    }
  }, [id, test]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setTextColor(230, 230, 230);
    doc.setFontSize(50);
    doc.text("HORIZONTRAX", 40, 150, { angle: 45 });
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.text(`HorizonTrax Result: ${test?.title}`, 14, 20);
    doc.text(`Score: ${score}/30`, 14, 30);
    doc.save("HorizonTrax_Result.pdf");
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex items-center justify-center p-6 text-slate-900">
      <div className="bg-white p-12 md:p-20 rounded-[3rem] shadow-2xl text-center max-w-2xl w-full">
        <h1 className="text-3xl font-black mb-4">Exam Results</h1>
        <p className="text-slate-500 mb-10 italic">Performance report for HorizonTrax Candidate</p>
        <div className="text-8xl font-black text-green-600 mb-12">{score} <span className="text-2xl text-slate-300">/ 30</span></div>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button onClick={generatePDF} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all">
            <Download size={20} /> Download PDF
          </button>
          <button onClick={() => window.location.href="/"} className="bg-white border-2 border-slate-200 text-slate-600 px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
            <Home size={20} /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
