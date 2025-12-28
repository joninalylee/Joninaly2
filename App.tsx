import React, { useState, useEffect } from 'react';
import { WorldSettings, Character, AppMode } from './types';
import { WorldBuilder } from './components/WorldBuilder';
import { CharacterBuilder } from './components/CharacterBuilder';
import { StoryPlay } from './components/StoryPlay';
import { Globe, Users, BookOpenCheck } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.WORLD_BUILDING);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Sync theme with body class for global styles (like scrollbars)
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#020617';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  // Application State
  const [worldData, setWorldData] = useState<WorldSettings>({
    // Basic
    basic_name_type: '',
    basic_common_setting: '',
    basic_lifeforms: '',
    basic_legends_scope: '',
    basic_legends_content: '',
    basic_legends_impact_level: '',
    basic_legends_impact_personal: '',
    basic_customs_scope_content: '',
    basic_customs_origin: '',
    basic_customs_impact: '',
    basic_customs_continuity: '',
    
    // Social
    social_factions_scope: '',
    social_factions_info: '',
    social_factions_members: '',
    social_hierarchy_scope: '',
    social_hierarchy_cause: '',
    social_hierarchy_symbols: '',
    social_hierarchy_mobility: '',
    social_demographics_scope: '',
    social_demographics_root: '',
    social_demographics_conflict: '',
    social_family_type: '',
    social_family_relations: '',
    social_family_assets: '',
    social_family_rules: '',
    social_family_external: '',

    // Core
    core_power_cause: '',
    core_power_form: '',
    core_power_source: '',
    core_power_advance: '',
    core_power_conditions: '',
    core_marriage_scope: '',
    core_marriage_purpose: '',
    core_marriage_status: '',
    core_marriage_legitimacy: '',
    core_marriage_name: '',
    core_marriage_divorce: '',

    // Operation
    op_economy_scope: '',
    op_economy_framework: '',
    op_economy_income: '',
    op_economy_dist: '',
    op_economy_wealth: '',
    op_economy_relief: '',
    op_economy_conflict: '',
    op_healthcare_scope: '',
    op_healthcare_lifespan: '',
    op_healthcare_status: '',
    op_healthcare_disease: '',
    op_healthcare_methods: '',
    op_healthcare_records: '',
    op_education_system: '',
    op_education_age: '',
    op_education_access: '',
    op_education_banned: '',
    op_transport_vehicles: '',
    op_transport_info: '',
    op_transport_cargo: '',
    op_authority_agency: '',
    op_authority_rules: '',
    op_authority_tax: '',
    op_authority_resources: '',
    op_authority_currency: '',
    op_authority_property: '',
    op_authority_illegal: '',
    op_etiquette_scope: '',
    op_etiquette_chat: '',
    op_etiquette_habits: '',
    op_etiquette_titles: '',
    op_etiquette_venues: '',
    op_etiquette_gestures: '',

    // Culture
    culture_arts_standards: '',
    culture_arts_forms: '',
    culture_arts_purpose: '',
    culture_arts_status: '',
    culture_arts_value: '',
    culture_history_scope: '',
    culture_history_classics: '',
    culture_history_fusion: '',
    culture_history_tech: '',
    culture_games_info: '',
    culture_games_meaning: '',
    culture_games_nature: '',
    culture_games_items: '',
    culture_games_rules: '',
    culture_games_judgement: '',
    culture_games_exit: '',
    culture_play_identity: '',
    culture_play_limits: '',
    culture_play_risks: '',
    culture_play_punish: '',

    // Special
    special_buildings_scope: '',
    special_buildings_info: '',
    special_buildings_material: '',
    special_buildings_function: '',
    special_buildings_unique: '',
    special_buildings_entry: '',
    special_buildings_physics: '',
    special_buildings_blueprints: '',
    special_buildings_annex: '',
    special_map_scope: '',
    special_map_elements: '',
    special_map_landmarks: '',
    special_map_conditions: '',

    // History
    history_wars_factions: '',
    history_wars_scale: '',
    history_wars_stats: '',
    history_wars_result: '',
    history_wars_pows: '',
    history_wars_map: '',
    history_wars_history: '',
    history_timeline_scope: '',
    history_timeline_method: '',
    history_timeline_events: '',
    history_plot_outline: '',
    history_plot_chapters: '',
    history_deduction: ''
  });

  const [characters, setCharacters] = useState<Character[]>([]);

  const renderContent = () => {
    switch (mode) {
      case AppMode.WORLD_BUILDING:
        return <WorldBuilder data={worldData} onChange={setWorldData} />;
      case AppMode.CHARACTER_DESIGN:
        return <CharacterBuilder characters={characters} onUpdate={setCharacters} />;
      case AppMode.STORY_PLAY:
        return <StoryPlay world={worldData} characters={characters} />;
      default:
        return null;
    }
  };

  return (
    // The outer div handles the dark class via useEffect on document, but we also apply classes here for the main container
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300
      bg-slate-50 text-slate-800 selection:bg-bamboo-green selection:text-white
      dark:bg-[#020617] dark:text-slate-200 dark:selection:bg-ethereal-purple
    `}>
      {/* Header Navigation */}
      <header className={`
        backdrop-blur-md border-b sticky top-0 z-50 transition-colors duration-300
        bg-white/80 border-slate-200
        dark:bg-[#0f172a]/80 dark:border-slate-800
      `}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <div className={`
              p-2 rounded-lg shadow-lg transition-colors duration-300
              bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20 text-white
              dark:bg-gradient-to-br dark:from-indigo-500 dark:to-purple-600 dark:shadow-indigo-500/20
            `}>
              <BookOpenCheck size={24} />
            </div>
            {/* Logo Text */}
            <h1 className="text-xl font-serif font-bold tracking-wide transition-colors duration-300 text-sage-text dark:text-white">
              昱昱的剧本生成器 
              <span className={`
                text-xs font-sans font-normal ml-2 border px-2 py-0.5 rounded-full transition-colors duration-300
                text-slate-500 border-slate-300
                dark:text-slate-500 dark:border-slate-700
              `}>Alpha</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <nav className={`
              flex items-center gap-1 p-1 rounded-xl border transition-colors duration-300
              bg-slate-100 border-slate-200
              dark:bg-slate-900/50 dark:border-slate-800
            `}>
              {[
                { id: AppMode.WORLD_BUILDING, label: '世界观 (World)', icon: Globe },
                { id: AppMode.CHARACTER_DESIGN, label: '人设 (Characters)', icon: Users },
                { id: AppMode.STORY_PLAY, label: '故事生成 (Play)', icon: BookOpenCheck },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setMode(item.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${mode === item.id 
                      ? 'bg-white text-bamboo-green shadow-sm ring-1 ring-slate-200 dark:bg-slate-700 dark:text-white dark:ring-0 dark:shadow-none' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  <item.icon size={16} /> <span className="hidden md:inline">{item.label}</span>
                </button>
              ))}
            </nav>
            
            {/* Trigram Toggle Button */}
            <button 
              onClick={toggleTheme}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300
                hover:scale-105 active:scale-95
                bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm
                dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700
              `}
              title={theme === 'dark' ? "Switch to Day Mode" : "Switch to Night Mode"}
            >
              <TrigramIcon type={theme === 'dark' ? 'qian' : 'kun'} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-hidden">
        {renderContent()}
      </main>

    </div>
  );
};

// Custom SVG Component for Trigrams
// Qian (Heaven/Day) = 3 Solid Lines
// Kun (Earth/Night) = 3 Broken Lines
const TrigramIcon = ({ type }: { type: 'qian' | 'kun' }) => {
  if (type === 'qian') {
    // Qian (Show in Dark mode to switch to Light)
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
         <rect x="2" y="5" width="20" height="3" rx="0.5" />
         <rect x="2" y="10.5" width="20" height="3" rx="0.5" />
         <rect x="2" y="16" width="20" height="3" rx="0.5" />
      </svg>
    );
  } else {
    // Kun (Show in Light mode to switch to Dark)
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
         {/* Top Line Broken */}
         <rect x="2" y="5" width="8" height="3" rx="0.5" />
         <rect x="14" y="5" width="8" height="3" rx="0.5" />
         
         {/* Middle Line Broken */}
         <rect x="2" y="10.5" width="8" height="3" rx="0.5" />
         <rect x="14" y="10.5" width="8" height="3" rx="0.5" />
         
         {/* Bottom Line Broken */}
         <rect x="2" y="16" width="8" height="3" rx="0.5" />
         <rect x="14" y="16" width="8" height="3" rx="0.5" />
      </svg>
    );
  }
};

export default App;