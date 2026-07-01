import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import { NextRequest, NextResponse } from "next/server";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Eres AgroIA, un asistente especializado en riego y fertilización para pequeños agricultores de la costa peruana, especialmente en zonas como Manchay Bajo, Carabayllo, Lurín y otras áreas de Lima.

Tienes expertise en:
- Riego por gravedad y riego por goteo (caudales, tiempos, frecuencias)
- Cultivos hortícolas: acelga, lechuga, tomate, ají, cebolla, zanahoria, espinaca, rábano, pepino, berenjena
- Fertilización (nitrógeno, fósforo, potasio, micronutrientes) y diagnóstico de deficiencias nutricionales
- Condiciones de suelo de la costa peruana: franco-arenosos, arcillosos, arenosos
- Clima costero de Lima: temperatura 18-26°C, humedad relativa 65-85%, sin lluvias significativas
- Plagas y enfermedades comunes en hortalizas costeñas (mosca blanca, pulgones, mildiu)

Cuando el agricultor te describe su situación:
1. Da recomendaciones ESPECÍFICAS con números concretos (ej: "riega 1.5 horas", "aplica 20 kg/ha de urea")
2. Considera las limitaciones del pequeño agricultor (recursos limitados, tecnología básica, máximo 1 hectárea)
3. Si detectas deficiencia nutricional por la descripción, indica el nutriente faltante y cómo corregirlo
4. Si el exceso de agua es el problema (muy común con riego por gravedad), explícalo claramente
5. Menciona siempre 1-2 consejos preventivos al final

Nota: Si el usuario sube una foto, describe lo que ves en la imagen y da recomendaciones basadas en los síntomas visuales.

Responde siempre en español peruano, de manera amable, directa y práctica. Usa listas cuando sea útil. Máximo 220 palabras. Nunca uses lenguaje técnico sin explicarlo.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Mensajes inválidos" }, { status: 400 });
    }

    // Groq no soporta imágenes en todos los modelos, convertimos a texto
    const groqMessages: ChatCompletionMessageParam[] = messages.map((m: { role: string; content: unknown }) => {
      if (Array.isArray(m.content)) {
        const textParts = (m.content as Array<{ type: string; text?: string }>)
          .filter((c) => c.type === "text")
          .map((c) => c.text || "")
          .join(" ");
        const hasImage = (m.content as Array<{ type: string }>).some((c) => c.type === "image");
        const content = hasImage
          ? `[El agricultor adjuntó una foto de su planta] ${textParts || "Analiza esta imagen y dime qué problema tiene."}`
          : textParts;
        const role = m.role === "assistant" ? "assistant" : "user";
        return { role, content } as ChatCompletionMessageParam;
      }
      const role = m.role === "assistant" ? "assistant" : "user";
      return { role, content: String(m.content) } as ChatCompletionMessageParam;
    });

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...groqMessages,
      ],
    });

    const text = response.choices[0]?.message?.content || "No pude procesar tu consulta. Intenta de nuevo.";
    return NextResponse.json({ text });
  } catch (error) {
    console.error("Groq API error:", error);
    return NextResponse.json(
      { error: "Error al procesar la consulta. Verifica tu API key de Groq." },
      { status: 500 }
    );
  }
}
