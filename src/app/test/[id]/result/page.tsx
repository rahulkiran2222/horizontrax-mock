"use client";
import * as React from "react";
import { useEffect, useState, use } from "react";
import { examData } from "@/data/questions";
import { Download, CheckCircle2, XCircle, Home, BarChart3 } from "lucide-react";
import jsPDF from "jspdf";

type Params = Promise<{ id: string }>;

export default function ResultPage(props: { params: Params }) {
  const params = use(props.params);
  const id = params.id;
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
    
    const addTemplate = (pdfDoc: any, pageNum: number) => {
      // 1. Watermark (Behind Everything)
      pdfDoc.setTextColor(245, 245, 245);
      pdfDoc.setFontSize(60);
      pdfDoc.text("HORIZONTRAX", 40, 150, { angle: 45 });
      
      // 2. Header
      pdfDoc.setFontSize(10);
      pdfDoc.setTextColor(180, 180, 180);
      pdfDoc.text("HorizonTrax - Student Placement Readiness Report", 14, 10);
      
      // 3. Footer
      pdfDoc.text(`Generated for HorizonTrax Candidate | Page ${pageNum}`, 105, 285, { align: 'center' });
    };

    doc.setFontSize(24);
    doc.setTextColor(22, 163, 74);
    doc.text(`HorizonTrax Result: ${test.title}`, 14, 25);
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Candidate Score: ${stats.score}/30 | Accuracy: ${Math.round((stats.correct/30)*100)}%`, 14, 35);

    let y = 55;
    test.questions.forEach((q, i) => {
      // Check if we need a new page
      if (y > 240) { 
        doc.addPage(); 
        y = 30; 
      }
      
      // Use getNumberOfPages() directly on doc, or cast to any to bypass strict check
      const currentPage = (doc as any).internal.getNumberOfPages();
      addTemplate(doc, currentPage);
      
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

    // Final template call for page 1
    addTemplate(doc, 1);
    doc.save(`HorizonTrax_Report_${id}.pdf`);
  };
  return (
    <div className="min-h-screen bg-[#F0FDF4] py-12 px-4 text-slate-800">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-xl border border-green-50">
          <div className="flex items-center gap-4 mb-12">
             <div className="w-12 h-12 bg-green-600 rounded-2xl text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-green-100">H</div>
             <h1 className="text-3xl font-black tracking-tight">HORIZONTRAX PERFORMANCE</h1>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                  { label: "Final Score", val: `${stats.score}/30`, color: "text-green-600" },
                  { label: "Correct", val: stats.correct, color: "text-emerald-500" },
                  { label: "Incorrect", val: stats.incorrect, color: "text-red-500" },
                  { label: "Accuracy", val: `${Math.round((stats.correct/30)*100)}%`, color: "text-blue-600" }
              ].map(item => (
                <div key={item.label} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
                    <p className="text-slate-400 font-bold text-xs uppercase mb-2 tracking-widest">{item.label}</p>
                    <p className={`text-4xl font-black ${item.color}`}>{item.val}</p>
                </div>
              ))}
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-16 bg-green-50/40 p-12 rounded-[3rem] border border-green-50 mb-16">
              <div className="relative w-56 h-56 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                      <circle cx="112" cy="112" r="95" stroke="currentColor" strokeWidth="18" fill="transparent" className="text-green-100" />
                      <circle cx="112" cy="112" r="95" stroke="currentColor" strokeWidth="18" fill="transparent" strokeDasharray={597} strokeDashoffset={597 - (597 * (stats.correct/30))} className="text-green-600" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black">{Math.round((stats.correct/30)*100)}%</span>
                      <span className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">Overall Result</span>
                  </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                 <h3 className="text-2xl font-black text-green-800 mb-4 flex items-center justify-center lg:justify-start gap-3"><BarChart3 /> Advanced Insights</h3>
                 <p className="text-slate-500 text-lg mb-8 leading-relaxed">Excellent effort! You demonstrated strong command over core technical concepts. Downloading your report will give you a detailed breakdown for placement interviews.</p>
                 <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    <button onClick={generatePDF} className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-bold hover:bg-black flex items-center gap-3 transition-all"><Download size={20} /> Download Pro Report</button>
                    <button onClick={() => window.location.href="/"} className="bg-white border-2 px-10 py-5 rounded-3xl font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-3"><Home size={20} /> Dashboard</button>
                 </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// ... keep all your existing imports at the top

export async function generateStaticParams() {
  return [
    { id: 'cpp-oops' },
    { id: 'java-oops' },
    { id: 'aptitude' }
  ];
}

export default function ResultPage(props: { params: Params }) {
  // ... keep all your existing ResultPage code exactly as it is
