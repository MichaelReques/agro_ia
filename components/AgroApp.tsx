"use client";

import { useState, useEffect, useCallback } from "react";
import { ChatSession, Message, ViewType, WeatherData } from "@/lib/types";
import Sidebar from "./Sidebar";
import WeatherBar from "./WeatherBar";
import ChatView from "./ChatView";
import CropsView from "./CropsView";
import SoilView from "./SoilView";
import FlowView from "./FlowView";
import NewSessionModal from "./NewSessionModal";

let _counter = 0;
function generateId() {
  _counter += 1;
  return `id-${Date.now()}-${_counter}`;
}

const DEFAULT_SESSIONS: ChatSession[] = [
  {
    id: "session-acelga-default",
    name: "Acelga",
    crop: "acelga",
    color: "#3B6D11",
    createdAt: new Date(),
    messages: [
      {
        id: "msg-default-1",
        role: "user",
        text: "Siembro acelga en media hectárea con riego por gravedad. Las hojas se están poniendo amarillas.",
        timestamp: new Date(),
      },
      {
        id: "msg-default-2",
        role: "ai",
        text: "Las hojas amarillas en acelga con riego por gravedad son una señal clásica de **exceso de agua o deficiencia de nitrógeno**, o ambas a la vez.\n\nCon riego por gravedad, el inicio del canal recibe mucha más agua que el final, lo que causa encharcamiento localizado y asfixia de raíces, impidiendo que la planta absorba nutrientes.\n\n**Lo que debes hacer:**\n1. Reduce el tiempo de riego a **máximo 1.5 horas por turno**\n2. Deja secar levemente el suelo entre riegos (mete el dedo 5 cm, si está húmedo no riegues)\n3. Aplica **20–25 kg/ha de urea** disuelto en agua, en las próximas 48 horas\n4. Revisa que el canal llegue bien al final del campo\n\n**Prevención:** Considera instalar aunque sea 2–3 surcos en la parte alta para nivelar el flujo.\n\n¿Las hojas amarillas están en toda la planta o solo en las hojas de abajo?",
        timestamp: new Date(),
      },
    ],
  },
  {
    id: "session-tomate-default",
    name: "Tomate",
    crop: "tomate",
    color: "#D85A30",
    createdAt: new Date(),
    messages: [],
  },
];

// Reverse geocode using Open-Meteo / nominatim (free)
async function getLocationName(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { "Accept-Language": "es" } }
    );
    const data = await res.json();
    const addr = data.address;
    return addr.city || addr.town || addr.village || addr.county || "Tu ubicación";
  } catch {
    return "Tu ubicación";
  }
}

export default function AgroApp() {
  const [view, setView] = useState<ViewType>("chat");
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window === "undefined") return DEFAULT_SESSIONS;
    try {
      const saved = localStorage.getItem("agroia-sessions");
      return saved ? JSON.parse(saved) : DEFAULT_SESSIONS;
    } catch {
      return DEFAULT_SESSIONS;
    }
  });
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    if (typeof window === "undefined") return "session-acelga-default";
    return localStorage.getItem("agroia-active-session") || "session-acelga-default";
  });
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locating, setLocating] = useState(true);
  const [showNewSession, setShowNewSession] = useState(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Persist sessions to localStorage
  useEffect(() => {
    localStorage.setItem("agroia-sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("agroia-active-session", activeSessionId);
  }, [activeSessionId]);

  // Get GPS location then fetch weather
  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number, locationName: string) => {
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        setWeather({ ...data, locationName });
      } catch {
        setWeather({ temp: 22, hum: 68, wind: 12, rec: "Buen día para riego por goteo", locationName });
      } finally {
        setLocating(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const locationName = await getLocationName(latitude, longitude);
          await fetchWeather(latitude, longitude, locationName);
        },
        // If user denies GPS, fallback to Lima
        async () => {
          await fetchWeather(-12.0464, -77.0428, "Lima");
        },
        { timeout: 8000 }
      );
    } else {
      fetchWeather(-12.0464, -77.0428, "Lima");
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string, imgSrc?: string) => {
      if (!text.trim() && !imgSrc) return;

      const userMsg: Message = {
        id: generateId(),
        role: "user",
        text: text || "(foto adjunta para análisis)",
        imgSrc,
        timestamp: new Date(),
      };

      const currentSession = sessions.find((s) => s.id === activeSessionId);
      if (!currentSession) return;

      const history = [...currentSession.messages, userMsg];

      const apiMessages = history.map((m) => {
        if (m.role === "user") {
          if (m.imgSrc) {
            const base64 = m.imgSrc.split(",")[1];
            const mediaType = m.imgSrc.startsWith("data:image/png")
              ? "image/png"
              : "image/jpeg";

            return {
              role: "user" as const,
              content: [
                {
                  type: "image" as const,
                  source: {
                    type: "base64" as const,
                    media_type: mediaType,
                    data: base64,
                  },
                },
                {
                  type: "text" as const,
                  text: m.text || "Analiza esta imagen de mi planta.",
                },
              ],
            };
          }

          return {
            role: "user" as const,
            content: m.text,
          };
        }

        return {
          role: "assistant" as const,
          content: m.text,
        };
      });

      const loadingId = generateId();

      // SOLO UN setSessions
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
              ...s,
              messages: [
                ...s.messages,
                userMsg,
                {
                  id: loadingId,
                  role: "ai",
                  text: "__loading__",
                  timestamp: new Date(),
                },
              ],
            }
            : s
        )
      );

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: apiMessages,
          }),
        });

        const data = await res.json();

        const aiText =
          data.text || data.error || "No pude procesar la consulta.";

        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSessionId
              ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === loadingId
                    ? {
                      ...m,
                      text: aiText,
                    }
                    : m
                ),
              }
              : s
          )
        );
      } catch {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSessionId
              ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === loadingId
                    ? {
                      ...m,
                      text:
                        "Error de conexión. Verifica tu internet e intenta de nuevo.",
                    }
                    : m
                ),
              }
              : s
          )
        );
      }
    },
    [activeSessionId, sessions]
  );

  const createSession = (name: string, crop: string) => {
    const colors = ["#3B6D11", "#D85A30", "#185FA5", "#854F0B", "#993556"];
    const newSession: ChatSession = {
      id: generateId(),
      name,
      crop,
      color: colors[sessions.length % colors.length],
      messages: [],
      createdAt: new Date(),
    };
    setSessions((prev) => [...prev, newSession]);
    setActiveSessionId(newSession.id);
    setView("chat");
    setShowNewSession(false);
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(sessions[0]?.id || "");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        view={view}
        onSelectSession={(id) => { setActiveSessionId(id); setView("chat"); }}
        onSetView={setView}
        onNewSession={() => setShowNewSession(true)}
        onDeleteSession={deleteSession}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <WeatherBar weather={weather} locating={locating} />

        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {view === "chat" && (
            <ChatView
              session={activeSession}
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={(id) => setActiveSessionId(id)}
              onSendMessage={sendMessage}
              onNewSession={() => setShowNewSession(true)}
            />
          )}
          {view === "crops" && <CropsView onAskAI={(text) => { setView("chat"); setTimeout(() => { }, 100); }} />}
          {view === "soil" && <SoilView onAskAI={() => setView("chat")} />}
          {view === "flow" && <FlowView onAskAI={() => setView("chat")} />}
        </div>
      </div>

      {showNewSession && (
        <NewSessionModal
          onClose={() => setShowNewSession(false)}
          onCreate={createSession}
        />
      )}
    </div>
  );
}
