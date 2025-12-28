export enum AppMode {
  WORLD_BUILDING = 'WORLD_BUILDING',
  CHARACTER_DESIGN = 'CHARACTER_DESIGN',
  STORY_PLAY = 'STORY_PLAY',
}

export type StoryFormat = 'SHORT_VIDEO' | 'MICRO_FILM' | 'FEATURE_FILM' | 'MICRO_DRAMA' | 'MINI_DRAMA' | 'SEASON_SERIES';

export const STORY_FORMATS: Record<StoryFormat, { label: string; desc: string; device: string }> = {
  SHORT_VIDEO: { label: '短视频 (Short Video)', desc: '< 3分钟 | 碎片化、社交属性', device: 'Mobile' },
  MICRO_FILM: { label: '微电影 (Micro Film)', desc: '3-30分钟 | 广告属性、故事雏形', device: 'Tablet' },
  FEATURE_FILM: { label: '电影长片 (Feature Film)', desc: '> 90分钟 | 视听享受、完整叙事', device: 'Cinema' },
  MICRO_DRAMA: { label: '微短剧 (Micro Drama)', desc: '< 10分钟 | 竖屏为主、强反转', device: 'Laptop' },
  MINI_DRAMA: { label: '迷你剧 (Mini Drama)', desc: '3-8集 (总) | 电影质感、短小精悍', device: 'Desktop' },
  SEASON_SERIES: { label: '长篇连续剧 (Long Series)', desc: '40+集 | 细水长流、日播模式', device: 'TV' },
};

export interface WorldSettings {
  // === 1. 基础设定 (Basic Settings) ===
  basic_name_type: string;
  basic_common_setting: string;
  basic_lifeforms: string;
  basic_legends_scope: string;
  basic_legends_content: string;
  basic_legends_impact_level: string;
  basic_legends_impact_personal: string;
  basic_customs_scope_content: string;
  basic_customs_origin: string;
  basic_customs_impact: string;
  basic_customs_continuity: string;

  // === 2. 社会结构 (Social Structure) ===
  social_factions_scope: string;
  social_factions_info: string;
  social_factions_members: string;
  social_hierarchy_scope: string;
  social_hierarchy_cause: string;
  social_hierarchy_symbols: string;
  social_hierarchy_mobility: string;
  social_demographics_scope: string;
  social_demographics_root: string;
  social_demographics_conflict: string;
  social_family_type: string;
  social_family_relations: string;
  social_family_assets: string;
  social_family_rules: string;
  social_family_external: string;

  // === 3. 核心要素 (Core Elements) ===
  core_power_cause: string;
  core_power_form: string;
  core_power_source: string;
  core_power_advance: string;
  core_power_conditions: string;
  core_marriage_scope: string;
  core_marriage_purpose: string;
  core_marriage_status: string;
  core_marriage_legitimacy: string;
  core_marriage_name: string;
  core_marriage_divorce: string;

  // === 4. 社会运行 (Social Operation) ===
  op_economy_scope: string;
  op_economy_framework: string;
  op_economy_income: string;
  op_economy_dist: string;
  op_economy_wealth: string;
  op_economy_relief: string;
  op_economy_conflict: string;
  op_healthcare_scope: string;
  op_healthcare_lifespan: string;
  op_healthcare_status: string;
  op_healthcare_disease: string;
  op_healthcare_methods: string;
  op_healthcare_records: string;
  op_education_system: string;
  op_education_age: string;
  op_education_access: string;
  op_education_banned: string;
  op_transport_vehicles: string;
  op_transport_info: string;
  op_transport_cargo: string;
  op_authority_agency: string;
  op_authority_rules: string;
  op_authority_tax: string;
  op_authority_resources: string;
  op_authority_currency: string;
  op_authority_property: string;
  op_authority_illegal: string;
  op_etiquette_scope: string;
  op_etiquette_chat: string;
  op_etiquette_habits: string;
  op_etiquette_titles: string;
  op_etiquette_venues: string;
  op_etiquette_gestures: string;

  // === 5. 文化娱乐 (Culture & Entertainment) ===
  culture_arts_standards: string;
  culture_arts_forms: string;
  culture_arts_purpose: string;
  culture_arts_status: string;
  culture_arts_value: string;
  culture_history_scope: string;
  culture_history_classics: string;
  culture_history_fusion: string;
  culture_history_tech: string;
  culture_games_info: string;
  culture_games_meaning: string;
  culture_games_nature: string;
  culture_games_items: string;
  culture_games_rules: string;
  culture_games_judgement: string;
  culture_games_exit: string;
  culture_play_identity: string;
  culture_play_limits: string;
  culture_play_risks: string;
  culture_play_punish: string;

  // === 6. 特殊载体 (Special Carriers) ===
  special_buildings_scope: string;
  special_buildings_info: string;
  special_buildings_material: string;
  special_buildings_function: string;
  special_buildings_unique: string;
  special_buildings_entry: string;
  special_buildings_physics: string;
  special_buildings_blueprints: string;
  special_buildings_annex: string;
  special_map_scope: string;
  special_map_elements: string;
  special_map_landmarks: string;
  special_map_conditions: string;

  // === 7. 历史与剧情 (History & Plot) ===
  history_wars_factions: string;
  history_wars_scale: string;
  history_wars_stats: string;
  history_wars_result: string;
  history_wars_pows: string;
  history_wars_map: string;
  history_wars_history: string;
  history_timeline_scope: string;
  history_timeline_method: string;
  history_timeline_events: string;
  history_plot_outline: string;
  history_plot_chapters: string;
  history_deduction: string;
  
  customTemplate?: string;
}

export interface Character {
  id: string;
  name: string;
  // === 1. 基础信息 (Basic Info) ===
  basic_info: string;
  basic_specials: string;
  basic_identity: string;
  basic_relations: string;
  basic_death: string;

  // === 2. 性格设定 (Personality) ===
  pers_type: string;
  pers_outer: string;
  pers_inner: string;

  // === 3. 内心侧写 (Psychological Profile) ===
  psy_emotion: string;
  psy_reaction: string;
  psy_worship: string;
  psy_influence: string;
  psy_triggers: string;
  psy_inner_view: string;
  psy_stability: string;

  // === 4. 形象设定 (Appearance) ===
  app_features: string;
  app_clothing: string;
  app_items: string;
  app_details: string;

  // === 5. 童年经历 (Childhood) ===
  child_env: string;
  child_changes: string;
  child_family: string;
  child_influence: string;
  child_status: string;
  child_memory: string;

  // === 6. 环境影响 (Environmental Impact) ===
  env_birth: string;
  env_location: string;
  env_multi: string;
  env_pref: string;

  // === 7. 目标与遗憾 (Goals & Regrets) ===
  goal_life: string;
  goal_cost: string;
  goal_obstacle: string;
  goal_others: string;
  goal_result: string;
  goal_regret: string;
  goal_doomsday: string;

  // === 8. 社交关系 (Social Relations) ===
  soc_map: string;
  soc_stance: string;
  soc_group: string;
  soc_boundary: string;
  soc_raising: string;
  soc_bond: string;
  soc_betrayal: string;

  // === 9. 休闲时光 (Leisure) ===
  lei_attr: string;
  lei_status: string;
  lei_action: string;
  lei_space: string;
  lei_skills: string;
  lei_interruption: string;
  lei_routine: string;

  // === 10. 工作与生活 (Work & Life) ===
  work_basis: string;
  work_attitude: string;
  work_norms: string;
  work_problem: string;
  work_impression: string;
  work_habits: string;
  work_special: string;
  work_security: string;

  // === 11. 情感状态 (Emotional Status) ===
  emo_concept: string;
  emo_orientation: string;
  emo_pref: string;
  emo_values: string;
  emo_impact: string;
  emo_family: string;
  emo_conflict: string;
  emo_status: string;

  // === 12. 恋爱相处 (Romantic Interaction) ===
  rom_stage: string;
  rom_basis: string;
  rom_understanding: string;
  rom_attraction: string;
  rom_confusion: string;
  rom_exp: string;
  rom_token: string;

  // === 13. 恋爱之矛盾 (Romantic Conflicts) ===
  rom_freq: string;
  rom_secrets: string;
  rom_solve: string;
  rom_hardship: string;
  rom_compete: string;
  rom_entangle: string;
  rom_multi: string;

  // === 14. 战斗与联盟 (Combat & Alliance) ===
  com_alliance: string;
  com_join: string;
  com_demands: string;
  com_risk: string;
  com_role: string;
  com_change: string;
  com_conflict: string;
  com_profile: string;

  // === 15. 商业风云 (Business) ===
  bus_origin: string;
  bus_model: string;
  bus_method: string;
  bus_condition: string;
  bus_risk: string;
  bus_revenue: string;
  bus_plan: string;
  bus_partners: string;

  // === 16. 特殊伙伴 (Special Companions) ===
  cmp_info: string;
  cmp_affiliation: string;
  cmp_ability: string;
  cmp_item: string;
  cmp_likes: string;
  cmp_form: string;
  cmp_rarity: string;
  cmp_get: string;
  cmp_interaction: string;
  cmp_attitude: string;
  cmp_past: string;

  // === 17. 物品相关 (Items) ===
  itm_list: string;
  itm_special: string;
  itm_detail: string;
  itm_limit: string;
  itm_memory: string;
  itm_legend: string;
  itm_legend_detail: string;
  itm_legend_prop: string;
  itm_bag: string;
  
  customTemplate?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  characterName?: string;
  content: string;
  timestamp: number;
}

export interface GameState {
  stage: 'SELECT_FORMAT' | 'SELECT_CHARACTER' | 'PLAYING';
  selectedFormat: StoryFormat | null;
  selectedCharacterId: string | null;
  history: ChatMessage[];
}