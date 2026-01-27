"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { examData } from "@/data/questions";
import { Download, Home, BarChart3, CheckCircle2, XCircle } from "lucide-react";
import jsPDF from "jspdf";

export default function ResultClient({ id }: { id: string }) {
  const test = examData[id as keyof typeof examData];
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, score: 0 });
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(`submission-${id}`) || "{}");
    setAnswers(data);
    let c = 0, inc = 0;
    if (test) {
      test.questions.forEach((q, i) => {
        if (data[i] === q.answer) c++;
        else if (data[i]) inc++;
      });
      setStats({ correct: c, incorrect: inc, score: c });
    }
  }, [id, test]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const addBranding = (pdfDoc: any, pageNum: number) => {
      // 1. Watermark FIRST (Behind text)
      pdfDoc.setTextColor(248, 248, 248); // Very light grey
      pdfDoc.setFontSize(80);
      pdfDoc.text("HORIZONTRAX", 30, 150, { angle: 45 });
      // 2. Header
      pdfDoc.setFontSize(10);
      pdfDoc.setTextColor(180, 180, 180);
      pdfDoc.text("HorizonTrax Professional Performance Report", 14, 10);
      // 3. Footer
      pdfDoc.text(`Page ${pageNum}`, 105, 285, { align: 'center' });
    };

    doc.setFontSize(24);
    doc.setTextColor(22, 163, 74);
    doc.text(`Result: ${test?.title}`, 14, 25);
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Candidate Score: ${stats.score}/30 | Accuracy: ${Math.round((stats.correct/30)*100)}%`, 14, 35);

    let y = 55;
    test?.questions.forEach((q, i) => {
      if (y > 240) { doc.addPage(); y = 30; }
      addBranding(doc, (doc as any).internal.getNumberOfPages());
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`Q${i+1}: ${q.text}`, 14, y, { maxWidth: 180 });
      y += 10;
      doc.setFontSize(9);
      doc.setTextColor(answers[i] === q.answer ? 34 : 220, answers[i] === q.answer ? 197 : 38, 94);
      doc.text(`Your Choice: ${answers[i] || "Skipped"} | Correct: ${q.answer}`, 14, y);
      y += 6;
      doc.setTextColor(120, 120, 120);
      doc.text(`Explanation: ${q.explanation}`, 14, y, { maxWidth: 180 });
      y += 22;
    });

    addBranding(doc, 1);
    doc.save(`HorizonTrax_Official_Report.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] py-12 px-6 text-slate-800 leading-normal">
      <div className="max-w-5xl mx-auto bg-white p-8 md:p-16 rounded-[3rem] shadow-xl border border-green-50">
        <h1 className="text-3xl font-black mb-12 tracking-tighter italic text-green-600 uppercase">HorizonTrax Insights</h1>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 text-center">
            {[
                { label: "Percentage", val: `${Math.round((stats.correct/30)*100)}%`, col: "text-slate-900" },
                { label: "Score", val: `${stats.score}/30`, col: "text-green-600" },
                { label: "Correct", val: stats.correct, col: "text-emerald-500" },
                { label: "Incorrect", val: stats.incorrect, col: "text-red-500" }
            ].map(item => (
              <div key={item.label} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-[0.2em]">{item.label}</p>
                  <p className={`text-4xl font-black ${item.col}`}>{item.val}</p>
              </div>
            ))}
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 bg-green-50/40 p-12 rounded-[3rem] border border-green-50 mb-16">
            <div className="relative w-56 h-56 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90"><circle cx="112" cy="112" r="95" stroke="currentColor" strokeWidth="18" fill="transparent" className="text-green-100" /><circle cx="112" cy="112" r="95" stroke="currentColor" strokeWidth="18" fill="transparent" strokeDasharray={597} strokeDashoffset={597 - (597 * (stats.correct/30))} className="text-green-600 transition-all duration-1000" /></svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black">{Math.round((stats.correct/30)*100)}%</span>
                    <span className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">Accuracy</span>
                </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
               <h3 className="text-2xl font-black text-green-800 mb-4 flex items-center justify-center lg:justify-start gap-3 uppercase tracking-tighter"><BarChart3 /> Advanced Insights</h3>
               <p className="text-slate-500 text-lg mb-8 leading-relaxed">Assessment complete. Download your official HorizonTrax report to view detailed explanations for every question.</p>
               <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <button onClick={generatePDF} className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-bold flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-200"><Download size={20} /> Official PDF Report</button>
                  <button onClick={() => window.location.href="/"} className="bg-white border-2 px-10 py-5 rounded-3xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Back to Dashboard</button>
               </div>
            </div>
        </div>

        <div className="space-y-8">
            <h3 className="text-2xl font-black border-b border-slate-100 pb-6 text-slate-800 uppercase tracking-tighter italic">Detailed Review</h3>
            {test?.questions.map((q, i) => (
              <div key={i} className={`p-8 rounded-[2.5rem] border-2 transition-all ${answers[i] === q.answer ? "border-green-100 bg-green-50/10" : "border-red-50 bg-red-50/10"}`}>
                 <div className="flex justify-between items-center mb-6">
                    <span className="px-4 py-1.5 bg-white rounded-full text-[10px] font-black border border-slate-100 uppercase tracking-[0.2em] text-slate-400">Q {i+1}</span>
                    {answers[i] === q.answer ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
                 </div>
                 <p className="text-xl font-bold text-slate-800 mb-8 leading-relaxed font-serif italic">{q.text}</p>
                 <div className="p-6 bg-white rounded-3xl border border-slate-50 shadow-sm mb-4 grid md:grid-cols-2 gap-4">
                    <p className={`font-bold ${answers[i] === q.answer ? "text-green-600" : "text-red-600"}`}>Your Answer: {answers[i] || "Skipped"}</p>
                    <p className="font-bold text-green-600">Correct: {q.answer}</p>
                 </div>
                 <div className="p-6 bg-green-600/5 rounded-3xl border border-green-600/10">
                    <p className="text-[10px] font-black text-green-600 mb-2 uppercase tracking-widest">HorizonTrax Expert Explanation</p>
                    <p className="text-slate-600 text-sm leading-relaxed">{q.explanation}</p>
                 </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
