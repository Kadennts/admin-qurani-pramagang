"use client";

import { BookOpen, Filter } from "lucide-react";

export default function RecitationPage() {
  return (
    <div className="max-w-[1400px] mx-auto h-[80vh] flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-16">
        <h1 className="text-2xl font-bold text-[#1e293b]">Recitation Results</h1>
        <button className="bg-white border border-slate-200 text-slate-500 p-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
          <Filter size={18} />
        </button>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-20">
        <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl mb-6 shadow-sm">
          <BookOpen size={48} className="text-slate-400 stroke-[1.5]" />
        </div>
        <h2 className="text-xl font-semibold text-slate-700 mb-2">No records found</h2>
        <p className="text-slate-500 font-medium">Try adjusting your filters to see more results</p>
      </div>

    </div>
  );
}
