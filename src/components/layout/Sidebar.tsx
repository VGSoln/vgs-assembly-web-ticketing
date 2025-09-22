import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MenuItemType, PageType } from '@/types/dashboard';

const colorMap: Record<string, string> = {
  'text-blue-400': '#60a5fa',
  'text-blue-300': '#93c5fd',  
  'text-green-400': '#4ade80',
  'text-purple-400': '#c084fc',
  'text-orange-400': '#fb923c',
  'text-cyan-400': '#22d3ee',
  'text-pink-400': '#f472b6',
  'text-yellow-400': '#facc15',
  'text-indigo-400': '#818cf8'
};

interface SidebarProps {
  isOpen: boolean;
  menuItems: MenuItemType[];
  expandedMenus: { [key: string]: boolean };
  currentPage: PageType;
  onToggleSubmenu: (menu: string) => void;
  onPageChange: (page: PageType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  menuItems,
  expandedMenus,
  currentPage,
  onToggleSubmenu,
  onPageChange
}) => {
  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl h-screen transition-all duration-300 flex-shrink-0 flex flex-col`}>
      <div className="p-6 flex-1 overflow-y-auto sidebar-scroll">
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center space-x-3 ${!isOpen && 'justify-center'}`}>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-slate-900 font-bold text-lg">W</span>
            </div>
            {isOpen && (
              <div>
                <h2 className="font-bold text-lg text-white">AEDA Admin</h2>
                <p className="text-xs text-gray-400">System Admin</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mb-4">
          {isOpen && "Atiwa East District Assembly"}
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <div key={index}>
              <button
                onClick={() => item.subItems && onToggleSubmenu(item.label)}
                data-label={item.label}
                className={`w-full flex items-center justify-between ${isOpen ? 'px-3' : 'px-2 justify-center'} py-2.5 rounded-lg transition-all duration-200 hover:bg-white/10`}
              >
                <div className="flex items-center">
                  <item.icon 
                    size={20} 
                    className="transition-colors" 
                    style={{ color: colorMap[item.color] || '#ffffff' }} 
                  />
                  {isOpen && <span className="ml-3 text-sm font-medium text-white">{item.label}</span>}
                </div>
                {isOpen && item.subItems && (
                  <ChevronRight 
                    size={16} 
                    className={`transition-transform text-white ${expandedMenus[item.label] ? 'rotate-90' : ''}`}
                  />
                )}
              </button>
              
              {isOpen && item.subItems && expandedMenus[item.label] && (
                <div className="ml-8 mt-1 space-y-1 max-h-64 overflow-y-auto pr-2 sidebar-scroll">
                  {item.subItems.map((subItem, subIndex) => (
                    <button
                      key={subIndex}
                      onClick={() => subItem.page && onPageChange(subItem.page as PageType)}
                      data-page={subItem.page}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${
                        subItem.page === currentPage
                          ? 'bg-blue-500/20 text-blue-300 border-l-2 border-blue-400' 
                          : 'hover:bg-white/5 text-gray-400'
                      }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};