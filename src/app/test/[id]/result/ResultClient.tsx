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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const rawData = localStorage.getItem(`submission-${id}`);
    const data = rawData ? JSON.parse(rawData) : {};
    setAnswers(data);
    
    let c = 0, inc = 0;
    if (test && test.questions) {
      test.questions.forEach((q, i) => {
        if (data[i] === q.answer) c++;
        else if (data[i]) inc++;
      });
      setStats({ correct: c, incorrect: inc, score: c });
      setIsLoading(false);
    }
  }, [id, test]);

  if (isLoading || !test) return <div className="h-screen flex items-center justify-center">Processing Results...</div>;

  const generatePDF = () => {
    const doc = new jsPDF();
    const watermark = "HORIZONTRAX";
    const addBranding = (pdfDoc: any, pageNum: number) => {
      pdfDoc.setTextColor(248, 248, 248);
      pdfDoc.setFontSize(80);
      pdfDoc.text(watermark, 30, 150, { angle: 45 });
      pdfDoc.setFontSize(9);
      pdfDoc.setTextColor(180, 180, 180);
      pdfDoc.text("HorizonTrax Professional Performance Report", 14, 10);
      pdfDoc.text(`Page ${pageNum}`, 105, 285, { align: 'center' });
    };

    doc.setFontSize(22); doc.setTextColor(22, 163, 74);
    doc.text(`Official Report: ${test.title}`, 14, 25);
    
    let y = 50;
    test.questions.forEach((q, i) => {
      if (y > 240) { doc.addPage(); y = 30; }
      addBranding(doc, (doc as any).internal.getNumberOfPages());
      doc.setFontSize(11); doc.setTextColor(0, 0, 0);
      doc.text(`Q${i+1}: ${q.text}`, 14, y, { maxWidth: 180 });
      y += 10;
      doc.setFontSize(9); doc.setTextColor(answers[i] === q.answer ? 34 : 220, answers[i] === q.answer ? 197 : 38, 94);
      doc.text(`Selected: ${answers[i] || "Skipped"} | Correct: ${q.answer}`, 14, y);
      y += 6;
      doc.setTextColor(100, 100, 100);
      doc.text(`Explanation: ${q.explanation}`, 14, y, { maxWidth: 180 });
      y += 18;
    });
    addBranding(doc, 1);
    doc.save(`HorizonTrax_Report.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] py-10 md:py-16 px-4 text-slate-800 leading-normal">
      <div className="max-w-5xl mx-auto bg-white p-6 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-xl border border-green-50">
        <h1 className="text-3xl md:text-4xl font-black mb-12 tracking-tighter text-green-600 uppercase italic text-center">HorizonTrax Insights</h1>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16 text-center font-black">
            {[
                { label: "Result", val: `${Math.round((stats.correct/30)*100)}%`, col: "text-slate-900" },
                { label: "Score", val: `${stats.score}/30`, col: "text-green-600" },
                { label: "Passed", val: stats.correct, col: "text-emerald-500" },
                { label: "Failed", val: stats.incorrect, col: "text-red-500" }
            ].map(item => (
              <div key={item.label} className="p-6 md:p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="text-[9px] text-slate-400 uppercase mb-2 tracking-widest font-bold">{item.label}</p>
                  <p className={`text-2xl md:text-3xl ${item.col}`}>{item.val}</p>
              </div>
            ))}
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 bg-green-50/40 p-10 md:p-14 rounded-[3rem] border border-green-50 mb-16">
            <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90"><circle cx="96" cy="96" r="82" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-green-100" /><circle cx="96" cy="96" r="82" stroke="currentColor" strokeWidth="16" fill="transparent" strokeDasharray={515} strokeDashoffset={515 - (515 * (stats.correct/30))} className="text-green-600 transition-all duration-1000" /></svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black">{Math.round((stats.correct/30)*100)}%</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase mt-1">Accuracy</span>
                </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
               <h3 className="text-2xl font-black text-green-900 mb-4 flex items-center justify-center lg:justify-start gap-4 uppercase tracking-tighter"><BarChart3 size={24} /> Performance Summary</h3>
               <p className="text-slate-500 text-lg mb-8 leading-relaxed font-medium text-balance">Professional assessment complete. Review your performance report below to identify areas for improvement.</p>
               <div className="flex flex-wrap gap-4 justify-center lg:justify-start font-black text-xs uppercase tracking-widest">
                  <button onClick={generatePDF} className="bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-black transition-all flex items-center gap-2 shadow-xl"><Download size={18} /> Report</button>
                  <button onClick={() => window.location.href="/"} className="bg-white border-2 border-slate-100 px-8 py-4 rounded-2xl text-slate-600 hover:border-green-200">Dashboard</button>
               </div>
            </div>
        </div>

        <div className="space-y-8">
            <h3 className="text-2xl font-black border-b-4 border-slate-50 pb-6 text-slate-800 uppercase italic">Review Results</h3>
            {test.questions.map((q, i) => (
              <div key={i} className={`p-8 md:p-10 rounded-[3rem] border-2 transition-all ${answers[i] === q.answer ? "border-green-100 bg-green-50/10" : "border-red-50 bg-red-50/10"}`}>
                 <div className="flex justify-between items-center mb-8">
                    <span className="px-5 py-1.5 bg-white rounded-full text-[9px] font-black border uppercase tracking-widest text-slate-400 shadow-sm">Q {i+1}</span>
                    {answers[i] === q.answer ? <CheckCircle2 className="text-green-500" size={24} /> : <XCircle className="text-red-500" size={24} />}
                 </div>
                 <p className="text-xl font-bold text-slate-800 mb-8 leading-relaxed font-serif">{q.text}</p>
                 <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 md:p-6 bg-white rounded-2xl border-2 border-slate-50"><p className="text-[10px] font-bold text-slate-300 uppercase mb-2">Your Answer</p><p className={`font-bold text-lg ${answers[i] === q.answer ? "text-green-600" : "text-red-600"}`}>{answers[i] || "Not Answered"}</p></div>
                    <div className="p-4 md:p-6 bg-white rounded-2xl border-2 border-slate-50"><p className="text-[10px] font-bold text-slate-300 uppercase mb-2">Correct Answer</p><p className="font-bold text-lg text-green-600">{q.answer}</p></div>
                 </div>
                 <div className="p-6 bg-green-600/5 rounded-2xl border-2 border-green-600/10">
                    <p className="text-[10px] font-black text-green-600 mb-2 uppercase tracking-widest">HorizonTrax Explanation</p>
                    <p className="text-slate-600 font-medium text-base leading-relaxed">{q.explanation}</p>
                 </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
