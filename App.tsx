
import React, { useState, useEffect } from 'react';
import { MealType, CultureStyle, TableSettingConfig, TableItem } from './types';
import { MEAL_TYPES, CULTURE_STYLES, DEFAULT_SETTING } from './constants';
import { generateTableConfig, generateTableImage } from './services/geminiService';
import TableCanvas from './components/TableCanvas';
import Assistant from './components/Assistant';
import { 
  Menu, X, Sparkles, ChefHat, Globe, Layout, 
  MessageCircle, Download, Share2, ZoomIn, 
  ArrowRight, Info, CheckCircle2 
} from 'lucide-react';

// Simple Modal Component
const Modal = ({ children, onClose }: { children?: React.ReactNode, onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="relative w-full max-w-lg">
      <button onClick={onClose} className="absolute -top-10 right-0 text-white hover:text-amber-400">
        <X size={24} />
      </button>
      {children}
    </div>
  </div>
);

const App: React.FC = () => {
  // State
  const [selectedMeal, setSelectedMeal] = useState<MealType>(MealType.Dinner);
  const [selectedCulture, setSelectedCulture] = useState<CultureStyle>(CultureStyle.American);
  const [config, setConfig] = useState<TableSettingConfig>(DEFAULT_SETTING);
  const [loadingConfig, setLoadingConfig] = useState(false);
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  
  const [showAssistant, setShowAssistant] = useState(false);
  const [selectedItemDetails, setSelectedItemDetails] = useState<TableItem | null>(null);
  
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonConfig, setComparisonConfig] = useState<TableSettingConfig | null>(null);

  // Load configuration when filters change
  useEffect(() => {
    loadSetting(selectedMeal, selectedCulture, setConfig, setLoadingConfig);
    setGeneratedImage(null); // Reset image on change
  }, [selectedMeal, selectedCulture]);

  const loadSetting = async (
    meal: MealType, 
    culture: CultureStyle, 
    setter: (c: TableSettingConfig) => void, 
    loader: (l: boolean) => void
  ) => {
    loader(true);
    try {
      const data = await generateTableConfig(meal, culture);
      setter(data);
    } catch (err) {
      console.error("Failed to load config, using default", err);
      setter(DEFAULT_SETTING);
    } finally {
      loader(false);
    }
  };

  const handleGenerateImage = async () => {
    if (loadingImage || generatedImage) return;
    setLoadingImage(true);
    try {
        const desc = `${selectedCulture} style ${selectedMeal} table setting. ${config.description}`;
        const imgUrl = await generateTableImage(desc);
        setGeneratedImage(imgUrl);
    } catch (e) {
        console.error(e);
    } finally {
        setLoadingImage(false);
    }
  };

  const toggleComparison = async () => {
      if (comparisonMode) {
          setComparisonMode(false);
          return;
      }
      setComparisonMode(true);
      // Load a default comparison (e.g. same meal, different culture)
      const nextCulture = CULTURE_STYLES.find(c => c !== selectedCulture) || CultureStyle.European;
      await loadSetting(selectedMeal, nextCulture, setComparisonConfig, () => {});
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-stone-900 text-white p-1.5 rounded">
              <Layout size={20} />
            </div>
            <h1 className="text-xl font-serif font-bold tracking-tight text-stone-900">TableCraft</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-4 text-sm font-medium text-stone-600">
               <button className="hover:text-amber-600 transition-colors">Guide</button>
               <button className="hover:text-amber-600 transition-colors">Gallery</button>
               <button className="hover:text-amber-600 transition-colors">About</button>
            </nav>
            <div className="h-4 w-px bg-stone-300"></div>
            <button 
              onClick={() => setShowAssistant(true)}
              className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-600 transition-colors shadow-sm"
            >
              <Sparkles size={14} />
              Ask AI Assistant
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Controls */}
        <aside className="w-full lg:w-64 space-y-8 flex-shrink-0">
          
          {/* Filters */}
          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 block">Meal Type</label>
              <div className="space-y-1">
                {MEAL_TYPES.map(meal => (
                  <button
                    key={meal}
                    onClick={() => setSelectedMeal(meal)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedMeal === meal 
                        ? 'bg-stone-200 text-stone-900 font-medium' 
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {meal}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 block">Cultural Style</label>
              <div className="space-y-1">
                {CULTURE_STYLES.map(style => (
                  <button
                    key={style}
                    onClick={() => setSelectedCulture(style)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedCulture === style 
                        ? 'bg-amber-100 text-amber-900 font-medium' 
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={toggleComparison}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition-colors text-sm font-medium ${
                  comparisonMode 
                  ? 'bg-stone-900 text-white border-stone-900' 
                  : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
              }`}
            >
               {comparisonMode ? <CheckCircle2 size={16}/> : <ArrowRight size={16}/>}
               {comparisonMode ? 'Exit Comparison' : 'Compare Styles'}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 space-y-8">
            
            {/* Title Section */}
            <div>
                <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">
                    {config.title}
                </h2>
                <p className="text-stone-600 leading-relaxed max-w-2xl">
                    {loadingConfig ? <span className="animate-pulse bg-stone-200 rounded text-transparent">Loading description...</span> : config.description}
                </p>
            </div>

            {/* Interactive Views */}
            <div className={`grid gap-6 ${comparisonMode ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
                
                {/* Primary View */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-stone-500 uppercase tracking-wide">{selectedCulture} Style</span>
                        <div className="flex gap-2">
                             <button 
                                onClick={handleGenerateImage}
                                className="text-xs flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium"
                             >
                                <Sparkles size={12}/> {generatedImage ? 'Regenerate View' : 'Generate Realistic View'}
                             </button>
                        </div>
                    </div>

                    <div className="relative">
                        {loadingConfig ? (
                            <div className="w-full h-[500px] bg-stone-100 rounded-xl flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-stone-400 text-sm">Consulting AI experts...</p>
                                </div>
                            </div>
                        ) : (
                            generatedImage ? (
                                <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-lg group">
                                     {loadingImage && (
                                         <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-10 flex items-center justify-center text-white">
                                             <Sparkles className="animate-spin mr-2"/> Rendering...
                                         </div>
                                     )}
                                    <img src={generatedImage} alt="AI Generated Table" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <button 
                                        onClick={() => setGeneratedImage(null)}
                                        className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-stone-800 hover:bg-white transition-colors shadow"
                                    >
                                        <Layout size={18} />
                                    </button>
                                </div>
                            ) : (
                                <TableCanvas 
                                    items={config.items} 
                                    showLabels={true} 
                                    onItemClick={setSelectedItemDetails}
                                />
                            )
                        )}
                    </div>
                    
                    {/* Tips Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                        <h3 className="font-serif font-semibold text-lg mb-4 flex items-center gap-2">
                            <ChefHat size={18} className="text-amber-600" />
                            Pro Tips
                        </h3>
                        <ul className="space-y-3">
                            {config.tips.map((tip, i) => (
                                <li key={i} className="flex gap-3 text-sm text-stone-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1.5 flex-shrink-0"></span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Comparison View (Conditional) */}
                {comparisonMode && (
                     <div className="space-y-4 border-l-2 border-dashed border-stone-200 pl-0 xl:pl-6">
                        <div className="flex justify-between items-center">
                            <select 
                                className="bg-transparent text-sm font-medium text-stone-900 uppercase tracking-wide border-b border-stone-300 focus:outline-none"
                                onChange={(e) => loadSetting(selectedMeal, e.target.value as CultureStyle, setComparisonConfig, () => {})}
                                defaultValue={CULTURE_STYLES.find(c => c !== selectedCulture)}
                            >
                                {CULTURE_STYLES.filter(c => c !== selectedCulture).map(c => (
                                    <option key={c} value={c}>{c} Style</option>
                                ))}
                            </select>
                        </div>
                        
                        {comparisonConfig ? (
                             <TableCanvas items={comparisonConfig.items} showLabels={true} onItemClick={setSelectedItemDetails}/>
                        ) : (
                            <div className="w-full h-[500px] bg-stone-50 rounded-xl flex items-center justify-center text-stone-400">
                                Loading comparison...
                            </div>
                        )}
                        
                        {comparisonConfig && (
                             <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                                <h3 className="font-serif font-semibold text-lg mb-4 text-stone-400">
                                    Comparison Notes
                                </h3>
                                <ul className="space-y-3 opacity-75">
                                    {comparisonConfig.tips.slice(0, 3).map((tip, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-stone-500">
                                            <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1.5 flex-shrink-0"></span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                     </div>
                )}
            </div>
        </div>
      </main>

      {/* Item Detail Modal */}
      {selectedItemDetails && (
        <Modal onClose={() => setSelectedItemDetails(null)}>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="h-32 bg-stone-900 flex items-center justify-center">
                     <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white">
                        <Info size={32} />
                     </div>
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-serif font-bold mb-2">{selectedItemDetails.name}</h3>
                    <div className="inline-block px-2 py-1 bg-stone-100 text-stone-500 text-xs font-semibold rounded mb-4 uppercase tracking-wider">
                        {selectedItemDetails.type}
                    </div>
                    <p className="text-stone-600 mb-6">
                        {selectedItemDetails.description}
                    </p>
                    <button 
                        onClick={() => setSelectedItemDetails(null)}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </Modal>
      )}

      {/* AI Assistant Floating Panel */}
      {showAssistant && (
          <div className="fixed bottom-4 right-4 z-40 w-96 h-[600px] max-h-[80vh] shadow-2xl rounded-2xl animate-slide-up">
              <Assistant onClose={() => setShowAssistant(false)} />
          </div>
      )}
      
      {/* Floating Toggle for Mobile */}
      {!showAssistant && (
        <button 
            onClick={() => setShowAssistant(true)}
            className="fixed bottom-6 right-6 z-40 bg-stone-900 text-white p-4 rounded-full shadow-lg hover:bg-amber-600 transition-colors md:hidden"
        >
            <Sparkles size={24} />
        </button>
      )}

    </div>
  );
};

export default App;
