import React from 'react';
import { Button } from './Button';
import { X, Check } from 'lucide-react';
import { JOB_CATEGORIES } from '../constants';

interface JobFilterProps {
  onClose: () => void;
  onApply: () => void;
}

export const JobFilter: React.FC<JobFilterProps> = ({ onClose, onApply }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-bottom-10 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <button onClick={onClose}>
                <X className="w-6 h-6 text-black" />
            </button>
            <h2 className="font-mono font-bold text-xl">Search jobs</h2>
            <div className="w-6"></div> {/* Spacer */}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Trade Selection */}
            <div>
                <label className="block text-sm font-bold font-mono mb-2">Trade</label>
                <div className="flex items-center justify-between p-4 bg-gray-100 rounded-sm border-b-2 border-gray-200">
                    <div className="flex items-center gap-3">
                        <span className="font-bold">🔧</span>
                        <span className="font-medium">Motorcycle repair</span>
                    </div>
                </div>
            </div>

            {/* Position */}
            <div>
                <label className="block text-sm font-bold font-mono mb-2">Position</label>
                <div className="flex items-center justify-between p-4 bg-gray-100 rounded-sm border-b-2 border-gray-200">
                    <div className="flex items-center gap-3">
                        <span className="font-bold">📍</span>
                        <span className="font-medium">Mechanic</span>
                    </div>
                </div>
            </div>

             {/* City */}
             <div>
                <label className="block text-sm font-bold font-mono mb-2">City</label>
                <div className="flex items-center justify-between p-4 bg-gray-100 rounded-sm border-b-2 border-gray-200">
                    <div className="flex items-center gap-3">
                        <span className="font-bold">🇦🇺</span>
                        <span className="font-medium">Sydney, Australia</span>
                    </div>
                </div>
            </div>

            {/* Pay Scale */}
            <div>
                 <label className="block text-sm font-bold font-mono mb-4">Pay scale</label>
                 <div className="h-16 flex items-end justify-between px-2 gap-1 mb-2">
                    {[20, 30, 50, 40, 60, 80, 50, 40, 30, 20].map((h, i) => (
                        <div key={i} className="bg-[#D000D0] w-full rounded-t-sm" style={{height: `${h}%`}}></div>
                    ))}
                 </div>
                 <div className="relative h-2 bg-gray-200 rounded-full mb-2">
                     <div className="absolute left-1/4 right-1/4 h-full bg-gray-400"></div>
                     <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-300 rounded-full shadow-sm"></div>
                     <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-300 rounded-full shadow-sm"></div>
                 </div>
                 <div className="flex justify-between text-xs font-mono font-bold text-gray-500">
                     <span>$0</span>
                     <span className="text-black">$50K</span>
                     <span className="text-black">$70K</span>
                     <span>$100K</span>
                 </div>
            </div>
            
            {/* Employment Type */}
             <div>
                <label className="block text-sm font-bold font-mono mb-2">Employment type</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <button className="px-4 py-2 border-2 border-black bg-[#D000D0] text-white font-bold font-mono text-xs whitespace-nowrap">FULL-TIME</button>
                    <button className="px-4 py-2 border-2 border-gray-200 bg-white text-gray-400 font-bold font-mono text-xs whitespace-nowrap">PART-TIME</button>
                    <button className="px-4 py-2 border-2 border-gray-200 bg-white text-gray-400 font-bold font-mono text-xs whitespace-nowrap">CONTRACT</button>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100">
            <Button fullWidth size="lg" onClick={onApply}>
                APPLY FILTERS
            </Button>
        </div>
    </div>
  );
};