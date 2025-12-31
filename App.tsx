
import React, { useState, useEffect, useMemo } from 'react';
import CategoryGrid from './components/CategoryGrid';
import MemoryModal from './components/MemoryModal';
import FinalReview from './components/FinalReview';
import { CategoryType, Memory, AIReviewResult } from './types';
import { generateYearlyReview } from './services/geminiService';

const App: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalReview, setFinalReview] = useState<AIReviewResult | null>(null);
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);

  // Default images using the uploaded 'cpm35' files
  const defaultHeroImages = [
    "cpm35_1.jpg",
    "cpm35_2.jpg",
    "cpm35_3.jpg",
    "cpm35_4.jpg",
    "cpm35_5.jpg",
  ];

  useEffect(() => {
    const saved = localStorage.getItem('family_memories_2025');
    if (saved) {
      try {
        setMemories(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse memories", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('family_memories_2025', JSON.stringify(memories));
  }, [memories]);

  const galleryImages = useMemo(() => {
    const uploadedImages = memories
      .filter(m => m.imageUrl)
      .map(m => m.imageUrl as string);
    
    // Mix uploaded ones with the provided cpm35 defaults
    return [...defaultHeroImages, ...uploadedImages];
  }, [memories]);

  useEffect(() => {
    if (galleryImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [galleryImages.length]);

  const handleCategoryClick = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveMemory = (newMemory: Partial<Memory>) => {
    const memory: Memory = {
      id: crypto.randomUUID(),
      category: newMemory.category!,
      content: newMemory.content!,
      author: newMemory.author!,
      timestamp: Date.now(),
      imageUrl: newMemory.imageUrl,
    };
    setMemories(prev => [...prev, memory]);
  };

  const generateReview = async () => {
    if (memories.length < 3) {
      alert("Please add at least 3 memories to create your review!");
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateYearlyReview(memories);
      setFinalReview(result);
    } catch (error) {
      console.error(error);
      alert("Failed to generate review. Please check your AI configuration.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 overflow-x-hidden selection:bg-custom-green selection:text-custom-dark">
      <header className="pt-8 md:pt-16 px-6 md:px-20 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center justify-between">
        
        {/* Dynamic Gallery Hero Section */}
        <div className="relative w-full md:w-[460px] aspect-[4/5] bg-neutral-900 rounded-[3.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] group border-8 border-white/10 ring-1 ring-white/20">
          {galleryImages.map((src, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentHeroIdx ? 'opacity-100' : 'opacity-0'}`}
            >
              <img 
                src={src} 
                alt="Family Memory" 
                className="w-full h-full object-cover contrast-[1.05] brightness-[1.02]"
                onError={(e) => {
                  // Fallback for missing cpm35 files if they aren't available in the root
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${idx}/800/1000`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
          ))}
          
          <div className="absolute bottom-8 left-8 right-8 text-white">
             <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
                <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-90">OUR FAMILY FILM</p>
             </div>
             <h3 className="text-2xl font-black leading-tight tracking-tighter uppercase">
               Recording Our Journey
             </h3>
          </div>

          <div className="absolute top-8 right-8 flex gap-1.5 p-2 bg-black/40 backdrop-blur-md rounded-full">
            {galleryImages.slice(0, 8).map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentHeroIdx ? 'bg-custom-green w-6' : 'bg-white/40 w-1.5'}`} />
            ))}
          </div>
        </div>

        {/* Right Info Section */}
        <div className="flex-1 text-center md:text-left space-y-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <h1 className="bg-custom-green text-custom-dark text-4xl md:text-6xl font-black px-10 py-5 rounded-full inline-block shadow-2xl transform -rotate-1">
                HOW WAS YOUR
              </h1>
              <div className="w-14 h-14 md:w-20 md:h-20 bg-custom-orange rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-custom-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7-7 7" /></svg>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-5">
              <div className="flex -space-x-4">
                 <div className="w-14 h-14 md:w-20 md:h-20 bg-white rounded-full border-4 border-custom-dark shadow-xl overflow-hidden transform rotate-6">
                    <img src={galleryImages[0]} className="w-full h-full object-cover" alt="Preview" />
                 </div>
                 <div className="w-14 h-14 md:w-20 md:h-20 bg-custom-orange rounded-full border-4 border-custom-dark shadow-xl flex items-center justify-center text-white font-black text-xl transform -rotate-3">
                    25
                 </div>
              </div>
              <h1 className="bg-custom-green text-custom-dark text-4xl md:text-6xl font-black px-10 py-5 rounded-full inline-block shadow-2xl transform rotate-1">
                2025?
              </h1>
            </div>
          </div>

          {!finalReview && (
            <div className="pt-4">
              <p className="text-white/50 text-[11px] font-bold tracking-[0.2em] uppercase mb-5 ml-1">Select a category to record a memory</p>
              <CategoryGrid onCategoryClick={handleCategoryClick} />
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-16">
        {finalReview ? (
          <FinalReview data={finalReview} onReset={() => setFinalReview(null)} />
        ) : (
          <div className="text-center">
            {memories.length > 0 && (
              <div className="mb-14">
                <h3 className="text-white/40 font-bold text-xs uppercase tracking-[0.4em] mb-8">Recently Captured Moments</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {memories.slice(-6).map(m => (
                    <div key={m.id} className="group bg-white/5 hover:bg-white/15 backdrop-blur-xl px-6 py-4 rounded-2xl text-white text-xs border border-white/10 transition-all shadow-lg">
                      <span className="font-black text-custom-green mr-3">{m.author}</span>
                      <span className="opacity-80">"{m.content.substring(0, 30)}..."</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="relative inline-block mt-8">
              <button
                onClick={generateReview}
                disabled={isGenerating}
                className={`
                  relative z-10 group inline-flex items-center justify-center px-16 py-7 font-black text-2xl tracking-tighter text-custom-dark bg-custom-green rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_25px_60px_rgba(156,245,102,0.4)]
                  ${isGenerating ? 'animate-pulse' : ''}
                `}
              >
                <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
                {isGenerating ? 'AI IS WEAVING OUR STORY...' : "OUR FAMILY'S 2025 YEAR IN REVIEW"}
              </button>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-custom-green/30 blur-[70px] rounded-full -z-0"></div>
            </div>
            
            <p className="text-white/30 mt-8 text-[11px] font-black tracking-[0.2em] uppercase max-w-sm mx-auto leading-loose">
              Add photos and stories to complete your family's cinematic gallery!
            </p>
          </div>
        )}
      </main>

      {selectedCategory && (
        <MemoryModal
          category={selectedCategory}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveMemory}
        />
      )}

      <footer className="fixed bottom-8 left-0 right-0 p-4 pointer-events-none z-40">
        <div className="max-w-md mx-auto bg-black/70 backdrop-blur-3xl rounded-full px-8 py-5 border border-white/10 pointer-events-auto flex items-center justify-between shadow-2xl">
           <div className="flex items-center gap-4">
             <div className="relative">
                <div className="w-3 h-3 rounded-full bg-custom-green animate-ping absolute inset-0 opacity-75"></div>
                <div className="w-3 h-3 rounded-full bg-custom-green relative shadow-[0_0_10px_rgba(156,245,102,0.8)]"></div>
             </div>
             <span className="text-[12px] text-white font-black uppercase tracking-[0.2em]">{memories.length} MOMENTS SAVED</span>
           </div>
           <div className="h-5 w-[1px] bg-white/15 mx-2"></div>
           <button 
            onClick={() => {
              if(confirm("Are you sure you want to clear all data and start over?")) {
                setMemories([]);
                localStorage.removeItem('family_memories_2025');
              }
            }}
            className="text-white/40 hover:text-red-400 transition-colors p-1">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
           </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
