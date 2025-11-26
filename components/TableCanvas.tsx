import React, { useEffect, useState } from 'react';
import { TableItem, TableZone } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Circle, Wine, Coffee, ChefHat, Info } from 'lucide-react';

interface TableCanvasProps {
  items: TableItem[];
  showLabels: boolean;
  onItemClick?: (item: TableItem) => void;
}

const TableCanvas: React.FC<TableCanvasProps> = ({ items, showLabels, onItemClick }) => {
  // Mapping zones to relative CSS percentages for absolute positioning
  // center is 50%, 50%
  const getPosition = (zone: TableZone) => {
    switch (zone) {
      case TableZone.Center: return { top: '50%', left: '50%' };
      case TableZone.Left1: return { top: '50%', left: '35%' };
      case TableZone.Left2: return { top: '50%', left: '25%' };
      case TableZone.Left3: return { top: '50%', left: '15%' };
      case TableZone.Right1: return { top: '50%', left: '65%' };
      case TableZone.Right2: return { top: '50%', left: '75%' };
      case TableZone.Right3: return { top: '50%', left: '85%' };
      case TableZone.TopLeft: return { top: '25%', left: '30%' };
      case TableZone.TopRight: return { top: '25%', left: '70%' };
      case TableZone.TopCenter: return { top: '30%', left: '50%' };
      default: return { top: '50%', left: '50%' };
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'plate': return <div className="w-24 h-24 rounded-full border-4 border-stone-800 bg-white shadow-lg flex items-center justify-center"><div className="w-16 h-16 rounded-full border border-stone-200"></div></div>;
      case 'bowl': return <div className="w-20 h-20 rounded-full border-2 border-stone-800 bg-stone-100 shadow-md flex items-center justify-center"></div>;
      case 'cutlery': return <div className="h-24 w-4 bg-gray-300 rounded-sm shadow-sm flex flex-col items-center justify-center"><div className="w-1 h-full bg-stone-400"></div></div>; // Generic placeholder, specialized below
      case 'glass': return <div className="w-12 h-12 rounded-full border-2 border-blue-200 bg-blue-50/50 flex items-center justify-center shadow-sm"><Wine size={20} className="text-blue-300"/></div>;
      case 'napkin': return <div className="w-16 h-20 bg-stone-200 rounded shadow-inner flex items-center justify-center"><div className="w-12 h-16 border border-stone-300 border-dashed"></div></div>;
      default: return <div className="w-8 h-8 bg-stone-500 rounded-full"></div>;
    }
  };

  // Specific visual tweaks based on name if possible, else generic type
  const renderItemVisual = (item: TableItem) => {
    if (item.name.toLowerCase().includes('fork')) {
       return <div className="flex flex-col items-center h-28 justify-end text-stone-700 filter drop-shadow-md"><div className="w-6 h-8 border-2 border-b-0 border-stone-600 rounded-t-sm flex justify-around"><div className="w-0.5 h-full bg-stone-600"></div><div className="w-0.5 h-full bg-stone-600"></div></div><div className="w-1 h-16 bg-stone-600 rounded-b-sm"></div></div>
    }
    if (item.name.toLowerCase().includes('knife')) {
       return <div className="flex flex-col items-center h-28 justify-end text-stone-700 filter drop-shadow-md"><div className="w-2 h-24 bg-stone-600 rounded-t-full rounded-b-sm"></div></div>
    }
    if (item.name.toLowerCase().includes('spoon')) {
       return <div className="flex flex-col items-center h-28 justify-end text-stone-700 filter drop-shadow-md"><div className="w-6 h-8 bg-stone-600 rounded-full mb-16 absolute"></div><div className="w-1 h-24 bg-stone-600"></div></div>
    }
    return renderIcon(item.type);
  };

  return (
    <div className="relative w-full h-[500px] bg-[#f5f5f0] rounded-xl shadow-inner overflow-hidden border border-[#e5e5dc]">
      {/* Table Surface Texture */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/linen.png')]"></div>
      
      <AnimatePresence>
        {items.map((item, index) => {
          const pos = getPosition(item.zone);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ top: pos.top, left: pos.left }}
              onClick={() => onItemClick?.(item)}
            >
              {renderItemVisual(item)}
              
              {showLabels && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/75 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {item.name}
                </div>
              )}
               {/* Click indicator pulse */}
               <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </span>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div className="absolute bottom-4 right-4 text-xs text-stone-400 italic">
        * Interactive: Hover for details
      </div>
    </div>
  );
};

export default TableCanvas;
