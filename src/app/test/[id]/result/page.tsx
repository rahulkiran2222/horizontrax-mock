"use client";
import * as React from "react";
import { useEffect, useState, use } from "react";
import { examData } from "@/data/questions";
import { Download, CheckCircle2, XCircle, Home, BarChart3 } from "lucide-react";
import jsPDF from "jspdf";

type Params = Promise<{ id: string }>;

export async function generateStaticParams() {
  return [{ id: 'cpp-oops' }, { id: 'java-oops' }, { id: 'aptitude' }];
}

export default function ResultPage(props: { params: Params }) {
  const resolvedParams = use(props.params);
  const id = resolvedParams.id;
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
      pdfDoc.setTextColor(245, 245, 245);
      pdfDoc.setFontSize(60);
      pdfDoc.text("HORIZONTRAX", 40, 150, { angle: 45 });
      pdfDoc.setFontSize(10);
      pdfDoc.setTextColor(180, 180, 180);
      pdfDoc.text("HorizonTrax Professional Report", 14, 10);
      pdfDoc.text(`Page ${pageNum}`, 105, 285, { align: 'center' });
    };

    doc.setFontSize(24);
    doc.setTextColor(22, 163, 74);
    doc.text(`Result: ${test?.title}`, 14, 25);
    
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
      doc.text(`Explanation: ${q.explanation}`, 14, y, { maxWidth: 180 });
      y += 22;
    });
    addTemplate(doc, 1);
    doc.save(`HorizonTrax_Report.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] py-12 px-4 text-slate-800">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-xl border border-green-50">
          <h1 className="text-3xl font-black mb-12">HORIZONTRAX PERFORMANCE</h1>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
                <p className="text-slate-400 text-xs uppercase mb-2 font-bold">Score</p>
                <p className="text-4xl font-black text-green-600">{stats.score}/30</p>
              </div>
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
                <p className="text-slate-400 text-xs uppercase mb-2 font-bold">Accuracy</p>
                <p className="text-4xl font-black text-blue-600">{Math.round((stats.correct/30)*100)}%</p>
              </div>
          </div>
          <button onClick={generatePDF} className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-bold flex items-center gap-3"><Download /> Download Pro Report</button>
        </div>
      </div>
    </div>
  );
}
