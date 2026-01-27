"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { examData } from "@/data/questions";
import { Download, Home, CheckCircle2, XCircle, BarChart3 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ResultClient({ id }: { id: string }) {
  const test = examData[id as keyof typeof examData];
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, unanswered: 0, score: 0 });
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(`submission-${id}`) || "{}");
    setAnswers(data);
    let c = 0, inc = 0, un = 0;
    if (test) {
      test.questions.forEach((q, i) => {
        if (!data[i]) un++;
        else if (data[i] === q.answer) c++;
        else inc++;
      });
      setStats({ correct: c, incorrect: inc, unanswered: un, score: c });
    }
  }, [id, test]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const watermark = "HORIZONTRAX";
    
    const addTemplate = (pdfDoc: any, pageNum: number) => {
      pdfDoc.setTextColor(245, 245, 245);
      pdfDoc.setFontSize(60);
      pdfDoc.text(watermark, 40, 150, { angle: 45 });
      pdfDoc.setFontSize(10);
      pdfDoc.setTextColor(180, 180, 180);
      pdfDoc.text("HorizonTrax - Student Placement Readiness Report", 14, 10);
      pdfDoc.text(`Page ${pageNum}`, 105, 285, { align: 'center' });
    };

    doc.setFontSize(22);
    doc.setTextColor(22, 163, 74);
    doc.text(`HorizonTrax Report: ${test?.title}`, 14, 25);
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Candidate Score: ${stats.score}/30 | Accuracy: ${Math.round((stats.correct/30)*100)}%`, 14, 35);

    let y = 55;
    test?.questions.forEach((q, i) => {
      if (y > 240) { doc.addPage(); y = 30; }
      addTemplate(doc, (doc as any).internal.getNumberOfPages());
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`Q${i+1}: ${q.text}`, 14, y, { maxWidth: 180 });
      y += 10;
      doc.setFontSize(10);
      doc.setTextColor(answers[i] === q.answer ? 34 : 220, answers[i] === q.answer ? 197 : 38, 94);
      doc.text(`Your Answer: ${answers[i] || "Skipped"} | Correct: ${q.answer}`, 14, y);
      y += 6;
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.text(`Explanation: ${q.explanation}`, 14, y, { maxWidth: 180 });
      y += 22;
    });

    addTemplate(doc, 1);
    doc.save(`HorizonTrax_Report.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] py-12 px-6 text-slate-800 leading-normal">
      <div className="max-w-5xl mx-auto bg-white p-8 md:p-16 rounded-[3rem] shadow-xl border border-green-50">
        <div className="flex items-center gap-4 mb-12">
           <div className="w-12 h-12 bg-green-600 rounded-2xl text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-green-100 italic">H</div>
           <h1 className="text-3xl font-black tracking-tighter">HORIZONTRAX INSIGHTS</h1>
        </div>
        
        {/* Pic 3: Score Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
                { label: "Percentage", val: `${Math.round((stats.correct/30)*100)}%`, color: "text-slate-900" },
                { label: "Your Score", val: `${stats.score}/30`, color: "text-green-600" },
                { label: "Correct", val: stats.correct, color: "text-emerald-500" },
                { label: "Incorrect", val: stats.incorrect, color: "text-red-500" }
            ].map(item => (
              <div key={item.label} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
                  <p className="text-slate-400 font-bold text-xs uppercase mb-2 tracking-widest">{item.label}</p>
                  <p className={`text-4xl font-black ${item.color}`}>{item.val}</p>
              </div>
            ))}
        </div>

        {/* Circular Analytics */}
        <div className="flex flex-col lg:flex-row items-center gap-16 bg-green-50/40 p-12 rounded-[3rem] border border-green-50 mb-16">
            <div className="relative w-56 h-56 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="112" cy="112" r="95" stroke="currentColor" strokeWidth="18" fill="transparent" className="text-green-100" />
                    <circle cx="112" cy="112" r="95" stroke="currentColor" strokeWidth="18" fill="transparent" strokeDasharray={597} strokeDashoffset={597 - (597 * (stats.correct/30))} className="text-green-600 transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black">{Math.round((stats.correct/30)*100)}%</span>
                    <span className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">Overall Result</span>
                </div>
            </div>
            <div className="flex-1">
               <h3 className="text-2xl font-black text-green-800 mb-4 flex items-center gap-3"><BarChart3 /> Advanced Insights</h3>
               <p className="text-slate-500 text-lg mb-8 leading-relaxed">Your performance has been processed. Review the detailed breakdown below to understand your strengths and weak areas for the upcoming MNC interviews.</p>
               <div className="flex flex-wrap gap-4">
                  <button onClick={generatePDF} className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-bold hover:bg-black flex items-center gap-3 transition-all"><Download size={20} /> Download Pro Report</button>
                  <button onClick={() => window.location.href="/"} className="bg-white border-2 border-slate-200 text-slate-600 px-10 py-5 rounded-3xl font-bold hover:bg-slate-50 transition-all flex items-center gap-3"><Home size={20} /> Dashboard</button>
               </div>
            </div>
        </div>

        {/* Review List: Detailed Question Breakdown */}
        <div className="space-y-8">
            <h3 className="text-2xl font-black border-b border-slate-100 pb-6 text-slate-800">Submission Review</h3>
            {test?.questions.map((q, i) => (
              <div key={i} className={`p-8 rounded-[2.5rem] border-2 transition-all ${answers[i] === q.answer ? "border-green-100 bg-green-50/10" : "border-red-50 bg-red-50/10"}`}>
                 <div className="flex justify-between items-center mb-6">
                    <span className="px-4 py-1.5 bg-white rounded-full text-xs font-bold border border-slate-100 shadow-sm uppercase tracking-widest text-slate-400">Question {i+1}</span>
                    {answers[i] === q.answer ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
                 </div>
                 <p className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">{q.text}</p>
                 <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 bg-white rounded-2xl border border-slate-50 shadow-sm">
                      <p className="text-[10px] font-black text-slate-300 mb-2 uppercase tracking-[0.2em]">Your Selection</p>
                      <p className={`font-bold text-lg ${answers[i] === q.answer ? "text-green-600" : "text-red-600"}`}>{answers[i] || "Skipped"}</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-slate-50 shadow-sm">
                      <p className="text-[10px] font-black text-slate-300 mb-2 uppercase tracking-[0.2em]">Correct Answer</p>
                      <p className="font-bold text-lg text-green-600">{q.answer}</p>
                    </div>
                 </div>
                 <div className="p-6 bg-green-600/5 rounded-2xl border border-green-600/10">
                    <p className="text-[10px] font-black text-green-600 mb-2 uppercase tracking-[0.2em]">Expert Explanation</p>
                    <p className="text-slate-600 font-medium leading-relaxed">{q.explanation}</p>
                 </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
