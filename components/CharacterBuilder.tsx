import React, { useState, useRef } from 'react';
import { Character } from '../types';
import { 
  User, Plus, Trash2, Edit3, Shield, Star, Smile, 
  Heart, Briefcase, Coffee, Sword, Coins, Box, History,
  MapPin, Flag, Zap, Feather, Download, Upload
} from 'lucide-react';

interface CharacterBuilderProps {
  characters: Character[];
  onUpdate: (characters: Character[]) => void;
}

type Section = 
  'basic' | 'personality' | 'psychology' | 'appearance' | 
  'childhood' | 'environment' | 'goals' | 'social' | 
  'leisure' | 'work' | 'emotion' | 'romance_interact' | 
  'romance_conflict' | 'combat' | 'business' | 'companion' | 'items';

export const CharacterBuilder: React.FC<CharacterBuilderProps> = ({ characters, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('basic');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addCharacter = () => {
    if (characters.length >= 10) return;
    const newChar: Character = {
      id: crypto.randomUUID(),
      name: `Character ${characters.length + 1}`,
      // Init all fields to empty string to avoid undefined errors
      basic_info: '', basic_specials: '', basic_identity: '', basic_relations: '', basic_death: '',
      pers_type: '', pers_outer: '', pers_inner: '',
      psy_emotion: '', psy_reaction: '', psy_worship: '', psy_influence: '', psy_triggers: '', psy_inner_view: '', psy_stability: '',
      app_features: '', app_clothing: '', app_items: '', app_details: '',
      child_env: '', child_changes: '', child_family: '', child_influence: '', child_status: '', child_memory: '',
      env_birth: '', env_location: '', env_multi: '', env_pref: '',
      goal_life: '', goal_cost: '', goal_obstacle: '', goal_others: '', goal_result: '', goal_regret: '', goal_doomsday: '',
      soc_map: '', soc_stance: '', soc_group: '', soc_boundary: '', soc_raising: '', soc_bond: '', soc_betrayal: '',
      lei_attr: '', lei_status: '', lei_action: '', lei_space: '', lei_skills: '', lei_interruption: '', lei_routine: '',
      work_basis: '', work_attitude: '', work_norms: '', work_problem: '', work_impression: '', work_habits: '', work_special: '', work_security: '',
      emo_concept: '', emo_orientation: '', emo_pref: '', emo_values: '', emo_impact: '', emo_family: '', emo_conflict: '', emo_status: '',
      rom_stage: '', rom_basis: '', rom_understanding: '', rom_attraction: '', rom_confusion: '', rom_exp: '', rom_token: '',
      rom_freq: '', rom_secrets: '', rom_solve: '', rom_hardship: '', rom_compete: '', rom_entangle: '', rom_multi: '',
      com_alliance: '', com_join: '', com_demands: '', com_risk: '', com_role: '', com_change: '', com_conflict: '', com_profile: '',
      bus_origin: '', bus_model: '', bus_method: '', bus_condition: '', bus_risk: '', bus_revenue: '', bus_plan: '', bus_partners: '',
      cmp_info: '', cmp_affiliation: '', cmp_ability: '', cmp_item: '', cmp_likes: '', cmp_form: '', cmp_rarity: '', cmp_get: '', cmp_interaction: '', cmp_attitude: '', cmp_past: '',
      itm_list: '', itm_special: '', itm_detail: '', itm_limit: '', itm_memory: '', itm_legend: '', itm_legend_detail: '', itm_legend_prop: '', itm_bag: ''
    };
    onUpdate([...characters, newChar]);
    setEditingId(newChar.id);
  };

  const removeCharacter = (id: string) => {
    onUpdate(characters.filter(c => c.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const updateCharacter = (id: string, field: keyof Character, value: string) => {
    onUpdate(characters.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleExportCharacter = (char: Character) => {
    const dataStr = JSON.stringify(char, null, 2);
    // Use character name for filename, sanitize it
    const safeName = (char.basic_info?.split(' ')[0] || char.name || 'character').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeName}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    if (characters.length >= 10) {
      alert("角色列表已满（最多10个）。请先删除部分角色再导入。");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const importedChar = JSON.parse(result) as Character;
        
        // Validation: check for ID or name
        if (!importedChar.id && !importedChar.name) {
             throw new Error("Invalid character file");
        }

        // Generate a new ID to avoid collisions, even if it's the same character being re-imported
        const newCharWithId = {
          ...importedChar,
          id: crypto.randomUUID(),
          name: importedChar.name || `Imported Character`
        };

        onUpdate([...characters, newCharWithId]);
        setEditingId(newCharWithId.id);
        alert("角色导入成功！已添加到列表。");

      } catch (err) {
        console.error("Import failed", err);
        alert("导入失败：文件损坏或格式不正确。");
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const activeChar = characters.find(c => c.id === editingId);

  const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'basic', label: '1. 基础信息', icon: <User size={16} /> },
    { id: 'personality', label: '2. 性格设定', icon: <Smile size={16} /> },
    { id: 'psychology', label: '3. 内心侧写', icon: <Shield size={16} /> },
    { id: 'appearance', label: '4. 形象设定', icon: <Star size={16} /> },
    { id: 'childhood', label: '5. 童年经历', icon: <History size={16} /> },
    { id: 'environment', label: '6. 环境影响', icon: <MapPin size={16} /> },
    { id: 'goals', label: '7. 目标与遗憾', icon: <Flag size={16} /> },
    { id: 'social', label: '8. 社交关系', icon: <User size={16} /> },
    { id: 'leisure', label: '9. 休闲时光', icon: <Coffee size={16} /> },
    { id: 'work', label: '10. 工作与生活', icon: <Briefcase size={16} /> },
    { id: 'emotion', label: '11. 情感状态', icon: <Heart size={16} /> },
    { id: 'romance_interact', label: '12. 恋爱相处', icon: <Heart size={16} className="text-pink-400" /> },
    { id: 'romance_conflict', label: '13. 恋爱之矛盾', icon: <Heart size={16} className="text-red-500" /> },
    { id: 'combat', label: '14. 战斗与联盟', icon: <Sword size={16} /> },
    { id: 'business', label: '15. 商业风云', icon: <Coins size={16} /> },
    { id: 'companion', label: '16. 特殊伙伴', icon: <Zap size={16} /> },
    { id: 'items', label: '17. 物品相关', icon: <Box size={16} /> },
  ];

  const renderSectionFields = () => {
    if (!activeChar) return null;

    switch (activeSection) {
      case 'basic':
        return (
          <>
            <InputField label="核心信息" subtext="姓名、编号、性别、身高、年龄等" value={activeChar.basic_info} onChange={(v) => updateCharacter(activeChar.id, 'basic_info', v)} />
            <InputField label="特殊属性" subtext="特殊血液、身体特征" value={activeChar.basic_specials} onChange={(v) => updateCharacter(activeChar.id, 'basic_specials', v)} />
            <InputField label="身份相关" subtext="职业、隐藏身份、教育状况、信仰" value={activeChar.basic_identity} onChange={(v) => updateCharacter(activeChar.id, 'basic_identity', v)} />
            <InputField label="关联信息" subtext="亲密关系、子女情况、癖好、在意的人等" value={activeChar.basic_relations} onChange={(v) => updateCharacter(activeChar.id, 'basic_relations', v)} />
            <InputField label="死亡状态" subtext="死亡时间、地点、原因 (如适用)" value={activeChar.basic_death} onChange={(v) => updateCharacter(activeChar.id, 'basic_death', v)} />
          </>
        );
      case 'personality':
        return (
          <>
            <InputField label="性格定位" subtext="内向/外向坐标轴分布 (早期/晚期、外显/隐性)" value={activeChar.pers_type} onChange={(v) => updateCharacter(activeChar.id, 'pers_type', v)} />
            <InputField label="外显性格" subtext="正向、中性、负向特质" value={activeChar.pers_outer} onChange={(v) => updateCharacter(activeChar.id, 'pers_outer', v)} />
            <InputField label="隐性性格" subtext="正向、中性、负向特质" value={activeChar.pers_inner} onChange={(v) => updateCharacter(activeChar.id, 'pers_inner', v)} />
          </>
        );
      case 'psychology':
        return (
          <>
             <InputField label="情绪状态" subtext="积极、平和、消极、极端" value={activeChar.psy_emotion} onChange={(v) => updateCharacter(activeChar.id, 'psy_emotion', v)} />
             <InputField label="场景反应" subtext="人群聚会、独处时的表现" value={activeChar.psy_reaction} onChange={(v) => updateCharacter(activeChar.id, 'psy_reaction', v)} />
             <InputField label="崇拜与模仿" subtext="是否有崇拜对象及模仿行为" value={activeChar.psy_worship} onChange={(v) => updateCharacter(activeChar.id, 'psy_worship', v)} />
             <InputField label="人际影响" subtext="性格引发的特殊事件及后续转变" value={activeChar.psy_influence} onChange={(v) => updateCharacter(activeChar.id, 'psy_influence', v)} />
             <InputField label="极致情绪触发" subtext="愉悦、厌恶、绝望的触发点" value={activeChar.psy_triggers} onChange={(v) => updateCharacter(activeChar.id, 'psy_triggers', v)} />
             <InputField label="内心视界" subtext="关键片段/场景" value={activeChar.psy_inner_view} onChange={(v) => updateCharacter(activeChar.id, 'psy_inner_view', v)} />
             <InputField label="稳定性评估" subtext="安全等级、危险原因、监管情况、危险指数" value={activeChar.psy_stability} onChange={(v) => updateCharacter(activeChar.id, 'psy_stability', v)} />
          </>
        );
      case 'appearance':
        return (
          <>
             <InputField label="外貌特征" subtext="发型、面部、体型体态" value={activeChar.app_features} onChange={(v) => updateCharacter(activeChar.id, 'app_features', v)} />
             <InputField label="常用表情与着装" subtext="最常露出表情、常穿衣物、特定场合穿着" value={activeChar.app_clothing} onChange={(v) => updateCharacter(activeChar.id, 'app_clothing', v)} />
             <InputField label="随身物品" subtext="有意义物品的来历、赠送者及关系" value={activeChar.app_items} onChange={(v) => updateCharacter(activeChar.id, 'app_items', v)} />
             <InputField label="穿着细节" subtext="个人特色小细节" value={activeChar.app_details} onChange={(v) => updateCharacter(activeChar.id, 'app_details', v)} />
          </>
        );
      case 'childhood':
        return (
          <>
             <InputField label="成长环境" subtext="原生/非原生/非家庭环境、养育者、氛围" value={activeChar.child_env} onChange={(v) => updateCharacter(activeChar.id, 'child_env', v)} />
             <InputField label="环境变化" subtext="社会层级、贫富状况、养育者变化" value={activeChar.child_changes} onChange={(v) => updateCharacter(activeChar.id, 'child_changes', v)} />
             <InputField label="家庭关系" subtext="父母关系、兄弟姐妹情况" value={activeChar.child_family} onChange={(v) => updateCharacter(activeChar.id, 'child_family', v)} />
             <InputField label="关键影响" subtext="影响最深的人及影响内容" value={activeChar.child_influence} onChange={(v) => updateCharacter(activeChar.id, 'child_influence', v)} />
             <InputField label="成长状态" subtext="是否被爱、财富情况、可储财产" value={activeChar.child_status} onChange={(v) => updateCharacter(activeChar.id, 'child_status', v)} />
             <InputField label="难忘往事" subtext="童年关键记忆" value={activeChar.child_memory} onChange={(v) => updateCharacter(activeChar.id, 'child_memory', v)} />
          </>
        );
      case 'environment':
        return (
          <>
             <InputField label="出生地影响" subtext="对行为习惯、想法的影响" value={activeChar.env_birth} onChange={(v) => updateCharacter(activeChar.id, 'env_birth', v)} />
             <InputField label="地域关联" subtext="是否在成长地、特殊感受的场合/地点" value={activeChar.env_location} onChange={(v) => updateCharacter(activeChar.id, 'env_location', v)} />
             <InputField label="多环境影响" subtext="学习、工作、其他环境的具体影响" value={activeChar.env_multi} onChange={(v) => updateCharacter(activeChar.id, 'env_multi', v)} />
             <InputField label="环境偏好" subtext="最希望的生活环境、厌恶的场合" value={activeChar.env_pref} onChange={(v) => updateCharacter(activeChar.id, 'env_pref', v)} />
          </>
        );
      case 'goals':
        return (
          <>
             <InputField label="人生目标" subtext="权利、金钱、感情等方向及具体描述" value={activeChar.goal_life} onChange={(v) => updateCharacter(activeChar.id, 'goal_life', v)} />
             <InputField label="执着程度与付出" subtext="不同执着等级对应的付出意愿" value={activeChar.goal_cost} onChange={(v) => updateCharacter(activeChar.id, 'goal_cost', v)} />
             <InputField label="困境与障碍" subtext="内心挣扎、外在困难及相关人物/组织" value={activeChar.goal_obstacle} onChange={(v) => updateCharacter(activeChar.id, 'goal_obstacle', v)} />
             <InputField label="他人态度" subtext="关键人物对目标的认同与支持情况" value={activeChar.goal_others} onChange={(v) => updateCharacter(activeChar.id, 'goal_others', v)} />
             <InputField label="目标结果应对" subtext="完成/无法完成后的计划" value={activeChar.goal_result} onChange={(v) => updateCharacter(activeChar.id, 'goal_result', v)} />
             <InputField label="结局与遗憾" subtext="既定结局、难以释怀的遗憾及弥补意愿" value={activeChar.goal_regret} onChange={(v) => updateCharacter(activeChar.id, 'goal_regret', v)} />
             <InputField label="末日行动" subtext="世界末日24小时内的行为" value={activeChar.goal_doomsday} onChange={(v) => updateCharacter(activeChar.id, 'goal_doomsday', v)} />
          </>
        );
      case 'social':
        return (
          <>
             <InputField label="关系图谱" subtext="长辈、平辈、晚辈的各类关系 (配偶、敌对、合作等)" value={activeChar.soc_map} onChange={(v) => updateCharacter(activeChar.id, 'soc_map', v)} />
             <InputField label="核心立场" subtext="是否有不可撼动的立场" value={activeChar.soc_stance} onChange={(v) => updateCharacter(activeChar.id, 'soc_stance', v)} />
             <InputField label="团体归属" subtext="所在小组/团体、身份及成员关系" value={activeChar.soc_group} onChange={(v) => updateCharacter(activeChar.id, 'soc_group', v)} />
             <InputField label="人际边界" subtext="对朋友的最大善意、对敌人的最大恶意" value={activeChar.soc_boundary} onChange={(v) => updateCharacter(activeChar.id, 'soc_boundary', v)} />
             <InputField label="养育经历" subtext="是否养育他人及付出情况" value={activeChar.soc_raising} onChange={(v) => updateCharacter(activeChar.id, 'soc_raising', v)} />
             <InputField label="命运羁绊" subtext="是否有强制绑定/世代恩怨等关系" value={activeChar.soc_bond} onChange={(v) => updateCharacter(activeChar.id, 'soc_bond', v)} />
             <InputField label="关键经历" subtext="最大善意事件、背叛经历及后续影响" value={activeChar.soc_betrayal} onChange={(v) => updateCharacter(activeChar.id, 'soc_betrayal', v)} />
          </>
        );
      case 'leisure':
        return (
          <>
             <InputField label="休息属性" subtext="常规/特殊休息日、时间安排" value={activeChar.lei_attr} onChange={(v) => updateCharacter(activeChar.id, 'lei_attr', v)} />
             <InputField label="休息状态" subtext="与日常的差异、不修边幅/精致品质" value={activeChar.lei_status} onChange={(v) => updateCharacter(activeChar.id, 'lei_status', v)} />
             <InputField label="休闲行为" subtext="喜欢做的事、常待的地方、休息着装" value={activeChar.lei_action} onChange={(v) => updateCharacter(activeChar.id, 'lei_action', v)} />
             <InputField label="私人空间" subtext="维护整理情况、特殊物品摆放、他人进入权限" value={activeChar.lei_space} onChange={(v) => updateCharacter(activeChar.id, 'lei_space', v)} />
             <InputField label="生活技能" subtext="是否自己做饭及厨艺水平" value={activeChar.lei_skills} onChange={(v) => updateCharacter(activeChar.id, 'lei_skills', v)} />
             <InputField label="休假干扰" subtext="工作信息打扰的处理及是否中断休假" value={activeChar.lei_interruption} onChange={(v) => updateCharacter(activeChar.id, 'lei_interruption', v)} />
             <InputField label="行程结束" subtext="当日结束方式、不为人知的行动" value={activeChar.lei_routine} onChange={(v) => updateCharacter(activeChar.id, 'lei_routine', v)} />
          </>
        );
      case 'work':
        return (
          <>
             <InputField label="工作基础" subtext="工作内容、身份证明 (工牌、令牌等)" value={activeChar.work_basis} onChange={(v) => updateCharacter(activeChar.id, 'work_basis', v)} />
             <InputField label="工作态度" subtext="认真/消极怠工及对应策略" value={activeChar.work_attitude} onChange={(v) => updateCharacter(activeChar.id, 'work_attitude', v)} />
             <InputField label="工作规范" subtext="稳定时段、着装风格、合作偏好 (团队/独立)" value={activeChar.work_norms} onChange={(v) => updateCharacter(activeChar.id, 'work_norms', v)} />
             <InputField label="问题处理" subtext="工作麻烦的应对方式" value={activeChar.work_problem} onChange={(v) => updateCharacter(activeChar.id, 'work_problem', v)} />
             <InputField label="他人印象" subtext="领导、对手、下属对角色的评价" value={activeChar.work_impression} onChange={(v) => updateCharacter(activeChar.id, 'work_impression', v)} />
             <InputField label="工作习惯" subtext="个人习惯、口头禅、私人问题处理方式" value={activeChar.work_habits} onChange={(v) => updateCharacter(activeChar.id, 'work_habits', v)} />
             <InputField label="特殊工作情况" subtext="隐藏身份/多职业、工作场合特殊物品及处理" value={activeChar.work_special} onChange={(v) => updateCharacter(activeChar.id, 'work_special', v)} />
             <InputField label="工作保障" subtext="工作餐解决方式、常喝饮料" value={activeChar.work_security} onChange={(v) => updateCharacter(activeChar.id, 'work_security', v)} />
          </>
        );
      case 'emotion':
        return (
          <>
             <InputField label="爱情观念" subtext="独身主义、体验导向、结果导向等" value={activeChar.emo_concept} onChange={(v) => updateCharacter(activeChar.id, 'emo_concept', v)} />
             <InputField label="情感取向" subtext="无特定取向、无爱、特定人/特征取向" value={activeChar.emo_orientation} onChange={(v) => updateCharacter(activeChar.id, 'emo_orientation', v)} />
             <InputField label="选择偏好" subtext="客观条件、精神共鸣、物质与精神平衡等" value={activeChar.emo_pref} onChange={(v) => updateCharacter(activeChar.id, 'emo_pref', v)} />
             <InputField label="关系倾向" subtext="自我保护、勇于付出" value={activeChar.emo_values} onChange={(v) => updateCharacter(activeChar.id, 'emo_values', v)} />
             <InputField label="观念影响" subtext="对人生选择的影响及是否会变化" value={activeChar.emo_impact} onChange={(v) => updateCharacter(activeChar.id, 'emo_impact', v)} />
             <InputField label="婚姻与子女" subtext="婚姻观念、婚姻对象关系、对子女/后裔的态度" value={activeChar.emo_family} onChange={(v) => updateCharacter(activeChar.id, 'emo_family', v)} />
             <InputField label="情感矛盾" subtext="婚姻与情感是否违背及具体影响" value={activeChar.emo_conflict} onChange={(v) => updateCharacter(activeChar.id, 'emo_conflict', v)} />
             <InputField label="当前状态" subtext="单身、暗恋、热恋等及相关对象信息" value={activeChar.emo_status} onChange={(v) => updateCharacter(activeChar.id, 'emo_status', v)} />
          </>
        );
      case 'romance_interact':
        return (
          <>
             <InputField label="恋爱阶段" subtext="所处阶段/年龄、恋爱状态 (热恋、暧昧等)" value={activeChar.rom_stage} onChange={(v) => updateCharacter(activeChar.id, 'rom_stage', v)} />
             <InputField label="相识基础" subtext="初识关系、场景、告白情况及结果" value={activeChar.rom_basis} onChange={(v) => updateCharacter(activeChar.id, 'rom_basis', v)} />
             <InputField label="相互了解" subtext="双方对彼此的了解程度" value={activeChar.rom_understanding} onChange={(v) => updateCharacter(activeChar.id, 'rom_understanding', v)} />
             <InputField label="吸引特质" subtext="对方最吸引角色的具体特质" value={activeChar.rom_attraction} onChange={(v) => updateCharacter(activeChar.id, 'rom_attraction', v)} />
             <InputField label="相互观感" subtext="当前态度及未来是否会改变" value={activeChar.rom_confusion} onChange={(v) => updateCharacter(activeChar.id, 'rom_confusion', v)} />
             <InputField label="关键经历" subtext="甜蜜/冲突等特殊感情经历" value={activeChar.rom_exp} onChange={(v) => updateCharacter(activeChar.id, 'rom_exp', v)} />
             <InputField label="信物交换" subtext="是否有交换信物" value={activeChar.rom_token} onChange={(v) => updateCharacter(activeChar.id, 'rom_token', v)} />
          </>
        );
      case 'romance_conflict':
        return (
          <>
             <InputField label="相处频率" subtext="每天、偶尔、异地恋等具体情况" value={activeChar.rom_freq} onChange={(v) => updateCharacter(activeChar.id, 'rom_freq', v)} />
             <InputField label="隐瞒与误会" subtext="相互隐瞒的事情、理由及潜在恶果" value={activeChar.rom_secrets} onChange={(v) => updateCharacter(activeChar.id, 'rom_secrets', v)} />
             <InputField label="矛盾解决" subtext="理智商谈、争吵、冷战等方式" value={activeChar.rom_solve} onChange={(v) => updateCharacter(activeChar.id, 'rom_solve', v)} />
             <InputField label="重大问题应对" subtext="谁更容易放弃、共渡难关的经历" value={activeChar.rom_hardship} onChange={(v) => updateCharacter(activeChar.id, 'rom_hardship', v)} />
             <InputField label="外部竞争" subtext="情敌/竞争者情况及优势" value={activeChar.rom_compete} onChange={(v) => updateCharacter(activeChar.id, 'rom_compete', v)} />
             <InputField label="情感羁绊" subtext="难以忘怀的人及对当前关系的影响" value={activeChar.rom_entangle} onChange={(v) => updateCharacter(activeChar.id, 'rom_entangle', v)} />
             <InputField label="多恋关系" subtext="是否有多个恋人及关系情况" value={activeChar.rom_multi} onChange={(v) => updateCharacter(activeChar.id, 'rom_multi', v)} />
          </>
        );
      case 'combat':
        return (
          <>
             <InputField label="联盟归属" subtext="是否属于战斗联盟及联盟名称" value={activeChar.com_alliance} onChange={(v) => updateCharacter(activeChar.id, 'com_alliance', v)} />
             <InputField label="加入机缘" subtext="出生即加入、能力觉醒、招募等原因及细节" value={activeChar.com_join} onChange={(v) => updateCharacter(activeChar.id, 'com_join', v)} />
             <InputField label="联盟诉求" subtext="获取安全、关注、资源、能力提升等目标" value={activeChar.com_demands} onChange={(v) => updateCharacter(activeChar.id, 'com_demands', v)} />
             <InputField label="承担风险" subtext="能力提升、任务执行、心理压力等风险及具体描述" value={activeChar.com_risk} onChange={(v) => updateCharacter(activeChar.id, 'com_risk', v)} />
             <InputField label="联盟角色" subtext="边缘人物、正式成员、核心成员等身份" value={activeChar.com_role} onChange={(v) => updateCharacter(activeChar.id, 'com_role', v)} />
             <InputField label="联盟变动" subtext="是否脱离联盟及脱离情况、后续处境" value={activeChar.com_change} onChange={(v) => updateCharacter(activeChar.id, 'com_change', v)} />
             <InputField label="潜在矛盾" subtext="联盟与角色的愿景、发展、信条等冲突" value={activeChar.com_conflict} onChange={(v) => updateCharacter(activeChar.id, 'com_conflict', v)} />
             <InputField label="能力档案" subtext="战斗特征、能力评级、特殊能力倾向及进阶方式" value={activeChar.com_profile} onChange={(v) => updateCharacter(activeChar.id, 'com_profile', v)} />
          </>
        );
      case 'business':
        return (
          <>
             <InputField label="经商起因" subtext="家族传承、谋生计、发现商机等" value={activeChar.bus_origin} onChange={(v) => updateCharacter(activeChar.id, 'bus_origin', v)} />
             <InputField label="生意模式" subtext="零售、大宗倒卖、服务、单项任务等" value={activeChar.bus_model} onChange={(v) => updateCharacter(activeChar.id, 'bus_model', v)} />
             <InputField label="商业手段" subtext="初期想法、占领先机的方式" value={activeChar.bus_method} onChange={(v) => updateCharacter(activeChar.id, 'bus_method', v)} />
             <InputField label="自身条件" subtext="血统、灵根等及是否受差别对待" value={activeChar.bus_condition} onChange={(v) => updateCharacter(activeChar.id, 'bus_condition', v)} />
             <InputField label="商业危机" subtext="资金危机、口碑危机的情况及应对" value={activeChar.bus_risk} onChange={(v) => updateCharacter(activeChar.id, 'bus_risk', v)} />
             <InputField label="商业收获" subtext="金钱、资源等人脉及是否为稳定收益" value={activeChar.bus_revenue} onChange={(v) => updateCharacter(activeChar.id, 'bus_revenue', v)} />
             <InputField label="资产规划" subtext="积累资产后的用途" value={activeChar.bus_plan} onChange={(v) => updateCharacter(activeChar.id, 'bus_plan', v)} />
             <InputField label="目标与伙伴" subtext="商业目标完成情况、昔日伙伴是否仍在" value={activeChar.bus_partners} onChange={(v) => updateCharacter(activeChar.id, 'bus_partners', v)} />
          </>
        );
      case 'companion':
        return (
          <>
             <InputField label="基础信息" subtext="名字、族群、生日/年龄、性格、心灵创伤" value={activeChar.cmp_info} onChange={(v) => updateCharacter(activeChar.id, 'cmp_info', v)} />
             <InputField label="归属关系" subtext="无主、契约关系、有主" value={activeChar.cmp_affiliation} onChange={(v) => updateCharacter(activeChar.id, 'cmp_affiliation', v)} />
             <InputField label="属性能力" subtext="战斗型、辅助型、家政型等特殊能力" value={activeChar.cmp_ability} onChange={(v) => updateCharacter(activeChar.id, 'cmp_ability', v)} />
             <InputField label="专属物品" subtext="是否有特殊道具/武器等" value={activeChar.cmp_item} onChange={(v) => updateCharacter(activeChar.id, 'cmp_item', v)} />
             <InputField label="喜恶偏好" subtext="喜欢与讨厌的东西" value={activeChar.cmp_likes} onChange={(v) => updateCharacter(activeChar.id, 'cmp_likes', v)} />
             <InputField label="形态变化" subtext="是否会化人形、进化及触发条件" value={activeChar.cmp_form} onChange={(v) => updateCharacter(activeChar.id, 'cmp_form', v)} />
             <InputField label="稀有程度" subtext="普通、进化、变异、仅此一个等" value={activeChar.cmp_rarity} onChange={(v) => updateCharacter(activeChar.id, 'cmp_rarity', v)} />
             <InputField label="拥有方式" subtext="继承、意外获得、购买等具体途径" value={activeChar.cmp_get} onChange={(v) => updateCharacter(activeChar.id, 'cmp_get', v)} />
             <InputField label="相处状态" subtext="相伴时长、对主人心态、忠诚度、背叛条件" value={activeChar.cmp_interaction} onChange={(v) => updateCharacter(activeChar.id, 'cmp_interaction', v)} />
             <InputField label="主人态度" subtext="恶劣、冷漠、普通、喜爱、密不可分" value={activeChar.cmp_attitude} onChange={(v) => updateCharacter(activeChar.id, 'cmp_attitude', v)} />
             <InputField label="过往经历" subtext="之前是否有饲主/所有者" value={activeChar.cmp_past} onChange={(v) => updateCharacter(activeChar.id, 'cmp_past', v)} />
          </>
        );
      case 'items':
        return (
          <>
             <InputField label="普通物品清单" subtext="名称、属性、星级" value={activeChar.itm_list} onChange={(v) => updateCharacter(activeChar.id, 'itm_list', v)} />
             <InputField label="特殊物品" subtext="名称、所有者、材质、产地、制造方" value={activeChar.itm_special} onChange={(v) => updateCharacter(activeChar.id, 'itm_special', v)} />
             <InputField label="特殊物品详情" subtext="功能、特殊能力、状态、组合使用、升级改进" value={activeChar.itm_detail} onChange={(v) => updateCharacter(activeChar.id, 'itm_detail', v)} />
             <InputField label="特殊物品限制" subtext="使用次数、时效等限制" value={activeChar.itm_limit} onChange={(v) => updateCharacter(activeChar.id, 'itm_limit', v)} />
             <InputField label="特殊物品记忆" subtext="来历、保存原因等" value={activeChar.itm_memory} onChange={(v) => updateCharacter(activeChar.id, 'itm_memory', v)} />
             <InputField label="传奇物品" subtext="编号、成为传奇的原因、属性/材质、现世地点" value={activeChar.itm_legend} onChange={(v) => updateCharacter(activeChar.id, 'itm_legend', v)} />
             <InputField label="传奇物品详情" subtext="创造者、使用限制、存在意义、获得方式" value={activeChar.itm_legend_detail} onChange={(v) => updateCharacter(activeChar.id, 'itm_legend_detail', v)} />
             <InputField label="传奇物品特殊属性" subtext="特殊能力、寄宿意志、结合要求、升级情况" value={activeChar.itm_legend_prop} onChange={(v) => updateCharacter(activeChar.id, 'itm_legend_prop', v)} />
             <InputField label="背包与携带" subtext="携带能力范围、携带物品清单" value={activeChar.itm_bag} onChange={(v) => updateCharacter(activeChar.id, 'itm_bag', v)} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto p-4 gap-6">
      
      <div className="text-center mb-2">
         <h2 className="text-3xl font-serif font-bold text-sage-text dark:text-mystic-gold transition-colors duration-300">人设档案 (Character Archives)</h2>
         <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">Create up to 10 unique entities. {characters.length}/10</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
        
        {/* COLUMN 1: Character List Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className={`
            border rounded-xl p-4 overflow-y-auto max-h-[calc(100%-80px)] mb-4 transition-colors duration-300
            bg-white/50 border-slate-200
            dark:bg-slate-900/50 dark:border-slate-700
          `}>
            <button
              onClick={addCharacter}
              disabled={characters.length >= 10}
              className={`w-full py-3 mb-4 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all shadow-md ${
                characters.length >= 10 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500' 
                : 'bg-bamboo-green hover:bg-emerald-600 shadow-emerald-500/20 text-white dark:bg-ethereal-purple dark:hover:bg-indigo-600 dark:shadow-indigo-500/20'
              }`}
            >
              <Plus size={18} /> 新建角色
            </button>
            
            <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleFileChange} 
               accept=".json" 
               className="hidden" 
            />
            <button
              onClick={handleImportClick}
              disabled={characters.length >= 10}
              className={`
                w-full py-2 mb-4 rounded-lg flex items-center justify-center gap-2 text-sm border transition-colors
                bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100
                dark:bg-transparent dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300
              `}
            >
              <Upload size={14} /> 导入角色 (Import)
            </button>

            <div className="space-y-3">
              {characters.map(char => (
                <div 
                  key={char.id}
                  onClick={() => setEditingId(char.id)}
                  className={`
                    p-3 rounded-lg cursor-pointer border transition-all flex justify-between items-center group relative shadow-sm
                    ${editingId === char.id 
                    ? 'bg-emerald-50 border-bamboo-green dark:bg-indigo-900/30 dark:border-ethereal-purple' 
                    : 'bg-white border-transparent hover:bg-slate-50 hover:shadow-md dark:bg-slate-800/50 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors
                      ${editingId === char.id ? 'bg-bamboo-green text-white dark:bg-ethereal-purple' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300'}
                    `}>
                      <User size={16} />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className={`font-bold text-sm truncate transition-colors ${editingId === char.id ? 'text-sage-text dark:text-slate-200' : 'text-slate-700 dark:text-slate-300'}`}>
                        {char.basic_info ? char.basic_info.split(' ')[0].substring(0, 10) : char.name}
                      </h3>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeCharacter(char.id); }}
                    className="absolute right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: Section Navigation (Only visible if a character is selected) */}
        {activeChar && (
          <div className={`
            w-full lg:w-60 flex-shrink-0 border rounded-xl p-2 overflow-y-auto custom-scrollbar transition-colors duration-300
            bg-white/30 border-slate-200
            dark:bg-slate-900/30 dark:border-slate-700
          `}>
             {sections.map(section => (
               <button
                 key={section.id}
                 onClick={() => setActiveSection(section.id)}
                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 ${
                   activeSection === section.id 
                   ? 'bg-slate-200 text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' 
                   : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800'
                 }`}
               >
                 {section.icon}
                 <span className="truncate">{section.label}</span>
               </button>
             ))}
          </div>
        )}

        {/* COLUMN 3: Edit Form */}
        <div className={`
          flex-1 border rounded-xl p-6 overflow-y-auto shadow-2xl relative transition-colors duration-300
          bg-white/80 border-slate-200
          dark:bg-slate-900/80 dark:border-slate-700
        `}>
          {activeChar ? (
            <div className="space-y-6 animate-fade-in pb-10">
              <div className={`
                flex items-center justify-between border-b pb-2 mb-4 transition-colors
                border-slate-200 dark:border-slate-700
              `}>
                <div className="flex items-center gap-2 text-sage-text dark:text-mystic-gold font-bold text-lg transition-colors">
                  <Edit3 size={20} />
                  <span>
                    {sections.find(s => s.id === activeSection)?.label} — {activeChar.basic_info || activeChar.name}
                  </span>
                </div>
                <button
                  onClick={() => handleExportCharacter(activeChar)}
                  className={`
                    flex items-center gap-2 px-3 py-1 border rounded text-xs transition-colors
                    bg-slate-100 border-slate-300 text-bamboo-green hover:bg-slate-200
                    dark:bg-slate-800 dark:border-slate-600 dark:text-ethereal-purple dark:hover:bg-slate-700
                  `}
                  title="Export this character only"
                >
                  <Download size={12} /> 单体导出 (Export)
                </button>
              </div>
              
              {renderSectionFields()}
              
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
              <User size={64} className="mb-4" />
              <p>Select a character from the left to access their dossier.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, subtext, value, onChange }: { label: string, subtext?: string, value: string, onChange: (v: string) => void }) => (
  <div className="space-y-1">
    <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
       <label className="font-semibold text-sm text-bamboo-green dark:text-ethereal-purple transition-colors duration-300">{label}</label>
       {subtext && <span className="text-xs text-slate-500">({subtext})</span>}
    </div>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full h-20 p-3 rounded-lg border outline-none transition-all resize-none text-sm leading-relaxed
        bg-slate-50 border-slate-300 focus:border-bamboo-green focus:ring-1 focus:ring-bamboo-green text-slate-800
        dark:bg-slate-950 dark:border-slate-700 dark:focus:border-ethereal-purple dark:focus:ring-ethereal-purple dark:text-white
      `}
      placeholder="..."
    />
  </div>
);