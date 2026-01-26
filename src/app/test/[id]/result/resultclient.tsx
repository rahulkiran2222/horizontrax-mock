"use client";
import { useEffect, useState, use } from "react";
import { examData } from "../../../../data/questions";
import { Download, Home } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ResultClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const test = examData[id as keyof typeof examData];
  const [stats, setStats] = useState({ correct: 0, score: 0 });
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(`submission-${id}`) || "{}");
    setAnswers(data);
    let c = 0;
    if (test) {
        test.questions.forEach((q, i) => { if (data[i] === q.answer) c++; });
        setStats({ correct: c, score: c });
    }
  }, [id, test]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("HORIZONTRAX REPORT", 14, 20);
    autoTable(doc, {
        startY: 30,
        head: [['#', 'Question', 'Answer', 'Status']],
        body: test.questions.map((q, i) => [i + 1, q.text, q.answer, answers[i] === q.answer ? 'PASS' : 'FAIL']),
    });
    doc.save(`Result.pdf`);
  };

  if (!test) return null;

  return (
    <div className="min-h-screen bg-[#F0FDF4] p-12 flex flex-col items-center">
      <div className="bg-white p-12 rounded-3xl shadow-xl max-w-2xl w-full text-center">
        <h1 className="text-3xl font-black text-green-600 mb-4">Exam Finished</h1>
        <div className="text-6xl font-black mb-10">{stats.score} / 30</div>
        <div className="flex gap-4 justify-center">
          <button onClick={generatePDF} className="bg-slate-900 text-white px-8 py-3 rounded-xl">Download PDF</button>
          <button onClick={() => window.location.href="/"} className="border px-8 py-3 rounded-xl">Home</button>
        </div>
      </div>
    </div>
  );
}