
import React from 'react';
import { AIReviewResult } from '../types';

interface FinalReviewProps {
  data: AIReviewResult;
  onReset: () => void;
}

const FinalReview: React.FC<FinalReviewProps> = ({ data, onReset }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-[6px] border-custom-green animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-8">
        <span className="bg-custom-orange text-white px-5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Our Yearly Journey</span>
        <h2 className="text-3xl font-black text-custom-dark mt-3 leading-tight">2025: A Year to Remember</h2>
      </div>

      <div className="prose prose-sm text-gray-700 leading-relaxed mb-10 max-w-none">
        <p className="whitespace-pre-wrap text-base italic text-center text-gray-600">"{data.summary}"</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 border-t border-gray-100 pt-8">
        <div>
          <h3 className="text-lg font-bold text-custom-dark mb-4 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-6 h-6 bg-custom-green rounded-full flex items-center justify-center text-[10px]">✨</span>
            Core Themes
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.keywords.map((k, i) => (
              <span key={i} className="bg-custom-lavender px-3 py-1.5 rounded-xl text-xs font-bold text-custom-dark border border-black/5">
                #{k}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-custom-green/10 p-5 rounded-2xl">
          <h3 className="text-lg font-bold text-custom-dark mb-2 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-6 h-6 bg-custom-orange rounded-full flex items-center justify-center text-[10px] text-white">🎵</span>
            Soundtrack
          </h3>
          <p className="font-bold text-custom-dark text-base">{data.suggestedPlaylist.title}</p>
          <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{data.suggestedPlaylist.description}</p>
        </div>
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={onReset}
          className="bg-custom-dark text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-opacity-80 transition-all shadow-lg"
        >
          Create New Memories
        </button>
      </div>
    </div>
  );
};

export default FinalReview;
