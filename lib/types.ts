export interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  imgSrc?: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  name: string;
  crop: string;
  color: string;
  messages: Message[];
  createdAt: Date;
}

export interface WeatherData {
  temp: number;
  hum: number;
  wind: number;
  rec: string;
  locationName?: string;
}

export type ViewType = "chat" | "crops" | "soil" | "flow";

export const CROP_EMOJIS: Record<string, string> = {
  acelga: "🥬",
  lechuga: "🥗",
  tomate: "🍅",
  aji: "🌶️",
  cebolla: "🧅",
  zanahoria: "🥕",
  espinaca: "🌿",
  pepino: "🥒",
  berenjena: "🍆",
  rabano: "🌱",
  otro: "🪴",
};
