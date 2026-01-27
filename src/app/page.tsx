"use client";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { ShieldAlert, Zap, BookOpen } from 'lucide-react';

export default function LandingPage() {
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const msg = localStorage.getItem("ht_notice");
    if (msg) {
      setNotification(msg);
      localStorage.removeItem("ht_notice");
      setTimeout(() => setNotification(null), 10000); // 10 second limit
    }
  }, []);

  const tests = [
    { id: 'cpp-oops', title: 'C++ OOPS Professional' },
    { id: 'java-oops', title: 'Java OOPS Professional' },
    { id: 'aptitude', title: 'Quantitative Aptitude' }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {notification && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-4 text-center font-bold z-[100] animate-bounce">
          {notification}
        </div>
      )}

      <nav className="flex justify-between items-center px-8 py-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl italic font-serif">H</div>
          <span className="text-2xl font-black tracking-tighter uppercase text-slate-800">HorizonTrax</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-green-100 uppercase tracking-widest">
           Placement Readiness Portal
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-900">
          Master your <span className="text-green-600 font-serif italic">Technical Interviews.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          Industry-grade proctored mock tests designed for HorizonTrax candidates. 100% Free.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {tests.map((test) => (
            <div key={test.id} className="p-8 rounded-[2.5rem] border-2 border-slate-50 bg-white hover:border-green-500 hover:shadow-2xl hover:shadow-green-100 transition-all group">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <BookOpen size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-slate-800">{test.title}</h3>
              <p className="text-slate-400 mb-8 font-medium">30 Questions • 30 Mins • Strict Security</p>
              <Link href={`/test/${test.id}`} className="inline-flex items-center gap-2 font-bold text-green-600 group-hover:translate-x-2 transition-transform">
                Start Examination →
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
