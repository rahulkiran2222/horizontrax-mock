"use client";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function LandingPage() {
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const msg = localStorage.getItem("ht_security_msg");
    if (msg) {
      setNotice(msg);
      localStorage.removeItem("ht_security_msg");
      setTimeout(() => setNotice(null), 10000); // Disappears after 10 seconds
    }
  }, []);

  const tests = [
    { id: 'cpp-oops', title: 'C++ OOPS Professional' },
    { id: 'java-oops', title: 'Java OOPS Professional' },
    { id: 'aptitude', title: 'Quantitative Aptitude' }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {notice && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-4 text-center font-bold z-[100] shadow-xl">
          ⚠️ {notice}
        </div>
      )}

      <nav className="flex justify-between items-center px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">H</div>
          <span className="text-xl font-black uppercase tracking-tighter">HorizonTrax</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
          Master your <span className="text-green-600">Technical Interviews.</span>
        </h1>
        <p className="text-slate-500 text-lg mb-12 max-w-2xl mx-auto">
          Industry-grade mock tests for placement readiness.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {tests.map((test) => (
            <div key={test.id} className="p-8 rounded-[2rem] border-2 border-slate-50 bg-white hover:border-green-500 hover:shadow-2xl transition-all group">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <BookOpen size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{test.title}</h3>
              <Link href={`/test/${test.id}`} className="text-green-600 font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                Start Test →
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
