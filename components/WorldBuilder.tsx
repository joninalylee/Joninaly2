import React, { useState, useRef } from 'react';
import { WorldSettings } from '../types';
import { 
  Globe, BookOpen, Scroll, Map as MapIcon, Type, 
  Users, Zap, Activity, PenTool, Castle, Hourglass,
  Download, Upload, FileJson
} from 'lucide-react';

interface WorldBuilderProps {
  data: WorldSettings;
  onChange: (data: WorldSettings) => void;
}

type Section = 'basic' | 'social' | 'core' | 'operation' | 'culture' | 'special' | 'history';

export const WorldBuilder: React.FC<WorldBuilderProps> = ({ data, onChange }) => {
  const [activeSection, setActiveSection] = useState<Section>('basic');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof WorldSettings, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `world_settings_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const importedData = JSON.parse(result) as WorldSettings;
        if ('basic_name_type' in importedData) {
           onChange(importedData);
           alert("世界观数据导入成功！\nWorld data imported successfully.");
        } else {
           alert("文件格式错误：这不是有效的世界观设定文件。\nInvalid file format.");
        }
      } catch (err) {
        console.error("Import failed", err);
        alert("导入失败：文件损坏或格式不正确。");
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'basic', label: '1. 基础设定 (Basic)', icon: <Globe size={18} /> },
    { id: 'social', label: '2. 社会结构 (Social)', icon: <Users size={18} /> },
    { id: 'core', label: '3. 核心要素 (Core)', icon: <Zap size={18} /> },
    { id: 'operation', label: '4. 社会运行 (Operation)', icon: <Activity size={18} /> },
    { id: 'culture', label: '5. 文化娱乐 (Culture)', icon: <PenTool size={18} /> },
    { id: 'special', label: '6. 特殊载体 (Special)', icon: <Castle size={18} /> },
    { id: 'history', label: '7. 历史与剧情 (History)', icon: <Hourglass size={18} /> },
  ];

  const renderSectionContent = () => {
    // Reusable container class for content sections
    const containerClass = "space-y-8 animate-fade-in pb-10";
    
    switch (activeSection) {
      case 'basic':
        return (
          <div className={containerClass}>
             <GroupTitle title="序章 (Prologue)" />
             <div className="space-y-4">
                <TextAreaField label="世界观命名/类型" subtext="如：赛博朋克、高魔奇幻" value={data.basic_name_type} onChange={v => handleChange('basic_name_type', v)} height="h-20" />
                <TextAreaField label="是否基于通行设定及独有设定" subtext="通用规则 vs 创新规则" value={data.basic_common_setting} onChange={v => handleChange('basic_common_setting', v)} height="h-20" />
                <TextAreaField label="主要生命体及特殊血统" subtext="魔法生物、动物基囚等" value={data.basic_lifeforms} onChange={v => handleChange('basic_lifeforms', v)} height="h-24" />
             </div>

             <GroupTitle title="传说 (Legends)" />
             <div className="space-y-4">
                <TextAreaField label="所属范围" subtext="世界观/国家/地区" value={data.basic_legends_scope} onChange={v => handleChange('basic_legends_scope', v)} height="h-16" />
                <TextAreaField label="内容简述及类型" value={data.basic_legends_content} onChange={v => handleChange('basic_legends_content', v)} height="h-24" />
                <TextAreaField label="影响等级与流传信息" subtext="流传年代、真实依据、普及度" value={data.basic_legends_impact_level} onChange={v => handleChange('basic_legends_impact_level', v)} height="h-20" />
                <TextAreaField label="对世界观及特定个人的影响" value={data.basic_legends_impact_personal} onChange={v => handleChange('basic_legends_impact_personal', v)} height="h-20" />
             </div>

             <GroupTitle title="风俗 (Customs)" />
             <div className="space-y-4">
                <TextAreaField label="所属范围、内容简述及类型" subtext="婚丧嫁娶等" value={data.basic_customs_scope_content} onChange={v => handleChange('basic_customs_scope_content', v)} height="h-24" />
                <TextAreaField label="起源年代、形成原因" value={data.basic_customs_origin} onChange={v => handleChange('basic_customs_origin', v)} height="h-20" />
                <TextAreaField label="影响范围、程度、涉及地点/物品" value={data.basic_customs_impact} onChange={v => handleChange('basic_customs_impact', v)} height="h-20" />
                <TextAreaField label="延续性" subtext="是否终结、是否演化" value={data.basic_customs_continuity} onChange={v => handleChange('basic_customs_continuity', v)} height="h-16" />
             </div>
          </div>
        );
      case 'social':
        return (
          <div className={containerClass}>
             <GroupTitle title="阵营割据 (Factions)" />
             <div className="space-y-4">
                <TextAreaField label="所属范围、主要阵营" subtext="名称、实力占比等" value={data.social_factions_scope} onChange={v => handleChange('social_factions_scope', v)} height="h-20" />
                <TextAreaField label="阵营基本信息" subtext="特征、行动" value={data.social_factions_info} onChange={v => handleChange('social_factions_info', v)} height="h-24" />
                <TextAreaField label="人员信息" subtext="负责人、主次人员" value={data.social_factions_members} onChange={v => handleChange('social_factions_members', v)} height="h-24" />
             </div>

             <GroupTitle title="层级分布 (Hierarchy)" />
             <div className="space-y-4">
                <TextAreaField label="所属范围、层级数量及名称" value={data.social_hierarchy_scope} onChange={v => handleChange('social_hierarchy_scope', v)} height="h-20" />
                <TextAreaField label="分化原因及历史" subtext="血统、财力等" value={data.social_hierarchy_cause} onChange={v => handleChange('social_hierarchy_cause', v)} height="h-20" />
                <TextAreaField label="层级标识、权力、通婚规则" value={data.social_hierarchy_symbols} onChange={v => handleChange('social_hierarchy_symbols', v)} height="h-24" />
                <TextAreaField label="层级流动性及矛盾" subtext="跃升/降级可能性" value={data.social_hierarchy_mobility} onChange={v => handleChange('social_hierarchy_mobility', v)} height="h-20" />
             </div>

             <GroupTitle title="性别族群 (Demographics)" />
             <div className="space-y-4">
                <TextAreaField label="所属范围、性别/族群种类及名称" value={data.social_demographics_scope} onChange={v => handleChange('social_demographics_scope', v)} height="h-20" />
                <TextAreaField label="区分根源及五维特征" subtext="体征、地位等" value={data.social_demographics_root} onChange={v => handleChange('social_demographics_root', v)} height="h-24" />
                <TextAreaField label="核心冲突及相关重大事件" value={data.social_demographics_conflict} onChange={v => handleChange('social_demographics_conflict', v)} height="h-24" />
             </div>

             <GroupTitle title="家庭结构 (Family)" />
             <div className="space-y-4">
                <TextAreaField label="所属类型及地位" subtext="家族/类家庭，成员地位是否平等" value={data.social_family_type} onChange={v => handleChange('social_family_type', v)} height="h-20" />
                <TextAreaField label="成员关系、特殊称谓" value={data.social_family_relations} onChange={v => handleChange('social_family_relations', v)} height="h-20" />
                <TextAreaField label="财产/住所分配、继承顺位" value={data.social_family_assets} onChange={v => handleChange('social_family_assets', v)} height="h-20" />
                <TextAreaField label="家规、重大问题处理方式" value={data.social_family_rules} onChange={v => handleChange('social_family_rules', v)} height="h-20" />
                <TextAreaField label="与其他家族的矛盾或联系" value={data.social_family_external} onChange={v => handleChange('social_family_external', v)} height="h-16" />
             </div>
          </div>
        );
      case 'core':
        return (
          <div className={containerClass}>
             <GroupTitle title="能力衍化 (Power System)" />
             <div className="space-y-4">
                <TextAreaField label="核心原因/元素、对世界观的影响" subtext="魔法、科技、气等" value={data.core_power_cause} onChange={v => handleChange('core_power_cause', v)} height="h-24" />
                <TextAreaField label="能力形态及行进方向" subtext="原始、初阶、中阶等" value={data.core_power_form} onChange={v => handleChange('core_power_form', v)} height="h-24" />
                <TextAreaField label="拥有能力的原因、稀有程度" value={data.core_power_source} onChange={v => handleChange('core_power_source', v)} height="h-20" />
                <TextAreaField label="进阶条件、等级标准及评定机构" value={data.core_power_advance} onChange={v => handleChange('core_power_advance', v)} height="h-24" />
                <TextAreaField label="发动条件、使用相关影响" subtext="区别对待、反噬等" value={data.core_power_conditions} onChange={v => handleChange('core_power_conditions', v)} height="h-20" />
             </div>

             <GroupTitle title="婚姻与繁衍 (Marriage & Reproduction)" />
             <div className="space-y-4">
                <TextAreaField label="所属范围、对缔结关系的态度" value={data.core_marriage_scope} onChange={v => handleChange('core_marriage_scope', v)} height="h-20" />
                <TextAreaField label="缔结目的、取决于谁的意志" value={data.core_marriage_purpose} onChange={v => handleChange('core_marriage_purpose', v)} height="h-20" />
                <TextAreaField label="婚姻优势方/弱势方、婚后变化" value={data.core_marriage_status} onChange={v => handleChange('core_marriage_status', v)} height="h-20" />
                <TextAreaField label="合法性判定、缔结礼仪及风俗" value={data.core_marriage_legitimacy} onChange={v => handleChange('core_marriage_legitimacy', v)} height="h-24" />
                <TextAreaField label="姓名变更、结婚次数限制" value={data.core_marriage_name} onChange={v => handleChange('core_marriage_name', v)} height="h-16" />
                <TextAreaField label="解除婚姻关系的条件、权益影响" value={data.core_marriage_divorce} onChange={v => handleChange('core_marriage_divorce', v)} height="h-20" />
             </div>
          </div>
        );
      case 'operation':
        return (
          <div className={containerClass}>
             <GroupTitle title="货币与产业 (Economy)" />
             <div className="space-y-4">
                <TextAreaField label="所属范围、时间段、货币名称及价值换算" value={data.op_economy_scope} onChange={v => handleChange('op_economy_scope', v)} height="h-20" />
                <TextAreaField label="经济框架" subtext="粮食作物、经济作物、矿产等" value={data.op_economy_framework} onChange={v => handleChange('op_economy_framework', v)} height="h-20" />
                <TextAreaField label="人均收入水平、需求满足程度" value={data.op_economy_income} onChange={v => handleChange('op_economy_income', v)} height="h-16" />
                <TextAreaField label="资源分配情况" subtext="是否平均、贫富差异原因" value={data.op_economy_dist} onChange={v => handleChange('op_economy_dist', v)} height="h-20" />
                <TextAreaField label="富人与底层人民的财富积累/生计方式" value={data.op_economy_wealth} onChange={v => handleChange('op_economy_wealth', v)} height="h-24" />
                <TextAreaField label="救济情况、消费倾向、贫困人群不良习性" value={data.op_economy_relief} onChange={v => handleChange('op_economy_relief', v)} height="h-20" />
                <TextAreaField label="经济相关冲突及未来变化可能性" value={data.op_economy_conflict} onChange={v => handleChange('op_economy_conflict', v)} height="h-20" />
             </div>

             <GroupTitle title="医疗卫生 (Healthcare)" />
             <div className="space-y-4">
                <TextAreaField label="所属范围、公共卫生情况" subtext="城市区域差异、排污能力" value={data.op_healthcare_scope} onChange={v => handleChange('op_healthcare_scope', v)} height="h-20" />
                <TextAreaField label="平均寿命、常见死亡原因" value={data.op_healthcare_lifespan} onChange={v => handleChange('op_healthcare_lifespan', v)} height="h-16" />
                <TextAreaField label="医疗状况" subtext="不同人群医疗机会、是否引发矛盾" value={data.op_healthcare_status} onChange={v => handleChange('op_healthcare_status', v)} height="h-20" />
                <TextAreaField label="大规模传染病、特定疾病" subtext="成因、症状、歧视情况" value={data.op_healthcare_disease} onChange={v => handleChange('op_healthcare_disease', v)} height="h-24" />
                <TextAreaField label="主要医疗方式、资源分配情况" value={data.op_healthcare_methods} onChange={v => handleChange('op_healthcare_methods', v)} height="h-20" />
                <TextAreaField label="治愈偏方、错误医疗方式及病历记录" value={data.op_healthcare_records} onChange={v => handleChange('op_healthcare_records', v)} height="h-20" />
             </div>

             <GroupTitle title="公共事业 - 教育与学习" />
             <div className="space-y-4">
                <TextAreaField label="主要教育系统、教育制度与内容" value={data.op_education_system} onChange={v => handleChange('op_education_system', v)} height="h-24" />
                <TextAreaField label="受教育年龄区间、文官比例、升学制度" value={data.op_education_age} onChange={v => handleChange('op_education_age', v)} height="h-20" />
                <TextAreaField label="家庭背景对教育的影响、与社会地位的关联" value={data.op_education_access} onChange={v => handleChange('op_education_access', v)} height="h-20" />
                <TextAreaField label="禁止接受教育的人群及原因" value={data.op_education_banned} onChange={v => handleChange('op_education_banned', v)} height="h-16" />
             </div>

             <GroupTitle title="公共事业 - 交通与信息传递" />
             <div className="space-y-4">
                <TextAreaField label="主要交通工具、枢纽、区域交通区别" value={data.op_transport_vehicles} onChange={v => handleChange('op_transport_vehicles', v)} height="h-20" />
                <TextAreaField label="主要信息传递方式、滞后期及偏差" value={data.op_transport_info} onChange={v => handleChange('op_transport_info', v)} height="h-20" />
                <TextAreaField label="货运系统状况" subtext="关卡、违禁品运输等" value={data.op_transport_cargo} onChange={v => handleChange('op_transport_cargo', v)} height="h-20" />
             </div>

             <GroupTitle title="权威规则 (Authority)" />
             <div className="space-y-4">
                <TextAreaField label="所属范围、权威机构" subtext="名称、来源、架构、历史" value={data.op_authority_agency} onChange={v => handleChange('op_authority_agency', v)} height="h-24" />
                <TextAreaField label="权威性质、核心规则及惩罚" value={data.op_authority_rules} onChange={v => handleChange('op_authority_rules', v)} height="h-24" />
                <TextAreaField label="特殊税收" subtext="对象、收取物" value={data.op_authority_tax} onChange={v => handleChange('op_authority_tax', v)} height="h-16" />
                <TextAreaField label="资源获取方式、分配情况" value={data.op_authority_resources} onChange={v => handleChange('op_authority_resources', v)} height="h-20" />
                <TextAreaField label="货币形式、交易机构" value={data.op_authority_currency} onChange={v => handleChange('op_authority_currency', v)} height="h-16" />
                <TextAreaField label="不同人群财产来源/处置权区别" value={data.op_authority_property} onChange={v => handleChange('op_authority_property', v)} height="h-20" />
                <TextAreaField label="非常规财产获得方式及惩罚" value={data.op_authority_illegal} onChange={v => handleChange('op_authority_illegal', v)} height="h-20" />
             </div>

             <GroupTitle title="礼仪与表达 (Etiquette)" />
             <div className="space-y-4">
                <TextAreaField label="所属范围、见面打招呼方式" value={data.op_etiquette_scope} onChange={v => handleChange('op_etiquette_scope', v)} height="h-16" />
                <TextAreaField label="聊天常见内容、独特词语/造句" value={data.op_etiquette_chat} onChange={v => handleChange('op_etiquette_chat', v)} height="h-20" />
                <TextAreaField label="不同群体语言习惯、命名区别" value={data.op_etiquette_habits} onChange={v => handleChange('op_etiquette_habits', v)} height="h-20" />
                <TextAreaField label="称谓与行礼规则" subtext="上下级、长晚辈" value={data.op_etiquette_titles} onChange={v => handleChange('op_etiquette_titles', v)} height="h-20" />
                <TextAreaField label="社交场所、拒绝他人及示爱方式" value={data.op_etiquette_venues} onChange={v => handleChange('op_etiquette_venues', v)} height="h-20" />
                <TextAreaField label="独特手势/动作、彰显礼仪的服饰/道具" value={data.op_etiquette_gestures} onChange={v => handleChange('op_etiquette_gestures', v)} height="h-20" />
             </div>
          </div>
        );
      case 'culture':
        return (
          <div className={containerClass}>
             <GroupTitle title="艺术与美学 (Arts)" />
             <div className="space-y-4">
                <TextAreaField label="所属范围、美与丑的评判标准" value={data.culture_arts_standards} onChange={v => handleChange('culture_arts_standards', v)} height="h-20" />
                <TextAreaField label="艺术载体、推崇及普及度高的艺术形式" value={data.culture_arts_forms} onChange={v => handleChange('culture_arts_forms', v)} height="h-20" />
                <TextAreaField label="艺术目的" subtext="主流认可/未认可" value={data.culture_arts_purpose} onChange={v => handleChange('culture_arts_purpose', v)} height="h-16" />
                <TextAreaField label="艺术的社会地位" subtext="管制、禁止情况" value={data.culture_arts_status} onChange={v => handleChange('culture_arts_status', v)} height="h-20" />
                <TextAreaField label="艺术作品价值、创作者社会认知" value={data.culture_arts_value} onChange={v => handleChange('culture_arts_value', v)} height="h-20" />
             </div>

             <GroupTitle title="艺术史 (Art History)" />
             <div className="space-y-4">
                <TextAreaField label="所属范围、高雅与通俗艺术及流派" value={data.culture_history_scope} onChange={v => handleChange('culture_history_scope', v)} height="h-20" />
                <TextAreaField label="经典艺术作品" subtext="名称、作者、形式等" value={data.culture_history_classics} onChange={v => handleChange('culture_history_classics', v)} height="h-20" />
                <TextAreaField label="艺术融合外来文化情况、引发的争端" value={data.culture_history_fusion} onChange={v => handleChange('culture_history_fusion', v)} height="h-20" />
                <TextAreaField label="历史/科技对艺术表现的影响" value={data.culture_history_tech} onChange={v => handleChange('culture_history_tech', v)} height="h-20" />
             </div>

             <GroupTitle title="游戏与竞技 (Games)" />
             <div className="space-y-4">
                <TextAreaField label="游戏名称、发源地、诞生原因" value={data.culture_games_info} onChange={v => handleChange('culture_games_info', v)} height="h-20" />
                <TextAreaField label="与世界观的融合、精神内核与意义" value={data.culture_games_meaning} onChange={v => handleChange('culture_games_meaning', v)} height="h-24" />
                <TextAreaField label="游戏性质、合法性、主办方" value={data.culture_games_nature} onChange={v => handleChange('culture_games_nature', v)} height="h-16" />
                <TextAreaField label="可使用道具、手段、场地" value={data.culture_games_items} onChange={v => handleChange('culture_games_items', v)} height="h-20" />
                <TextAreaField label="基础规则" subtext="时间、人数、时长、裁判" value={data.culture_games_rules} onChange={v => handleChange('culture_games_rules', v)} height="h-24" />
                <TextAreaField label="胜利/违规判定、可能遭遇的事件" value={data.culture_games_judgement} onChange={v => handleChange('culture_games_judgement', v)} height="h-24" />
                <TextAreaField label="退出规则及惩罚" value={data.culture_games_exit} onChange={v => handleChange('culture_games_exit', v)} height="h-16" />
             </div>

             <GroupTitle title="游戏参与 (Participation)" />
             <div className="space-y-4">
                <TextAreaField label="参赛者身份、参与原因、是否被迫" value={data.culture_play_identity} onChange={v => handleChange('culture_play_identity', v)} height="h-20" />
                <TextAreaField label="参赛限制" subtext="年龄、性别、身体条件等" value={data.culture_play_limits} onChange={v => handleChange('culture_play_limits', v)} height="h-16" />
                <TextAreaField label="安全风险、荣誉认证与奖励" value={data.culture_play_risks} onChange={v => handleChange('culture_play_risks', v)} height="h-20" />
                <TextAreaField label="失败者惩罚、观赛情况及结果预测" value={data.culture_play_punish} onChange={v => handleChange('culture_play_punish', v)} height="h-20" />
             </div>
          </div>
        );
      case 'special':
        return (
          <div className={containerClass}>
             <GroupTitle title="特殊建筑 (Special Buildings)" />
             <div className="space-y-4">
                <TextAreaField label="所属范围、出现原因、设计初衷" value={data.special_buildings_scope} onChange={v => handleChange('special_buildings_scope', v)} height="h-20" />
                <TextAreaField label="名称、年代、地理位置" value={data.special_buildings_info} onChange={v => handleChange('special_buildings_info', v)} height="h-16" />
                <TextAreaField label="主体建材及获取难度" value={data.special_buildings_material} onChange={v => handleChange('special_buildings_material', v)} height="h-16" />
                <TextAreaField label="实际功能、当前状态" value={data.special_buildings_function} onChange={v => handleChange('special_buildings_function', v)} height="h-20" />
                <TextAreaField label="独特之处、普遍评价" value={data.special_buildings_unique} onChange={v => handleChange('special_buildings_unique', v)} height="h-20" />
                <TextAreaField label="进入条件" subtext="检查、指定道具" value={data.special_buildings_entry} onChange={v => handleChange('special_buildings_entry', v)} height="h-16" />
                <TextAreaField label="内部物理规律、空间/摆设变化情况" value={data.special_buildings_physics} onChange={v => handleChange('special_buildings_physics', v)} height="h-24" />
                <TextAreaField label="蓝图、秘密" subtext="特殊结构、隐藏空间" value={data.special_buildings_blueprints} onChange={v => handleChange('special_buildings_blueprints', v)} height="h-20" />
                <TextAreaField label="外部附属部分及用途" value={data.special_buildings_annex} onChange={v => handleChange('special_buildings_annex', v)} height="h-20" />
             </div>

             <GroupTitle title="地图 (Map)" />
             <div className="space-y-4">
                <TextAreaField label="所属范围、制图信息" subtext="年份、制图者、比例尺" value={data.special_map_scope} onChange={v => handleChange('special_map_scope', v)} height="h-20" />
                <TextAreaField label="地理元素" subtext="山脉、沙漠、水系等" value={data.special_map_elements} onChange={v => handleChange('special_map_elements', v)} height="h-20" />
                <TextAreaField label="重要地点/标记" subtext="医院、发电站等" value={data.special_map_landmarks} onChange={v => handleChange('special_map_landmarks', v)} height="h-20" />
                <TextAreaField label="特殊状况" subtext="城市、地缘因素、气候灾害等" value={data.special_map_conditions} onChange={v => handleChange('special_map_conditions', v)} height="h-20" />
             </div>
          </div>
        );
      case 'history':
        return (
          <div className={containerClass}>
             <GroupTitle title="战争 (Wars)" />
             <div className="space-y-4">
                <TextAreaField label="参与势力、冲突原因" value={data.history_wars_factions} onChange={v => handleChange('history_wars_factions', v)} height="h-20" />
                <TextAreaField label="战争规模、阶段、阵营实力对比" value={data.history_wars_scale} onChange={v => handleChange('history_wars_scale', v)} height="h-20" />
                <TextAreaField label="参战/死伤/失踪人数、发动方与胜利方" value={data.history_wars_stats} onChange={v => handleChange('history_wars_stats', v)} height="h-20" />
                <TextAreaField label="胜利原因、战败结果" value={data.history_wars_result} onChange={v => handleChange('history_wars_result', v)} height="h-20" />
                <TextAreaField label="战俘对待方式" subtext="来源、战时待遇、战后处置" value={data.history_wars_pows} onChange={v => handleChange('history_wars_pows', v)} height="h-20" />
                <TextAreaField label="战事图" subtext="阵营分布、防御工事等" value={data.history_wars_map} onChange={v => handleChange('history_wars_map', v)} height="h-20" />
                <TextAreaField label="战争史" subtext="时间、重要节点/战役" value={data.history_wars_history} onChange={v => handleChange('history_wars_history', v)} height="h-24" />
             </div>

             <GroupTitle title="大事年表 (Timeline)" />
             <div className="space-y-4">
                <TextAreaField label="所属范围、是否使用特殊纪年" value={data.history_timeline_scope} onChange={v => handleChange('history_timeline_scope', v)} height="h-16" />
                <TextAreaField label="纪年方式、现在年份" value={data.history_timeline_method} onChange={v => handleChange('history_timeline_method', v)} height="h-16" />
                <TextAreaField label="大事件" subtext="时间、相关人物及经历" value={data.history_timeline_events} onChange={v => handleChange('history_timeline_events', v)} height="h-32" />
             </div>

             <GroupTitle title="故事线 (Storyline)" />
             <div className="space-y-4">
                <TextAreaField label="故事大纲、主线与暗线" value={data.history_plot_outline} onChange={v => handleChange('history_plot_outline', v)} height="h-32" />
                <TextAreaField label="章节规划、涉及人物及事件" value={data.history_plot_chapters} onChange={v => handleChange('history_plot_chapters', v)} height="h-32" />
             </div>

             <GroupTitle title="时空推演 (Time/Space Deduction)" />
             <div className="space-y-4">
                <TextAreaField label="不同历史时期/时间线的推演" value={data.history_deduction} onChange={v => handleChange('history_deduction', v)} height="h-32" />
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto p-4 gap-4">
      {/* Top Toolbar: Title & Import/Export */}
      <div className={`
        w-full rounded-xl p-3 flex items-center justify-between shadow-lg backdrop-blur-sm border transition-colors duration-300
        bg-white/80 border-slate-200
        dark:bg-slate-900/80 dark:border-slate-700
      `}>
         <div className="flex items-center gap-2 px-2">
            <Globe className="text-bamboo-green dark:text-ethereal-purple transition-colors duration-300" size={24} />
            <h2 className="text-xl font-serif font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">世界观设定 (World Settings)</h2>
         </div>
         
         <div className="flex gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".json" 
              className="hidden" 
            />
            
            <button 
              onClick={handleImportClick}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border shadow-sm
                bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600
                dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-600 dark:text-slate-300
              `}
            >
              <Upload size={16} /> 导入 (Import)
            </button>
            
            <button 
              onClick={handleExport}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors shadow-lg
                bg-bamboo-green hover:bg-emerald-600 shadow-emerald-500/20
                dark:bg-ethereal-purple dark:hover:bg-indigo-600 dark:shadow-indigo-900/20
              `}
            >
              <Download size={16} /> 导出 (Export)
            </button>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className={`
            border rounded-xl p-2 h-full overflow-y-auto custom-scrollbar transition-colors duration-300
            bg-white/50 border-slate-200
            dark:bg-slate-900/50 dark:border-slate-700
          `}>
             {sections.map(section => (
               <button
                 key={section.id}
                 onClick={() => setActiveSection(section.id)}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all mb-1 ${
                   activeSection === section.id 
                   ? 'bg-bamboo-green text-white shadow-lg shadow-emerald-500/30 dark:bg-ethereal-purple dark:shadow-indigo-900/50' 
                   : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
                 }`}
               >
                 {section.icon}
                 <span className="truncate">{section.label}</span>
               </button>
             ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`
          flex-1 border rounded-xl p-8 overflow-y-auto shadow-2xl relative custom-scrollbar h-full transition-colors duration-300
          bg-white/80 border-slate-200
          dark:bg-slate-900/80 dark:border-slate-700
        `}>
           <div className={`
             mb-6 border-b pb-4 flex justify-between items-end transition-colors duration-300
             border-slate-200 dark:border-slate-700
           `}>
              <div>
                <h2 className="text-2xl font-serif font-bold flex items-center gap-2 text-sage-text dark:text-mystic-gold transition-colors duration-300">
                  {sections.find(s => s.id === activeSection)?.label}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                   Fill in the blanks to define your world's laws. The more detailed, the better the simulation.
                </p>
              </div>
              <div className="text-slate-400 dark:text-slate-600 transition-colors duration-300">
                 <Globe size={32} strokeWidth={1} />
              </div>
           </div>
           {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const GroupTitle = ({ title }: { title: string }) => (
  <div className="flex items-center gap-2 mb-4 mt-2">
    <div className="w-1 h-6 rounded-full bg-bamboo-green dark:bg-ethereal-purple transition-colors duration-300"></div>
    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">{title}</h3>
  </div>
);

const TextAreaField = ({ label, subtext, value, onChange, height = "h-32" }: { label: string, subtext?: string, value: string, onChange: (v: string) => void, height?: string }) => (
  <div className="space-y-1">
    <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
       <label className="font-medium text-sm text-bamboo-green dark:text-indigo-400 transition-colors duration-300">{label}</label>
       {subtext && <span className="text-xs text-slate-500">({subtext})</span>}
    </div>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full ${height} p-3 rounded-lg border outline-none transition-all resize-none leading-relaxed text-sm
        bg-slate-50 border-slate-300 focus:border-bamboo-green focus:ring-1 focus:ring-bamboo-green text-slate-800
        dark:bg-slate-950/80 dark:border-slate-800 dark:focus:border-ethereal-purple dark:focus:ring-ethereal-purple dark:text-white
      `}
      placeholder="..."
    />
  </div>
);