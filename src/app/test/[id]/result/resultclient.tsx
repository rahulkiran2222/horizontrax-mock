"use client";
import { useEffect, useState } from "react";
import { examData } from "@/data/questions";
import { Download, Home } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  if (!test) return null;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("HORIZONTRAX REPORT", 14, 20);
    autoTable(doc, {
        startY: 30,
        head: [['#', 'Question', 'Answer', 'Status']],
        body: test.questions.map((q, i) => [i + 1, q.text, q.answer, answers[i] === q.answer ? 'PASS' : 'FAIL']),
    });
    doc.save(`HorizonTrax_Result.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] p-12 flex flex-col items-center justify-center text-slate-900">
      <div className="bg-white p-12 rounded-[3rem] shadow-xl max-w-2xl w-full text-center border border-green-100">
        <h1 className="text-3xl font-black text-green-600 mb-4">Exam Results</h1>
        <div className="text-7xl font-black mb-10 text-slate-800">{score} / 30</div>
        <div className="flex gap-4 justify-center">
          <button onClick={generatePDF} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex gap-2 items-center"><Download size={20}/> Download PDF</button>
          <button onClick={() => window.location.href="/"} className="border-2 border-slate-100 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"><Home size={20}/> Home</button>
        </div>
      </div>
    </div>
  );
}
