
import React, { useState } from 'react';
import { CategoryType, Memory } from '../types';

interface MemoryModalProps {
  category: CategoryType;
  isOpen: boolean;
  onClose: () => void;
  onSave: (memory: Partial<Memory>) => void;
}

const MemoryModal: React.FC<MemoryModalProps> = ({ category, isOpen, onClose, onSave }) => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!content || !author) return;
    onSave({
      category,
      content,
      author,
      imageUrl: image || undefined,
    });
    setContent('');
    setAuthor('');
    setImage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-custom-dark">{category}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Who is writing?</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-custom-orange outline-none"
              placeholder="e.g. Dad, Mom, Junho..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">What happened?</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-custom-orange outline-none h-32 resize-none"
              placeholder="Tell the story..."
            />
          </div>

          {category === CategoryType.PHOTOBOOK && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Add a Photo</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-custom-lavender file:text-custom-dark hover:file:bg-opacity-80" />
              {image && (
                <div className="mt-4 rounded-xl overflow-hidden h-32 bg-gray-100">
                  <img src={image} className="w-full h-full object-cover" alt="Preview" />
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={!content || !author}
            className="w-full bg-custom-orange text-white font-bold py-4 rounded-full hover:opacity-90 disabled:bg-gray-300 transition-all mt-6"
          >
            Save Memory
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoryModal;
