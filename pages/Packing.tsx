import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Plus, Briefcase } from 'lucide-react';

export const Packing: React.FC = () => {
  const { activeTrip, updateChecklistItem } = useTrip();

  if (!activeTrip) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#2A4D3A]">Packing List</h1>
          <p className="text-slate-500 mt-1">Don't forget the essentials.</p>
        </div>
        <button className="bg-[#F5B041] text-[#2A4D3A] px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#e0a03a] transition-colors shadow-sm">
          <Plus size={18} strokeWidth={3} />
          <span className="hidden sm:inline">Add Item</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTrip.checklist.map((category, idx) => {
          const totalItems = category.items.length;
          const packedItems = category.items.filter(i => i.packed).length;
          const progress = totalItems === 0 ? 0 : (packedItems / totalItems) * 100;

          return (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase size={20} className="text-[#2A4D3A]" />
                  <h3 className="text-xl font-bold text-[#2A4D3A]">{category.name}</h3>
                </div>
                <span className="text-sm font-semibold text-slate-400">
                  {packedItems} / {totalItems}
                </span>
              </div>

              <div className="w-full bg-slate-100 h-1.5 rounded-full mb-6 overflow-hidden">
                <div 
                  className="bg-[#2A4D3A] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="space-y-3">
                {category.items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center gap-3 group cursor-pointer"
                    onClick={() => updateChecklistItem(category.id, item.id, !item.packed)}
                  >
                    <div className="transition-transform group-active:scale-90">
                      {item.packed ? (
                        <CheckCircle2 size={24} className="text-[#10B981] fill-[#10B981]/20" />
                      ) : (
                        <Circle size={24} className="text-slate-300 group-hover:text-[#F5B041] transition-colors" />
                      )}
                    </div>
                    <span className={`flex-1 text-lg transition-colors ${item.packed ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-700 font-medium group-hover:text-[#2A4D3A]'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              
              <button className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 font-medium hover:border-[#F5B041] hover:text-[#F5B041] transition-colors flex items-center justify-center gap-2">
                <Plus size={18} /> Add new to {category.name}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
