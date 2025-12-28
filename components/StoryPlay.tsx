import React, { useState, useEffect, useRef } from 'react';
import { WorldSettings, Character, GameState, ChatMessage, StoryFormat, STORY_FORMATS } from '../types';
import { generateStoryResponse, generateInitialScene } from '../services/geminiService';
import { Send, Play, User as UserIcon, Bot, RefreshCw, ChevronLeft, Heart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface StoryPlayProps {
  world: WorldSettings;
  characters: Character[];
}

export const StoryPlay: React.FC<StoryPlayProps> = ({ world, characters }) => {
  const [gameState, setGameState] = useState<GameState>({
    stage: 'SELECT_FORMAT',
    selectedFormat: null,
    selectedCharacterId: null,
    history: []
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [gameState.history, isLoading]);

  const handleFormatSelect = (format: StoryFormat) => {
    setGameState(prev => ({
      ...prev,
      selectedFormat: format,
      stage: 'SELECT_CHARACTER'
    }));
  };

  const handleCharacterSelect = async (charId: string) => {
    if (!gameState.selectedFormat) return;
    
    const selectedChar = characters.find(c => c.id === charId);
    if (!selectedChar) return;

    setIsLoading(true);
    setGameState(prev => ({
      ...prev,
      stage: 'PLAYING',
      selectedCharacterId: charId
    }));

    // Generate initial scene
    const initialScene = await generateInitialScene(world, selectedChar, gameState.selectedFormat);
    
    setGameState(prev => ({
      ...prev,
      history: [{
        id: crypto.randomUUID(),
        sender: 'ai',
        characterName: 'Narrator',
        content: initialScene,
        timestamp: Date.now()
      }]
    }));
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !gameState.selectedCharacterId) return;

    const activeChar = characters.find(c => c.id === gameState.selectedCharacterId);
    if (!activeChar) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      content: input,
      timestamp: Date.now()
    };

    setGameState(prev => ({
      ...prev,
      history: [...prev.history, userMsg]
    }));
    setInput('');
    setIsLoading(true);

    const newHistory = [...gameState.history, userMsg];
    
    // Call Gemini Service
    const aiResponseText = await generateStoryResponse(
      world,
      activeChar,
      characters,
      newHistory,
      input,
      gameState.selectedFormat
    );

    const aiMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'ai',
      characterName: 'Narrator/NPCs',
      content: aiResponseText,
      timestamp: Date.now()
    };

    setGameState(prev => ({
      ...prev,
      history: [...prev.history, aiMsg]
    }));
    setIsLoading(false);
  };

  // === RENDER STAGES ===

  // 1. SELECT FORMAT
  if (gameState.stage === 'SELECT_FORMAT') {
     return (
       <div className="max-w-7xl mx-auto p-4 md:p-8 animate-fade-in overflow-y-auto h-full custom-scrollbar">
         <div className="text-center mb-10">
           <h2 className="text-4xl font-serif font-bold text-sage-text dark:text-mystic-gold mb-2 transition-colors duration-300">选择剧本类型 (Select Format)</h2>
           <p className="text-slate-500 dark:text-slate-400">Choose the medium for your story generation. The AI will adapt pacing and style accordingly.</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4 pb-12 place-items-center">
            
            {/* 1. Short Video - Mobile */}
            <DeviceFrame label="短视频" sub="< 3分钟" onClick={() => handleFormatSelect('SHORT_VIDEO')} type="mobile" />

            {/* 2. Micro Film - Tablet */}
            <DeviceFrame label="微电影" sub="3-30分钟" onClick={() => handleFormatSelect('MICRO_FILM')} type="tablet" />

            {/* 3. Feature Film - Cinema */}
            <DeviceFrame label="电影长片" sub="> 90分钟" onClick={() => handleFormatSelect('FEATURE_FILM')} type="cinema" />

            {/* 4. Micro Drama - Laptop */}
            <DeviceFrame label="微短剧" sub="< 10分钟" onClick={() => handleFormatSelect('MICRO_DRAMA')} type="laptop" />

            {/* 5. Mini Drama - Desktop */}
            <DeviceFrame label="迷你剧" sub="3-8集" onClick={() => handleFormatSelect('MINI_DRAMA')} type="desktop" />

            {/* 6. Long Series - TV */}
            <DeviceFrame label="长篇连续剧" sub="40+集" onClick={() => handleFormatSelect('SEASON_SERIES')} type="tv" />

         </div>
       </div>
     );
  }

  // 2. SELECT CHARACTER
  if (gameState.stage === 'SELECT_CHARACTER') {
    return (
      <div className="max-w-6xl mx-auto p-8 text-center animate-fade-in">
        <button 
          onClick={() => setGameState(prev => ({ ...prev, stage: 'SELECT_FORMAT', selectedFormat: null }))}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-bamboo-green dark:hover:text-ethereal-purple transition-colors mx-auto md:mx-0"
        >
          <ChevronLeft size={20} /> Back to Format Selection
        </button>

        <h2 className="text-4xl font-serif text-sage-text dark:text-mystic-gold mb-4 transition-colors">Select Your Perspective</h2>
        <p className="text-slate-500 dark:text-slate-300 mb-12 text-lg">
          World: <span className="text-bamboo-green dark:text-ethereal-purple font-bold">"{world.basic_name_type || 'Untitled'}"</span> | 
          Format: <span className="text-bamboo-green dark:text-ethereal-purple font-bold">{STORY_FORMATS[gameState.selectedFormat!].label}</span>
        </p>

        {characters.length === 0 ? (
          <div className="p-10 border border-dashed border-slate-400 dark:border-slate-600 rounded-xl text-slate-500">
            Please go to the Character module and create at least one character first.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {characters.map((char, index) => (
              <div 
                key={char.id}
                onClick={() => handleCharacterSelect(char.id)}
                className={`
                  group relative flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:-translate-y-2
                `}
              >
                {/* Avatar Circle Container */}
                <div className={`
                  w-24 h-24 rounded-full flex items-center justify-center mb-4 relative shadow-lg transition-all duration-300
                  bg-gradient-to-br from-slate-100 to-slate-200 border-4 border-white
                  group-hover:border-bamboo-green group-hover:shadow-emerald-500/30
                  dark:from-slate-800 dark:to-slate-900 dark:border-slate-700
                  dark:group-hover:border-ethereal-purple dark:group-hover:shadow-indigo-500/30
                `}>
                   <LittlePersonAvatar index={index} />
                   <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={32} className="text-white fill-white" />
                   </div>
                </div>

                {/* Name & Identity */}
                <div className="text-center w-full px-2">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 truncate transition-colors group-hover:text-bamboo-green dark:group-hover:text-ethereal-purple">
                    {char.name}
                  </h3>
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 truncate">
                    {char.basic_identity || 'Unknown'}
                  </div>
                  <div className="w-8 h-1 bg-slate-200 dark:bg-slate-700 mx-auto rounded-full group-hover:w-12 group-hover:bg-bamboo-green dark:group-hover:bg-ethereal-purple transition-all"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 3. PLAYING
  return (
    <div className={`
      flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto w-full rounded-xl overflow-hidden border shadow-2xl transition-colors duration-300
      bg-white border-slate-200 shadow-slate-200
      dark:bg-slate-950 dark:border-slate-800 dark:shadow-black
    `}>
      {/* Header */}
      <div className={`
        p-4 border-b flex justify-between items-center backdrop-blur-sm sticky top-0 z-10 transition-colors
        bg-white/90 border-slate-200
        dark:bg-slate-900/90 dark:border-slate-800
      `}>
        <div className="flex items-center gap-3">
           <div className={`
             w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg overflow-hidden p-1
             bg-slate-100 dark:bg-slate-800
           `}>
             <LittlePersonAvatar 
               index={characters.findIndex(c => c.id === gameState.selectedCharacterId)} 
               compact 
             />
           </div>
           <div>
             <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                {STORY_FORMATS[gameState.selectedFormat!].label.split('(')[0]} Mode
             </div>
             <div className="font-bold text-slate-800 dark:text-white text-lg">
                {characters.find(c => c.id === gameState.selectedCharacterId)?.name}
             </div>
           </div>
        </div>
        <button 
          onClick={() => setGameState({ stage: 'SELECT_FORMAT', selectedFormat: null, selectedCharacterId: null, history: [] })}
          className={`
            text-xs flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors
            bg-slate-100 text-slate-600 hover:text-red-500 hover:bg-red-50
            dark:bg-slate-800 dark:text-slate-500 dark:hover:text-red-400
          `}
        >
          <RefreshCw size={12} /> End Session
        </button>
      </div>

      {/* Chat Area */}
      <div className={`
        flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar transition-colors
        bg-gradient-to-b from-slate-50 to-white
        dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900
      `}>
        {gameState.history.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`
              w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mt-1 shadow-lg transition-colors overflow-hidden border
              ${msg.sender === 'user' 
                ? 'bg-white border-bamboo-green dark:bg-slate-800 dark:border-ethereal-purple' 
                : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700'
              }
            `}>
              {msg.sender === 'user' ? (
                 <LittlePersonAvatar index={characters.findIndex(c => c.id === gameState.selectedCharacterId)} compact />
              ) : (
                <Bot size={20} className="text-slate-500" />
              )}
            </div>
            
            <div className={`
              max-w-[85%] rounded-2xl p-5 text-sm leading-relaxed shadow-sm transition-colors
              ${msg.sender === 'user' 
                ? 'bg-emerald-50 text-slate-800 border border-emerald-100 rounded-tr-none dark:bg-indigo-900/30 dark:text-slate-100 dark:border-indigo-500/30' 
                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none dark:bg-slate-900/60 dark:text-slate-200 dark:border-slate-700'}
            `}>
              {msg.sender === 'ai' && msg.characterName && (
                <div className="text-xs text-bamboo-green dark:text-mystic-gold font-bold mb-2 uppercase tracking-widest opacity-80 flex items-center gap-2">
                  <span>{msg.characterName}</span>
                  <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-700"></div>
                </div>
              )}
              <div className="prose prose-sm max-w-none prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-headings:text-slate-800 dark:prose-headings:text-slate-200 prose-strong:text-slate-900 dark:prose-strong:text-white">
                 <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
             <div className="w-10 h-10 rounded-full bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 flex items-center justify-center mt-1 animate-pulse">
                <Bot size={20} className="text-slate-400 dark:text-slate-500" />
             </div>
             <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 flex items-center gap-2 shadow-sm">
                <div className="w-2 h-2 bg-bamboo-green dark:bg-ethereal-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-bamboo-green dark:bg-ethereal-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-bamboo-green dark:bg-ethereal-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`
        p-4 border-t transition-colors
        bg-white border-slate-200
        dark:bg-slate-900 dark:border-slate-800
      `}>
        <div className="relative max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Action / Dialogue..."
            disabled={isLoading}
            className={`
              w-full rounded-xl pl-4 pr-12 py-4 border outline-none resize-none h-[80px] scrollbar-hide shadow-inner transition-colors
              bg-slate-50 text-slate-800 border-slate-300 focus:border-bamboo-green focus:ring-1 focus:ring-bamboo-green
              dark:bg-slate-950 dark:text-white dark:border-slate-700 dark:focus:border-ethereal-purple dark:focus:ring-ethereal-purple
            `}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`
              absolute right-3 bottom-3 p-2 text-white rounded-lg transition-colors shadow-lg
              bg-bamboo-green hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 shadow-emerald-500/20
              dark:bg-ethereal-purple dark:hover:bg-indigo-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 dark:shadow-indigo-900/20
            `}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// === AVATARS ===
const LittlePersonAvatar = ({ index, compact = false }: { index: number, compact?: boolean }) => {
  const safeIndex = Math.max(0, index);
  const type = safeIndex % 6;
  const size = compact ? 24 : 64;
  const colors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#f472b6'];
  const color = colors[type];
  const skin = "#fecaca";

  const renderFace = () => (
    <g>
       <circle cx="50" cy="50" r="30" fill={skin} />
       <circle cx="35" cy="55" r="4" fill="#fca5a5" opacity="0.6" />
       <circle cx="65" cy="55" r="4" fill="#fca5a5" opacity="0.6" />
       {type % 3 === 0 ? (
          <><circle cx="38" cy="45" r="3" fill="#1e293b" /><circle cx="62" cy="45" r="3" fill="#1e293b" /></>
       ) : type % 3 === 1 ? (
           <><path d="M34 46 Q38 42 42 46" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M58 46 Q62 42 66 46" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" /></>
       ) : (
           <><circle cx="38" cy="45" r="3" fill="#1e293b" /><path d="M58 46 L66 46" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" /></>
       )}
       <path d="M42 60 Q50 65 58 60" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );

  const renderHat = () => {
    switch(type) {
      case 0: return <path d="M20 50 Q50 10 80 50" fill={color} />;
      case 1: return <g><path d="M25 45 Q50 15 75 45" fill={color} /><rect x="70" y="42" width="15" height="4" fill={color} rx="2" /></g>;
      case 2: return <rect x="20" y="35" width="60" height="10" fill={color} rx="2" />;
      case 3: return <path d="M30 40 L30 20 L40 30 L50 10 L60 30 L70 20 L70 40 Z" fill={color} />;
      case 4: return <g><path d="M20 50 Q20 10 80 50" stroke={color} strokeWidth="6" fill="none" /><rect x="15" y="45" width="10" height="15" rx="3" fill={color} /><rect x="75" y="45" width="10" height="15" rx="3" fill={color} /></g>;
      case 5: return <path d="M20 50 Q50 0 80 50 L80 80 L20 80 Z" fill={color} opacity="0.3" />;
      default: return null;
    }
  };

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
       <path d="M20 90 Q50 100 80 90 L80 100 L20 100 Z" fill={color} />
       <rect x="35" y="80" width="30" height="20" fill={color} />
       {renderFace()}
       {renderHat()}
    </svg>
  );
};

// === CARTOON DEVICE FRAMES WITH INTERACTIVE ANIMATIONS ===

interface BaseFrameProps {
  children?: React.ReactNode;
  className: string;
  onClick: () => void;
  label: string;
  sub: string;
  type: string;
  extraUI?: React.ReactNode;
}

const BaseFrame = ({ children, className, onClick, label, sub, type, extraUI }: BaseFrameProps) => (
  <div onClick={onClick} className="flex flex-col items-center group cursor-pointer relative">
    <div className={`relative transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] dark:group-hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] ${className}`}>
      {children}
      {extraUI}
    </div>
    <div className="mt-6 text-center">
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 group-hover:text-bamboo-green dark:group-hover:text-ethereal-purple transition-colors">{label}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-500">{sub}</p>
    </div>
  </div>
);

const ScreenPlaceholder = ({ label }: { label: string }) => (
  <div className={`
    w-full h-full flex items-center justify-center relative overflow-hidden transition-colors
    bg-slate-100 group-hover:bg-white
    dark:bg-[#0a0f1d] dark:group-hover:bg-[#0f1629]
  `}>
     <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 to-transparent dark:from-indigo-500"></div>
     <span className="text-slate-400 dark:text-slate-700 font-serif text-sm opacity-50 select-none group-hover:opacity-80 transition-opacity">
       {label}
     </span>
  </div>
);

const DeviceFrame = ({ type, label, sub, onClick }: { type: 'mobile'|'tablet'|'laptop'|'desktop'|'tv'|'cinema', label: string, sub: string, onClick: () => void }) => {
  
  // 1. Mobile (Short Video) + Baguette Hand
  if (type === 'mobile') {
    return (
      <BaseFrame 
        className="w-[160px] h-[300px] bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] border-4 border-slate-300 dark:border-slate-600 shadow-xl p-2 relative overflow-visible" 
        onClick={onClick} label={label} sub={sub} type={type}
        extraUI={
           // Baguette Hand Animation
           <div className="absolute -right-20 bottom-20 w-24 h-8 bg-orange-200 rounded-l-full rotate-[-15deg] transition-all duration-500 ease-out translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 shadow-lg border-2 border-orange-300 z-50 pointer-events-none"></div>
        }
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-200 dark:bg-slate-800 rounded-b-xl z-20 flex justify-center items-center">
           <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
        </div>
        <div className="w-full h-full rounded-[2rem] overflow-hidden border border-slate-300 dark:border-slate-900">
           <ScreenPlaceholder label={label} />
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
      </BaseFrame>
    );
  }

  // 2. Tablet (Micro Film) + Two Hands
  if (type === 'tablet') {
    return (
      <BaseFrame 
        className="w-[240px] h-[320px] bg-slate-300 dark:bg-gray-300 rounded-2xl border-4 border-slate-400 dark:border-gray-400 shadow-xl p-4 relative overflow-visible" 
        onClick={onClick} label={label} sub={sub} type={type}
        extraUI={
          <>
            {/* Left Hand */}
            <div className="absolute -left-12 top-1/2 w-16 h-8 bg-orange-200 rounded-r-full transition-all duration-500 ease-out -translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 shadow-lg border-2 border-orange-300 z-50 pointer-events-none"></div>
            {/* Right Hand */}
            <div className="absolute -right-12 top-1/2 w-16 h-8 bg-orange-200 rounded-l-full transition-all duration-500 ease-out translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 shadow-lg border-2 border-orange-300 z-50 pointer-events-none"></div>
          </>
        }
      >
        <div className="w-full h-full bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-400 dark:border-gray-500">
          <ScreenPlaceholder label={label} />
        </div>
        <div className="absolute top-1/2 right-1 w-1 h-12 bg-slate-400 dark:bg-gray-400 rounded-l"></div>
      </BaseFrame>
    );
  }

  // 4. Laptop (Micro Drama) + Marilyn Monroe
  if (type === 'laptop') {
    return (
      <BaseFrame className="flex flex-col items-center" onClick={onClick} label={label} sub={sub} type={type}>
        {/* Laptop Screen */}
        <div className="w-[300px] h-[190px] bg-slate-300 dark:bg-slate-700 rounded-t-xl border-t-4 border-l-4 border-r-4 border-slate-400 dark:border-slate-600 p-3 shadow-xl relative z-10">
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-500 rounded-full"></div>
          <div className="w-full h-full bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-400 dark:border-slate-800">
            <ScreenPlaceholder label={label} />
          </div>
        </div>
        
        {/* Laptop Base */}
        <div className="w-[340px] h-[12px] bg-slate-400 dark:bg-slate-600 rounded-b-xl shadow-lg relative z-0">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-300 dark:bg-slate-500 rounded-b"></div>
        </div>

        {/* Monroe Character */}
        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center transition-transform duration-300 group-hover:scale-110">
           {/* Head */}
           <div className="w-16 h-16 bg-amber-100 rounded-full relative shadow-md">
              {/* Hair (Wavy) */}
              <div className="absolute -top-1 -left-2 w-20 h-10 bg-amber-100 rounded-t-full rounded-b-lg"></div>
              <div className="absolute top-4 -right-2 w-4 h-12 bg-amber-100 rounded-full rotate-12"></div>
              <div className="absolute top-4 -left-2 w-4 h-12 bg-amber-100 rounded-full -rotate-12"></div>
              
              {/* Back of Head (Default) cover face */}
              <div className="absolute inset-0 bg-amber-100 rounded-full z-10 group-hover:opacity-0 transition-opacity duration-300"></div>

              {/* Face (Hover) */}
              <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pt-2">
                 <div className="flex gap-4 mb-1">
                    <div className="w-2 h-2 bg-slate-800 rounded-full">
                       <div className="w-3 h-1 bg-black -mt-2 rounded-full rotate-[-20deg]"></div> {/* Lashes */}
                    </div>
                    <div className="w-2 h-2 bg-slate-800 rounded-full">
                       <div className="w-3 h-1 bg-black -mt-2 rounded-full rotate-[20deg]"></div>
                    </div>
                 </div>
                 {/* Mole */}
                 <div className="w-1 h-1 bg-slate-800 rounded-full absolute top-9 left-4"></div>
                 {/* Lips blowing kiss */}
                 <div className="w-3 h-2 bg-red-500 rounded-full mt-1"></div>
              </div>
           </div>
           {/* Body (Dress) */}
           <div className="w-12 h-10 bg-white rounded-t-2xl -mt-2 shadow-sm relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-white rounded-full"></div> {/* Halter */}
           </div>
           
           {/* Kiss Hand Animation */}
           <div className="absolute top-8 right-0 w-4 h-4 bg-orange-200 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-4 group-hover:-translate-y-4">
              <div className="w-1 h-1 bg-red-500 rounded-full absolute top-0 left-0"></div> {/* Nail polish */}
           </div>
           {/* Heart Animation */}
           <Heart size={20} className="text-pink-500 fill-pink-500 absolute top-0 right-[-20px] opacity-0 group-hover:opacity-100 group-hover:-translate-y-10 transition-all duration-700 delay-100" />
        </div>
      </BaseFrame>
    );
  }

  // 5. Desktop (Mini Drama) + Angry Otaku
  if (type === 'desktop') {
    return (
      <BaseFrame className="flex flex-col items-center" onClick={onClick} label={label} sub={sub} type={type}>
        {/* Monitor */}
        <div className="w-[300px] h-[200px] bg-slate-300 dark:bg-slate-800 rounded-lg border-4 border-slate-400 dark:border-slate-700 p-3 shadow-xl relative z-10">
          <div className="w-full h-full bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-400 dark:border-slate-900">
            <ScreenPlaceholder label={label} />
          </div>
          <div className="absolute -bottom-1 right-4 w-2 h-2 bg-blue-500 rounded-full opacity-50"></div>
        </div>
        {/* Stand */}
        <div className="w-8 h-10 bg-slate-400 dark:bg-slate-700 relative z-0"></div>
        <div className="w-24 h-3 bg-slate-500 dark:bg-slate-600 rounded-full shadow-lg relative z-0"></div>

        {/* Otaku Character */}
        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center transition-transform duration-100 group-hover:translate-x-1 group-hover:-translate-x-1 group-hover:animate-pulse">
           {/* Head */}
           <div className="w-16 h-16 bg-slate-800 rounded-full relative shadow-md">
              {/* Messy Hair */}
              <div className="absolute -top-2 left-0 w-full h-full bg-slate-800 rounded-full scale-110 clip-path-messy"></div>
              
              {/* Headphones */}
              <div className="absolute top-2 -left-2 w-4 h-12 bg-red-500 rounded-full border-2 border-red-700"></div>
              <div className="absolute top-2 -right-2 w-4 h-12 bg-red-500 rounded-full border-2 border-red-700"></div>
              <div className="absolute -top-1 left-0 w-full h-4 border-t-4 border-red-500 rounded-t-full"></div>

              {/* Back of Head (Default) */}
              <div className="absolute inset-0 bg-slate-800 rounded-full z-10 group-hover:opacity-0 transition-opacity"></div>

              {/* Angry Face (Hover) */}
              <div className="absolute inset-0 z-0 bg-orange-200 rounded-full flex flex-col items-center justify-center pt-2">
                 <div className="flex gap-4 mb-1">
                    <div className="w-3 h-1 bg-black rotate-45"></div> {/* Eyebrow */}
                    <div className="w-3 h-1 bg-black -rotate-45"></div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-2 h-2 bg-white rounded-full"><div className="w-1 h-1 bg-black rounded-full mx-auto mt-1"></div></div>
                    <div className="w-2 h-2 bg-white rounded-full"><div className="w-1 h-1 bg-black rounded-full mx-auto mt-1"></div></div>
                 </div>
                 <div className="w-4 h-2 bg-black rounded-t-lg mt-2 rotate-180"></div> {/* Mouth */}
                 
                 {/* Vein Pop */}
                 <div className="absolute top-2 right-2 text-red-600 font-bold text-lg opacity-0 group-hover:opacity-100">💢</div>
              </div>
           </div>
           {/* Body */}
           <div className="w-14 h-12 bg-slate-600 rounded-t-xl -mt-2">
              <div className="w-full h-full flex justify-center pt-2">
                 <div className="text-xs text-slate-400 font-mono">GAME</div>
              </div>
           </div>
        </div>
      </BaseFrame>
    );
  }

  // 6. TV (Long Series) + Family
  if (type === 'tv') {
    return (
      <BaseFrame className="relative group/tv" onClick={onClick} label={label} sub={sub} type={type}>
         <div className="w-[320px] h-[240px] bg-[#5d4037] dark:bg-[#3f2e26] rounded-3xl border-4 border-[#3e2723] dark:border-[#2a1e18] p-4 shadow-xl relative flex gap-2 z-10">
            <div className="flex-1 h-full bg-black rounded-2xl overflow-hidden border-2 border-[#1a120e] shadow-inner">
               <div className="w-full h-full bg-slate-900 dark:bg-slate-950 flex items-center justify-center relative">
                   <ScreenPlaceholder label={label} />
               </div>
            </div>
            {/* TV Controls */}
            <div className="w-12 h-full flex flex-col items-center justify-center gap-4 bg-[#3e2723] dark:bg-[#2a1e18] rounded-r-xl pr-1">
               <div className="w-8 h-8 rounded-full border-2 border-[#8d6e63] dark:border-[#5c4033] bg-[#5d4037] dark:bg-[#3f2e26] relative"></div>
            </div>
         </div>
         {/* Legs */}
         <div className="w-full flex justify-between px-8 relative z-0">
            <div className="w-4 h-6 bg-[#3e2723] dark:bg-[#2a1e18] -rotate-12"></div>
            <div className="w-4 h-6 bg-[#3e2723] dark:bg-[#2a1e18] rotate-12"></div>
         </div>

         {/* Family Seating */}
         <div className="absolute bottom-[-20px] w-[340px] h-16 flex justify-center items-end gap-1 z-20">
             
             {/* Grandma */}
             <div className="flex flex-col items-center relative group-hover/tv:translate-y-[-5px] transition-transform duration-300 delay-75">
                <div className="w-10 h-10 rounded-full relative transition-colors duration-300 bg-slate-400 group-hover/tv:bg-orange-200"> {/* Hair -> Face */}
                   {/* Bun */}
                   <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-400 rounded-full"></div>
                   {/* Face Details (Hidden by default) */}
                   <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/tv:opacity-100 transition-opacity">
                      <div className="w-6 h-2 border-2 border-slate-600 rounded-full mb-1"></div> {/* Glasses */}
                      <div className="w-4 h-2 border-b-2 border-slate-600 rounded-full"></div> {/* Smile */}
                   </div>
                </div>
                <div className="w-12 h-10 bg-purple-700 rounded-t-xl -mt-2 flex justify-center items-center">
                   {/* Knitting Animation on Hover */}
                   <div className="w-8 h-4 bg-pink-300 rounded opacity-0 group-hover/tv:opacity-100 animate-pulse"></div>
                </div>
             </div>

             {/* Big Kid (Boy) */}
             <div className="flex flex-col items-center relative group-hover/tv:translate-y-[-5px] transition-transform duration-300 delay-100">
                <div className="w-9 h-9 bg-orange-200 rounded-full relative">
                   <div className="absolute top-0 w-full h-3 bg-black rounded-t-full"></div> {/* Hair */}
                   {/* Back Head Mask */}
                   <div className="absolute inset-0 bg-black rounded-full z-10 group-hover/tv:opacity-0 transition-opacity"></div>
                   {/* Face */}
                   <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                      <div className="flex gap-2"><div className="w-1 h-1 bg-black rounded-full"></div><div className="w-1 h-1 bg-black rounded-full"></div></div>
                      <div className="w-3 h-1 bg-black rounded-full mt-1"></div>
                   </div>
                </div>
                <div className="w-10 h-8 bg-blue-600 rounded-t-xl -mt-1"></div>
             </div>

             {/* Dad */}
             <div className="flex flex-col items-center relative z-10 group-hover/tv:rotate-12 transition-transform duration-300 origin-bottom-right">
                <div className="w-12 h-12 bg-orange-200 rounded-full relative">
                   <div className="absolute top-0 w-full h-4 bg-amber-900 rounded-t-full"></div>
                   {/* Back Head Mask */}
                   <div className="absolute inset-0 bg-amber-900 rounded-full z-10 group-hover/tv:opacity-0 transition-opacity"></div>
                   {/* Face (Kissing) */}
                   <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                       <div className="w-2 h-2 bg-black rounded-full mb-1 ml-4"></div> {/* Side Eye */}
                       <div className="w-2 h-2 bg-red-400 rounded-full ml-4"></div> {/* Kiss Lips */}
                   </div>
                   {/* Heart */}
                   <Heart size={12} className="text-red-500 fill-red-500 absolute -top-4 right-0 opacity-0 group-hover/tv:opacity-100 animate-bounce" />
                </div>
                <div className="w-16 h-12 bg-green-800 rounded-t-2xl -mt-2"></div>
             </div>

             {/* Mom */}
             <div className="flex flex-col items-center relative z-10 group-hover/tv:-rotate-12 transition-transform duration-300 origin-bottom-left">
                <div className="w-11 h-11 bg-orange-200 rounded-full relative">
                   <div className="absolute top-0 w-full h-full bg-amber-800 rounded-full scale-110 -z-10"></div> {/* Long Hair */}
                   {/* Back Head Mask */}
                   <div className="absolute inset-0 bg-amber-800 rounded-full z-10 group-hover/tv:opacity-0 transition-opacity"></div>
                   {/* Face (Kissing) */}
                   <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                       <div className="w-2 h-2 bg-black rounded-full mb-1 mr-4"></div>
                       <div className="w-2 h-2 bg-red-400 rounded-full mr-4"></div>
                   </div>
                </div>
                <div className="w-14 h-11 bg-red-700 rounded-t-2xl -mt-1"></div>
             </div>

             {/* Middle Kid (Girl) */}
             <div className="flex flex-col items-center relative group-hover/tv:translate-y-[-5px] transition-transform duration-300 delay-150">
                <div className="w-9 h-9 bg-orange-200 rounded-full relative">
                   <div className="absolute -left-1 top-1 w-2 h-4 bg-yellow-700 rounded-full"></div> {/* Pigtail L */}
                   <div className="absolute -right-1 top-1 w-2 h-4 bg-yellow-700 rounded-full"></div> {/* Pigtail R */}
                   <div className="absolute top-0 w-full h-3 bg-yellow-700 rounded-t-full"></div>
                   {/* Back Head Mask */}
                   <div className="absolute inset-0 bg-yellow-700 rounded-full z-10 group-hover/tv:opacity-0 transition-opacity"></div>
                   {/* Face */}
                   <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                      <div className="flex gap-2"><div className="w-1 h-1 bg-black rounded-full"></div><div className="w-1 h-1 bg-black rounded-full"></div></div>
                      <div className="w-3 h-2 border-b-2 border-red-400 rounded-full mt-0"></div>
                   </div>
                </div>
                <div className="w-10 h-8 bg-pink-500 rounded-t-xl -mt-1"></div>
             </div>

             {/* Baby */}
             <div className="flex flex-col items-center relative group-hover/tv:translate-y-[-5px] transition-transform duration-300 delay-200">
                <div className="w-7 h-7 bg-orange-200 rounded-full relative">
                   <div className="absolute top-0 w-full h-2 bg-amber-200 rounded-t-full"></div>
                   {/* Back Head Mask */}
                   <div className="absolute inset-0 bg-amber-200 rounded-full z-10 group-hover/tv:opacity-0 transition-opacity"></div>
                   {/* Face */}
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="flex gap-1"><div className="w-1 h-1 bg-black rounded-full"></div><div className="w-1 h-1 bg-black rounded-full"></div></div>
                      <div className="w-2 h-2 bg-blue-300 rounded-full mt-1 border border-blue-500"></div> {/* Pacifier */}
                   </div>
                </div>
                <div className="w-8 h-6 bg-yellow-300 rounded-t-xl -mt-1"></div>
             </div>
         </div>

      </BaseFrame>
    );
  }

  // 3. Cinema (Feature Film) + Audience + Waving Guy
  if (type === 'cinema') {
    return (
      <BaseFrame 
         className="flex flex-col items-center h-[300px]" // Explicit height to match mobile/tablet
         onClick={onClick} label={label} sub={sub} type={type}
      >
        {/* Top Curtain Valance */}
        <div className="w-[320px] h-4 bg-red-700 dark:bg-red-800 rounded-t-lg relative z-20 shadow-lg border-b border-red-900"></div>
        
        {/* Screen Area (Taller to fit composition) */}
        <div className="w-[300px] h-[140px] bg-black border-x-8 border-red-800 dark:border-red-900 relative shadow-2xl overflow-hidden z-10">
           <div className="absolute top-0 bottom-0 left-0 w-6 bg-red-700 dark:bg-red-800 rounded-r-3xl shadow-inner z-20"></div>
           <div className="absolute top-0 bottom-0 right-0 w-6 bg-red-700 dark:bg-red-800 rounded-l-3xl shadow-inner z-20"></div>
           <div className="w-full h-full opacity-90">
              <ScreenPlaceholder label={label} />
              {/* Screen Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/50 pointer-events-none"></div>
           </div>
        </div>
        
        {/* Stage Floor */}
        <div className="w-[340px] h-6 bg-red-900 dark:bg-red-950 rounded-lg shadow-xl mt-[-2px] z-20 flex justify-center items-center">
            <div className="w-2/3 h-2 bg-black/20 rounded-full blur-sm"></div>
        </div>

        {/* Audience Seating (New Addition for Height) */}
        <div className="w-[340px] h-[130px] bg-slate-900 mt-[-10px] relative z-0 rounded-b-3xl flex flex-col items-center justify-end pb-4 pt-4 overflow-hidden shadow-2xl border-x-4 border-b-4 border-slate-800">
            {/* Ambient Light from Screen */}
            <div className="absolute top-0 w-full h-20 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none"></div>
            
            {/* Row 3 (Back) */}
            <div className="flex gap-4 mb-[-10px] scale-75 opacity-50 blur-[1px]">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-slate-600 rounded-full"></div>
                    <div className="w-10 h-8 bg-slate-700 rounded-t-lg -mt-2"></div>
                 </div>
               ))}
            </div>

            {/* Row 2 (Middle) */}
            <div className="flex gap-6 mb-[-15px] scale-90 opacity-80 z-10">
               {[1,2,3,4].map(i => (
                 <div key={i} className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-slate-500 rounded-full"></div>
                    <div className="w-12 h-10 bg-slate-600 rounded-t-lg -mt-3"></div>
                 </div>
               ))}
            </div>

            {/* Row 1 (Front) + The Waver */}
            <div className="flex gap-8 scale-100 z-20">
               <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-400 rounded-full"></div>
                  <div className="w-14 h-12 bg-slate-500 rounded-t-lg -mt-3"></div>
               </div>
               
               {/* THE WAVER (Center) */}
               <div className="flex flex-col items-center group-hover:translate-y-[-10px] transition-transform duration-300">
                  {/* Head */}
                  <div className="w-12 h-12 bg-slate-400 rounded-full relative group-hover:bg-orange-200 transition-colors duration-300"> {/* Back -> Face color */}
                     {/* Face features (hidden by default) */}
                     <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center pt-2">
                        <div className="flex gap-2 mb-1">
                           <div className="w-1 h-1 bg-black rounded-full"></div>
                           <div className="w-1 h-1 bg-black rounded-full"></div>
                        </div>
                        <div className="w-3 h-2 border-b-2 border-black rounded-full"></div>
                     </div>
                  </div>
                  {/* Body */}
                  <div className="w-14 h-12 bg-indigo-600 rounded-t-lg -mt-3 relative">
                      {/* Waving Hand */}
                      <div className="absolute -right-4 top-0 w-3 h-8 bg-orange-200 rounded-full origin-bottom rotate-12 opacity-0 group-hover:opacity-100 group-hover:animate-wave border border-orange-300"></div>
                  </div>
               </div>

               <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-400 rounded-full"></div>
                  <div className="w-14 h-12 bg-slate-500 rounded-t-lg -mt-3"></div>
               </div>
            </div>
        </div>
      </BaseFrame>
    );
  }

  return null;
}