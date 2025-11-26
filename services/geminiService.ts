import { GoogleGenAI, Type } from "@google/genai";
import { TableSettingConfig, MealType, CultureStyle } from "../types";
import { SYSTEM_INSTRUCTION_GENERATOR, SYSTEM_INSTRUCTION_CHAT } from "../constants";

const getAI = () => {
    if (!process.env.API_KEY) {
        console.error("API_KEY is missing from environment variables.");
        throw new Error("API Key is missing");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateTableConfig = async (meal: MealType, culture: CultureStyle): Promise<TableSettingConfig> => {
    const ai = getAI();
    
    const prompt = `Generate a table setting configuration for a ${culture} style ${meal}. Return ONLY valid JSON matching the schema.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION_GENERATOR,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        items: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    type: { type: Type.STRING, enum: ['plate', 'cutlery', 'glass', 'napkin', 'accessory', 'bowl'] },
                                    zone: { type: Type.STRING, enum: ['center', 'left_1', 'left_2', 'left_3', 'right_1', 'right_2', 'right_3', 'top_left', 'top_right', 'top_center'] },
                                    description: { type: Type.STRING }
                                },
                                required: ['id', 'name', 'type', 'zone', 'description']
                            }
                        },
                        tips: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['title', 'description', 'items', 'tips']
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        return JSON.parse(text) as TableSettingConfig;
    } catch (error) {
        console.error("Error generating table config:", error);
        throw error;
    }
};

export const generateTableImage = async (description: string): Promise<string> => {
    const ai = getAI();
    const prompt = `A photorealistic, high-quality, top-down view of a ${description} table setting. Perfect lighting, elegant tableware, neutral background. Highly detailed.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: prompt,
            config: {
                imageConfig: {
                    aspectRatio: "16:9",
                    imageSize: "1K"
                }
            }
        });

        // Loop to find the image part
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image generated");
    } catch (error) {
        console.error("Error generating image:", error);
        // Fallback placeholder
        return `https://picsum.photos/800/600?grayscale&blur=2`;
    }
};

export const sendChatMessage = async (history: { role: 'user' | 'model', parts: [{ text: string }] }[], message: string) => {
    const ai = getAI();
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction: SYSTEM_INSTRUCTION_CHAT },
        history: history
    });

    const response = await chat.sendMessage({ message });
    return response.text;
};
