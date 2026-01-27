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
    const watermark = "HORIZONTRAX";
    const addBranding = (pdfDoc: any, pageNum: number) => {
      pdfDoc.setTextColor(248, 248, 248);
      pdfDoc.setFontSize(80);
      pdfDoc.text(watermark, 30, 150, { angle: 45 });
      pdfDoc.setFontSize(10);
      pdfDoc.setTextColor(180, 180, 180);
      pdfDoc.text("HorizonTrax Professional Readiness Report", 14, 10);
      pdfDoc.text(`Page ${pageNum}`, 105, 285, { align: 'center' });
    };

    doc.setFontSize(24);
    doc.setTextColor(22, 163, 74);
    doc.text(`${test?.title} Report`, 14, 25);
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Score: ${stats.score}/30 | Accuracy: ${Math.round((stats.correct/30)*100)}%`, 14, 33);

    let y = 55;
    test?.questions.forEach((q, i) => {
      if (y > 240) { doc.addPage(); y = 30; }
      addBranding(doc, (doc as any).internal.getNumberOfPages());
      doc.setFontSize(11); doc.setTextColor(0, 0, 0);
      doc.text(`Q${i+1}: ${q.text}`, 14, y, { maxWidth: 180 });
      y += 10;
      doc.setFontSize(9);
      doc.setTextColor(answers[i] === q.answer ? 34 : 220, answers[i] === q.answer ? 197 : 38, 94);
      doc.text(`Selected: ${answers[i] || "Skipped"} | Correct: ${q.answer}`, 14, y);
      y += 6;
      doc.setTextColor(100, 100, 100);
      doc.text(`Explanation: ${q.explanation}`, 14, y, { maxWidth: 180 });
      y += 22;
    });
    addBranding(doc, 1);
    doc.save(`HorizonTrax_Report.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] py-16 px-6 text-slate-800">
      <div className="max-w-5xl mx-auto bg-white p-8 md:p-20 rounded-[4rem] shadow-2xl border border-green-50">
        <h1 className="text-4xl font-black mb-16 tracking-tighter text-green-600 uppercase italic text-center">HorizonTrax Insights</h1>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 text-center font-black">
            {[
                { label: "Result", val: `${Math.round((stats.correct/30)*100)}%`, col: "text-slate-900" },
                { label: "Score", val: `${stats.score}/30`, col: "text-green-600" },
                { label: "Passed", val: stats.correct, col: "text-emerald-500" },
                { label: "Failed", val: stats.incorrect, col: "text-red-500" }
            ].map(item => (
              <div key={item.label} className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase mb-3 tracking-widest">{item.label}</p>
                  <p className={`text-4xl ${item.col}`}>{item.val}</p>
              </div>
            ))}
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 bg-green-50/50 p-16 rounded-[4rem] border border-green-50 mb-20">
            <div className="relative w-64 h-64 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90"><circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="20" fill="transparent" className="text-green-100" /><circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="20" fill="transparent" strokeDasharray={691} strokeDashoffset={691 - (691 * (stats.correct/30))} className="text-green-600 transition-all duration-1000" /></svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black">{Math.round((stats.correct/30)*100)}%</span>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Accuracy</span>
                </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
               <h3 className="text-3xl font-black text-green-900 mb-6 flex items-center justify-center lg:justify-start gap-4 uppercase tracking-tighter leading-none"><BarChart3 size={32} /> Advanced Insights</h3>
               <p className="text-slate-500 text-xl mb-12 leading-relaxed font-medium">Professional assessment finalized. Review your results below to identify knowledge gaps before your placement drive.</p>
               <div className="flex flex-wrap gap-4 justify-center lg:justify-start font-black text-xs uppercase tracking-widest">
                  <button onClick={generatePDF} className="bg-slate-900 text-white px-10 py-5 rounded-3xl hover:bg-black transition-all shadow-xl shadow-slate-300 flex items-center gap-3 underline decoration-green-500 underline-offset-8 decoration-4"><Download size={20} /> Download Report</button>
                  <button onClick={() => window.location.href="/"} className="bg-white border-4 border-slate-100 px-10 py-5 rounded-3xl text-slate-600 hover:border-green-200 transition-all">Back to Home</button>
               </div>
            </div>
        </div>

        <div className="space-y-12">
            <h3 className="text-3xl font-black border-b-8 border-slate-50 pb-8 text-slate-800 uppercase tracking-tighter italic">Review Submission</h3>
            {test?.questions.map((q, i) => (
              <div key={i} className={`p-10 md:p-14 rounded-[4rem] border-4 transition-all ${answers[i] === q.answer ? "border-green-100 bg-green-50/10" : "border-red-50 bg-red-50/10"}`}>
                 <div className="flex justify-between items-center mb-10">
                    <span className="px-6 py-2 bg-white rounded-full text-[10px] font-black border-2 border-slate-100 uppercase tracking-widest text-slate-400 shadow-sm">Question {i+1}</span>
                    {answers[i] === q.answer ? <CheckCircle2 className="text-green-500" size={32} /> : <XCircle className="text-red-500" size={32} />}
                 </div>
                 <p className="text-2xl font-black text-slate-800 mb-12 leading-tight tracking-tight italic font-serif underline decoration-green-100 underline-offset-8 decoration-8">{q.text}</p>
                 <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="p-8 bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex flex-col items-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase mb-3 tracking-widest">Your Selection</p>
                        <p className={`font-black text-xl ${answers[i] === q.answer ? "text-green-600" : "text-red-600"}`}>{answers[i] || "Skipped"}</p>
                    </div>
                    <div className="p-8 bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex flex-col items-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase mb-3 tracking-widest">Correct Answer</p>
                        <p className="font-black text-xl text-green-600">{q.answer}</p>
                    </div>
                 </div>
                 <div className="p-8 bg-green-600/5 rounded-[2.5rem] border-2 border-green-600/10">
                    <p className="text-[10px] font-black text-green-600 mb-4 uppercase tracking-[0.3em]">HorizonTrax Expert Explanation</p>
                    <p className="text-slate-600 font-bold text-lg leading-relaxed">{q.explanation}</p>
                 </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
