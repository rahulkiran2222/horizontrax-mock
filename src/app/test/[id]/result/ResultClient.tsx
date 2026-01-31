"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { examData } from "@/data/questions";
import { Download, Home, BarChart3, CheckCircle2, XCircle } from "lucide-react";
import jsPDF from "jspdf";

export default function ResultClient({ id }: { id: string }) {
  const test = examData[id as keyof typeof examData];
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, score: 0, total: 0 });
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    const rawData = localStorage.getItem(`submission-${id}`);
    const data = rawData ? JSON.parse(rawData) : {};
    setAnswers(data);
    
    let c = 0, inc = 0;
    if (test && test.questions && test.questions.length > 0) {
      test.questions.forEach((q, i) => {
        if (data[i] === q.answer) c++;
        else if (data[i]) inc++;
      });
      setStats({ correct: c, incorrect: inc, score: c, total: test.questions.length });
    }
  }, [id, test]);

  if (!test) return <div className="p-20 text-center">Data Error.</div>;

  const generatePDF = () => {
    const doc = new jsPDF();
    const addBranding = (pdfDoc: any, pageNum: number) => {
      pdfDoc.setTextColor(248, 248, 248);
      pdfDoc.setFontSize(80);
      pdfDoc.text("HORIZONTRAX", 30, 150, { angle: 45 });
      pdfDoc.setFontSize(9); pdfDoc.setTextColor(180, 180, 180);
      pdfDoc.text("HorizonTrax Professional Readiness Report", 14, 10);
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
      doc.setFontSize(9); doc.setTextColor(answers[i] === q.answer ? 34 : 220, 100, 100);
      doc.text(`Result: ${answers[i] === q.answer ? 'Correct' : 'Incorrect'} | Answer: ${q.answer}`, 14, y);
      y += 6;
      doc.setTextColor(120, 120, 120);
      doc.text(`Explanation: ${q.explanation}`, 14, y, { maxWidth: 180 });
      y += 18;
    });
    addBranding(doc, 1);
    doc.save(`HorizonTrax_Report.pdf`);
  };

  const totalQ = stats.total || 1; // Prevent division by zero

  return (
    <div className="min-h-screen bg-[#F0FDF4] py-10 px-4 text-slate-800">
      <div className="max-w-5xl mx-auto bg-white p-6 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-xl border border-green-50">
        <h1 className="text-3xl md:text-4xl font-black mb-12 text-green-600 uppercase italic text-center tracking-tighter">HorizonTrax Insights</h1>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16 text-center font-black">
            {[
                { label: "Accuracy", val: `${Math.round((stats.correct/totalQ)*100)}%`, col: "text-slate-900" },
                { label: "Score", val: `${stats.score}/${totalQ}`, col: "text-green-600" },
                { label: "Passed", val: stats.correct, col: "text-emerald-500" },
                { label: "Failed", val: stats.incorrect, col: "text-red-500" }
            ].map(item => (
              <div key={item.label} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm">
                  <p className="text-[9px] text-slate-400 uppercase mb-2 tracking-widest font-bold">{item.label}</p>
                  <p className={`text-2xl ${item.col}`}>{item.val}</p>
              </div>
            ))}
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 bg-green-50/40 p-10 md:p-14 rounded-[3rem] border border-green-50 mb-16">
            <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90"><circle cx="96" cy="96" r="82" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-green-100" /><circle cx="96" cy="96" r="82" stroke="currentColor" strokeWidth="16" fill="transparent" strokeDasharray={515} strokeDashoffset={515 - (515 * (stats.correct/totalQ))} className="text-green-600 transition-all duration-1000" /></svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black">{Math.round((stats.correct/totalQ)*100)}%</span>
                </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
               <h3 className="text-2xl font-black text-green-900 mb-4 flex items-center justify-center lg:justify-start gap-4 uppercase tracking-tighter italic"><BarChart3 size={24} /> Performance Insights</h3>
               <p className="text-slate-500 text-lg mb-8 leading-relaxed font-medium">Download your report to view detailed question-wise analysis and expert explanations.</p>
               <div className="flex flex-wrap gap-4 justify-center lg:justify-start font-black text-xs uppercase tracking-widest">
                  <button onClick={generatePDF} className="bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-black transition-all flex items-center gap-2 shadow-xl"><Download size={18} /> Report</button>
                  <button onClick={() => window.location.href="/"} className="bg-white border-2 border-slate-100 px-8 py-4 rounded-2xl text-slate-600 hover:border-green-200">Home</button>
               </div>
            </div>
        </div>

        <div className="space-y-8">
            <h3 className="text-2xl font-black border-b-4 border-slate-50 pb-6 text-slate-800 uppercase italic">Review Results</h3>
            {test.questions.map((q, i) => (
              <div key={i} className={`p-8 md:p-10 rounded-[3rem] border-2 transition-all ${answers[i] === q.answer ? "border-green-100 bg-green-50/10" : "border-red-50 bg-red-50/10"}`}>
                 <div className="flex justify-between items-center mb-8">
                    <span className="px-5 py-1.5 bg-white rounded-full text-[9px] font-black border uppercase tracking-widest text-slate-400">Q {i+1}</span>
                    {answers[i] === q.answer ? <CheckCircle2 className="text-green-500" size={24} /> : <XCircle className="text-red-500" size={24} />}
                 </div>
                 <p className="text-xl font-bold text-slate-800 mb-8 leading-relaxed italic">{q.text}</p>
                 <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 md:p-6 bg-white rounded-2xl border-2 border-slate-50"><p className="text-[10px] font-bold text-slate-300 uppercase mb-2 text-center">Your Answer: {answers[i] || "Skipped"}</p></div>
                    <div className="p-4 md:p-6 bg-white rounded-2xl border-2 border-slate-50"><p className="text-[10px] font-bold text-green-600 uppercase mb-2 text-center">Correct Answer: {q.answer}</p></div>
                 </div>
                 <p className="text-slate-600 font-medium text-sm p-4 bg-green-50 rounded-xl"><b>Explanation:</b> {q.explanation}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
