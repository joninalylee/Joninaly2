import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { WorldSettings, Character, ChatMessage, StoryFormat, STORY_FORMATS } from "../types";
import { WORLD_LORE, LoreEntry } from "../data/worldLore";

// This service is prepared to receive the specific logic templates later.
// Currently uses a base structure for roleplay.

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to scan for lore matches
const scanLorebook = (inputText: string): string[] => {
  const matches: string[] = [];
  const normalizedInput = inputText.toLowerCase();

  Object.values(WORLD_LORE.entries).forEach((entry: LoreEntry) => {
    // If disabled, skip completely
    if (entry.disable) return;
    
    // Check for CONSTANT entries (always include)
    if (entry.constant) {
      matches.push(entry.content);
      return;
    }

    // Check main keys for Selective entries
    if (entry.key && entry.key.length > 0) {
      const isMatch = entry.key.some(keyword => normalizedInput.includes(keyword.toLowerCase()));
      if (isMatch) {
        matches.push(entry.content);
      }
    }
  });

  // Deduplicate matches
  return Array.from(new Set(matches));
};

// Helper to process Hidden Chain of Thought
const processThinkingChain = (text: string): string => {
  if (!text) return "";
  
  // The user's requested regex logic: <thinking>[\s\S]*?</thinking> -> ""
  const thinkingRegex = /<thinking>[\s\S]*?<\/thinking>/g;
  
  // 1. Extract thoughts for debugging/logging (Director's Commentary)
  const thoughts = text.match(thinkingRegex);
  if (thoughts) {
    console.groupCollapsed("%c🎬 AI Director's Cut (Hidden Thoughts)", "color: #d4af37; font-weight: bold;");
    thoughts.forEach(t => {
      console.log(t.replace(/<\/?thinking>/g, '').trim());
    });
    console.groupEnd();
  }

  // 2. Remove thoughts from the final output presented to the user
  return text.replace(thinkingRegex, '').trim();
};

export const generateStoryResponse = async (
  world: WorldSettings,
  activeCharacter: Character,
  allCharacters: Character[],
  history: ChatMessage[],
  userAction: string,
  format: StoryFormat | null,
  systemInstructionOverride?: string
): Promise<string> => {
  
  // 1. Scan for World Lore (Contextual Injection + Constants)
  const recentHistoryText = history.slice(-3).map(m => m.content).join(' ');
  const textToScan = `${userAction} ${recentHistoryText}`;
  const relevantLore = scanLorebook(textToScan);
  
  const loreContext = relevantLore.length > 0 ? `
    === ACTIVE WORLD INFO & STATE TRACKING ===
    The following information is active. 
    IF IT CONTAINS A STATE BLOCK (e.g. [initvar]), YOU MUST MAINTAIN AND UPDATE THE STATE IN YOUR MENTAL MODEL.
    
    ${relevantLore.join('\n\n')}
  ` : '';

  // 2. Construct World Context
  const worldContext = `
    === WORLD SETTINGS (Detailed Configuration) ===
    ${JSON.stringify(world, null, 2)}
  `;

  // 3. Serialize Characters
  const characterContext = `
    === CHARACTERS (Detailed Dossiers) ===
    ${JSON.stringify(allCharacters, null, 2)}
  `;

  const playerContext = `
    CURRENT PLAYER POV: ${activeCharacter.name} (ID: ${activeCharacter.id})
    PLAYER GOAL: Immerse in the story from ${activeCharacter.name}'s perspective.
  `;

  const formatContext = format ? `
    SCRIPT FORMAT: ${STORY_FORMATS[format].label}
    FORMAT CHARACTERISTICS: ${STORY_FORMATS[format].desc}
    (Keep the narrative pacing and style consistent with this format)
  ` : '';

  const conversationHistory = history.map(msg => 
    `${msg.sender === 'user' ? `Player (${activeCharacter.name})` : (msg.characterName || 'Narrator')}: ${msg.content}`
  ).join('\n');

  const fullPrompt = `
    You are the Game Master and Story Engine for a high-quality roleplay scenario ("Slow Line Game" / 慢线游戏).
    
    ${worldContext}

    ${characterContext}

    ${loreContext}

    ${formatContext}

    ${playerContext}

    INSTRUCTIONS:
    1. Continue the story based on the player's action.
    2. Act as all other characters (NPCs) and the Narrator.
    3. Maintain the tone of the genre defined in the world settings.
    4. Be descriptive and immersive. STRICTLY ADHERE to the world rules and character dossiers (Psychology, History, Inventory, etc.) provided in the JSON above.
    5. Do not break character.
    6. If other characters speak, prefix their dialogue with their name.
    7. If an [initvar] block is present in World Info, silently track those variables (Affection, Lust, Location, Time) based on the story progression.
    
    8. *** IMPORTANT: DIRECTOR'S THINKING PROCESS ***
       Before writing the actual response, you MUST output a <thinking> block.
       Inside <thinking>...</thinking>, perform a deep analysis like a veteran film director:
       - **Intent Analysis**: What is the player trying to achieve?
       - **Pacing & Tension**: Does the scene need to speed up (action) or slow down (reflection)?
       - **Character Psychology**: Analyze the NPC's true feelings vs. what they show.
       - **World Logic Check**: Review the [initvar] state and World Settings to ensure consistency.
       - **Visuals**: Plan the sensory details (lighting, camera angles, sound).
       
       Only AFTER this block, output the final story content.

    PREVIOUS HISTORY:
    ${conversationHistory}

    PLAYER ACTION:
    ${userAction}
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstructionOverride || "You are an expert novelist and RPG Game Master. Use the provided JSON world and character data as your absolute truth source.",
        temperature: 0.8,
        maxOutputTokens: 4000, // Increased limit to accommodate thinking + content
      }
    });

    const rawText = response.text || "Create failed. Please try again.";
    return processThinkingChain(rawText);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The threads of fate are tangled (API Error). Please try again.";
  }
};

export const generateInitialScene = async (
  world: WorldSettings,
  activeCharacter: Character,
  format: StoryFormat
): Promise<string> => {
   
   // Scan for basic location triggers
   const textToScan = `${world.basic_common_setting} ${activeCharacter.env_location} ${activeCharacter.env_birth}`;
   const relevantLore = scanLorebook(textToScan);
   
   const loreContext = relevantLore.length > 0 ? `
    === ACTIVE WORLD INFO ===
    ${relevantLore.join('\n')}
   ` : '';

   const prompt = `
    Initialize the story for this world.
    Focus on the character "${activeCharacter.name}".
    
    WORLD DATA (JSON):
    ${JSON.stringify(world, null, 2)}
    
    CHARACTER CONTEXT (JSON): 
    ${JSON.stringify(activeCharacter, null, 2)}
    
    ${loreContext}

    SCRIPT FORMAT: ${STORY_FORMATS[format].label}
    FORMAT TRAITS: ${STORY_FORMATS[format].desc}
    
    INSTRUCTIONS:
    1. *** IMPORTANT: DIRECTOR'S THINKING PROCESS ***
       Start with a <thinking> block. Analyze how to open this story effectively based on the chosen format (e.g., Short Video needs a hook, Feature Film needs atmosphere).
       Plan the opening shot, the inciting incident, and the character's initial state.
    2. Describe the opening scene. Use the "Prologue", "Geography", and "Customs" from the world data.
    3. Ensure the pacing matches the selected script format.
   `;

   try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    const rawText = response.text || "Story initialization failed.";
    return processThinkingChain(rawText);

   } catch (error) {
     return "Could not start story.";
   }
}