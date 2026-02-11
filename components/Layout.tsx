import React, { useState } from 'react';
import { Calendar, PlusCircle, PieChart, Menu, Bell, Activity, ChefHat, Share2, Copy, Check, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-slate-700 flex flex-col items-center gap-3">
          <div className="w-full flex justify-between items-start md:justify-center relative">
             <div className="bg-white/95 rounded-full p-2 shadow-lg shadow-amber-500/10 mx-auto">
               <img 
                 src="https://lh3.googleusercontent.com/d/1iQz0OX66dsa6hci3S2LURGc6q8pFqdS-" 
                 alt="Deli Alhambra Logo" 
                 className="w-28 h-28 object-contain"
               />
             </div>
             <Menu className="w-6 h-6 md:hidden text-gray-400 absolute top-0 left-0" />
          </div>
          <div className="text-center hidden md:block mt-2">
            <span className="text-xs text-amber-500 tracking-[0.2em] font-semibold uppercase">Farm to Table</span>
          </div>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'bg-amber-600/20 text-amber-500 border border-amber-500/20' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <PieChart size={20} />
            <span>לוח בקרה</span>
          </button>
          
          <button
            onClick={() => setActiveTab('new-event')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'new-event' ? 'bg-amber-600/20 text-amber-500 border border-amber-500/20' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <PlusCircle size={20} />
            <span>אירוע חדש</span>
          </button>

          <button
            onClick={() => setActiveTab('kitchen')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'kitchen' ? 'bg-amber-600/20 text-amber-500 border border-amber-500/20' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ChefHat size={20} />
            <span>מטבח (KDS)</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'calendar' ? 'bg-amber-600/20 text-amber-500 border border-amber-500/20' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Calendar size={20} />
            <span>יומן אירועים</span>
          </button>

          <button
            onClick={() => setActiveTab('operations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'operations' ? 'bg-amber-600/20 text-amber-500 border border-amber-500/20' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Activity size={20} />
            <span>מרכז תפעול</span>
          </button>

          <div className="pt-4 mt-4 border-t border-slate-700">
            <button
                onClick={() => setIsShareModalOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            >
                <Share2 size={20} />
                <span>שתף מערכת</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-700 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
              <span className="font-bold text-sm text-amber-500">י״כ</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-200">ישראל כהן</p>
              <p className="text-xs text-slate-400">מנהל רווחה</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeTab === 'dashboard' && 'סקירה כללית'}
            {activeTab === 'new-event' && 'יצירת אירוע חדש'}
            {activeTab === 'kitchen' && 'ניהול מטבח ורכש (KDS)'}
            {activeTab === 'calendar' && 'לוח שנה'}
            {activeTab === 'operations' && 'מרכז תפעול ובקרה'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6 bg-[#f8f9fa]">
          {children}
        </div>
      </main>

      {/* Share App Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fadeIn relative">
                <button 
                    onClick={() => setIsShareModalOpen(false)}
                    className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Share2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">שתף את המערכת</h3>
                    <p className="text-gray-500 text-sm mt-2">
                        שתף את הגישה למערכת EventPro עם עובדי הארגון ומנהלים נוספים.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200" dir="ltr">
                        <input 
                            type="text" 
                            readOnly 
                            value={window.location.href} 
                            className="bg-transparent border-none focus:ring-0 text-gray-600 text-sm w-full font-mono"
                        />
                        <button 
                            onClick={handleCopy} 
                            className="text-gray-500 hover:text-blue-600 transition-colors"
                        >
                            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                        </button>
                    </div>

                    <button 
                        onClick={() => {
                            const text = `היי, מוזמן להצטרף למערכת ניהול האירועים שלנו:\n${window.location.href}`;
                            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                        }}
                        className="w-full py-3 bg-[#25D366] text-white font-bold rounded-lg hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
                    >
                        <Share2 size={18} />
                        שלח בוואטסאפ
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};