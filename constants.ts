import { MealType, CultureStyle, TableZone, TableSettingConfig } from './types';

export const MEAL_TYPES = Object.values(MealType);
export const CULTURE_STYLES = Object.values(CultureStyle);

// Basic fallbacks if AI fails or for initial state
export const DEFAULT_SETTING: TableSettingConfig = {
  title: "Classic Dinner Setting",
  description: "A standard setting suitable for most dinner occasions.",
  items: [
    { id: 'p1', name: 'Dinner Plate', type: 'plate', zone: TableZone.Center, description: 'Placed in the center of the setting.' },
    { id: 'f1', name: 'Dinner Fork', type: 'cutlery', zone: TableZone.Left1, description: 'Placed to the immediate left of the plate.' },
    { id: 'k1', name: 'Dinner Knife', type: 'cutlery', zone: TableZone.Right1, description: 'Placed to the right of the plate, blade facing inward.' },
    { id: 'n1', name: 'Napkin', type: 'napkin', zone: TableZone.Left2, description: 'Placed to the left of the forks.' },
    { id: 'g1', name: 'Water Glass', type: 'glass', zone: TableZone.TopRight, description: 'Placed above the knife.' }
  ],
  tips: ["Ensure knife blades always face the plate.", "Space items evenly."]
};

export const SYSTEM_INSTRUCTION_GENERATOR = `
You are an expert in dining etiquette and table setting. 
When asked, you will provide a JSON configuration for a specific table setting (Meal + Culture).
The JSON must adhere to the following schema:
{
  "title": "string",
  "description": "string",
  "items": [
    {
      "id": "string",
      "name": "string",
      "type": "plate" | "cutlery" | "glass" | "napkin" | "accessory" | "bowl",
      "zone": "center" | "left_1" | "left_2" | "left_3" | "right_1" | "right_2" | "right_3" | "top_left" | "top_right" | "top_center",
      "description": "string"
    }
  ],
  "tips": ["string", "string"]
}

Zone Definitions:
- center: The main plate/charger
- left_1: Immediate left of plate (e.g., Dinner Fork)
- left_2: Left of left_1 (e.g., Salad Fork)
- left_3: Left of left_2 (e.g., Napkin if not on plate)
- right_1: Immediate right of plate (e.g., Dinner Knife)
- right_2: Right of right_1 (e.g., Soup Spoon)
- right_3: Right of right_2 (e.g., Oyster Fork)
- top_left: Bread plate area
- top_right: Glassware area
- top_center: Dessert cutlery area

IMPORTANT CULTURAL NUANCES:
- American: Forks on left, knives/spoons on right. Napkin often on left.
- European: Fork tines often facing down (optional visual), similar to American but often fork/knife remain in hands.
- Indian: Often uses a Thali (large platter) in center. Bowls (Katoris) arranged along the top rim of the Thali (top_center, top_left, top_right of the *plate* itself, but for this schema map them to zones closest). No cutlery usually, but if formal, spoon on right. Water on top right.
`;

export const SYSTEM_INSTRUCTION_CHAT = `
You are a helpful, sophisticated dining assistant named "Maître D'".
You answer questions about table manners, setting etiquette, wine pairings, and event planning.
Keep answers concise, polite, and helpful.
`;
