"use client";

import { ChatSession, ViewType, CROP_EMOJIS } from "@/lib/types";

interface Props {
  sessions: ChatSession[];
  activeSessionId: string;
  view: ViewType;
  onSelectSession: (id: string) => void;
  onSetView: (v: ViewType) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
}

const navItems: { view: ViewType; label: string; badge: "free" | "premium"; icon: string }[] = [
  { view: "chat", label: "Asesor IA", badge: "premium", icon: "💬" },
  { view: "crops", label: "Guía de cultivos", badge: "free", icon: "🌾" },
  { view: "soil", label: "Tipo de suelo", badge: "free", icon: "🪨" },
  { view: "flow", label: "Cálculo de tiempo de riego", badge: "free", icon: "💧" },
];

export default function Sidebar({
  sessions, activeSessionId, view,
  onSelectSession, onSetView, onNewSession, onDeleteSession,
}: Props) {
  return (
    <aside style={{
      width: 256,
      background: "var(--sidebar-bg, #f7f6f1)",
      borderRight: "0.5px solid #e0ddd5",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: "18px 16px 14px", borderBottom: "0.5px solid #e0ddd5" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, background: "#3B6D11",
            borderRadius: 9, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 18,
          }}>🌱</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.3px" }}>HIDROCIENTE IA</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>Tu mejor aliado en el campo</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding: "10px 8px 4px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#aaa", padding: "0 8px 6px", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Herramientas
        </div>
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onSetView(item.view)}
            style={{
              display: "flex", alignItems: "center", gap: 9,
              width: "100%", padding: "8px 10px", borderRadius: 8,
              border: "none", background: view === item.view ? "#fff" : "transparent",
              cursor: "pointer", fontSize: 13.5,
              color: view === item.view ? "#1a1a18" : "#666",
              fontWeight: view === item.view ? 500 : 400,
              marginBottom: 2, textAlign: "left",
              boxShadow: view === item.view ? "0 0 0 0.5px #e0ddd5" : "none",
              transition: "all 0.12s",
            }}
          >
            <span style={{ fontSize: 15 }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            <span style={{
              fontSize: 10, padding: "2px 7px", borderRadius: 20, fontWeight: 500,
              background: item.badge === "premium" ? "#EEEDFE" : "#EAF3DE",
              color: item.badge === "premium" ? "#534AB7" : "#3B6D11",
            }}>
              {item.badge === "premium" ? "Premium" : "Gratis"}
            </span>
          </button>
        ))}
      </div>

      {/* New chat button */}
      <div style={{ padding: "8px 8px 4px" }}>
        <button
          onClick={onNewSession}
          style={{
            width: "100%", padding: "8px 10px", borderRadius: 8,
            border: "0.5px solid #d0cec5", background: "transparent",
            cursor: "pointer", fontSize: 13, color: "#666",
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "inherit", transition: "all 0.12s",
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#1a1a18"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#666"; }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>＋</span>
          Nuevo chat
        </button>
      </div>

      {/* Session list */}
      <div style={{ flex: 1, overflow: "auto", padding: "4px 8px 8px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#aaa", padding: "8px 8px 4px", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Mis cultivos
        </div>
        {sessions.map((s) => (
          <div
            key={s.id}
            onClick={() => onSelectSession(s.id)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "7px 10px", borderRadius: 8, cursor: "pointer",
              background: activeSessionId === s.id && view === "chat" ? "#fff" : "transparent",
              boxShadow: activeSessionId === s.id && view === "chat" ? "0 0 0 0.5px #e0ddd5" : "none",
              marginBottom: 2, transition: "all 0.12s",
            }}
            onMouseOver={(e) => { if (activeSessionId !== s.id) e.currentTarget.style.background = "rgba(255,255,255,0.6)"; }}
            onMouseOut={(e) => { if (activeSessionId !== s.id) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 16 }}>{CROP_EMOJIS[s.crop] || "🪴"}</span>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: activeSessionId === s.id ? 500 : 400, color: "#1a1a18", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {s.name}
              </div>

            </div>
            {sessions.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteSession(s.id); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 14, padding: "2px 4px", borderRadius: 4, lineHeight: 1 }}
                onMouseOver={(e) => { e.currentTarget.style.color = "#E24B4A"; }}
                onMouseOut={(e) => { e.currentTarget.style.color = "#ccc"; }}
                title="Eliminar chat"
              >×</button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: "10px 16px", borderTop: "0.5px solid #e0ddd5", fontSize: 11, color: "#bbb" }}>
        HIDROCIENTE IA · Lima, Perú
      </div>
    </aside>
  );
}
