"use client";

import { useRef, useEffect, useState } from "react";
import { ChatSession, Message, CROP_EMOJIS } from "@/lib/types";

interface Props {
  session: ChatSession;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onSendMessage: (text: string, imgSrc?: string) => void;
  onNewSession: () => void;
}

const SUGGESTIONS = [
  { icon: "🌿", title: "Hojas amarillas", text: "Mis plantas tienen las hojas amarillas. ¿Qué puede ser?" },
  { icon: "💧", title: "¿Cuánto riego?", text: "¿Cuántas horas debo regar con goteo por día en esta época?" },
  { icon: "🧪", title: "Fertilización", text: "¿Qué fertilizante necesita mi cultivo y cómo aplicarlo?" },
  { icon: "📸", title: "Analiza mi planta", text: "Quiero subir una foto de mi planta para que la analices" },
];

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n(\d+)\. /g, "\n<br/>$1. ")
    .replace(/\n- /g, "\n<br/>• ")
    .replace(/\n/g, "<br/>");
}

export default function ChatView({ session, sessions, activeSessionId, onSelectSession, onSendMessage, onNewSession }: Props) {
  const [inputText, setInputText] = useState("");
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text && !pendingPhoto) return;
    onSendMessage(text, pendingPhoto || undefined);
    setInputText("");
    setPendingPhoto(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPendingPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 130) + "px";
  };

  const isLoading = session?.messages.some((m) => m.text === "__loading__");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Session tabs */}
      <div style={{
        display: "flex", background: "#fff",
        borderBottom: "0.5px solid #e8e6de", overflowX: "auto",
        flexShrink: 0, gap: 0,
      }}>
        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelectSession(s.id)}
            style={{
              padding: "10px 16px", border: "none", background: "transparent",
              cursor: "pointer", fontSize: 13.5, whiteSpace: "nowrap",
              color: activeSessionId === s.id ? "#3B6D11" : "#888",
              fontWeight: activeSessionId === s.id ? 600 : 400,
              borderBottom: activeSessionId === s.id ? "2px solid #3B6D11" : "2px solid transparent",
              transition: "all 0.12s", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <span>{CROP_EMOJIS[s.crop] || "🪴"}</span>
            {s.name}
          </button>
        ))}
        <button
          onClick={onNewSession}
          style={{
            padding: "10px 14px", border: "none", background: "transparent",
            cursor: "pointer", fontSize: 13, color: "#bbb",
            borderBottom: "2px solid transparent", fontFamily: "inherit",
            transition: "color 0.12s",
          }}
          onMouseOver={(e) => e.currentTarget.style.color = "#3B6D11"}
          onMouseOut={(e) => e.currentTarget.style.color = "#bbb"}
        >
          + Nuevo cultivo
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 0" }}>
        {(!session?.messages || session.messages.length === 0) ? (
          <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 24px" }}>
            <div style={{ fontSize: 30, marginBottom: 12 }}>{CROP_EMOJIS[session?.crop] || "🌱"}</div>
            <div style={{ fontSize: 21, fontWeight: 600, marginBottom: 8 }}>
              Hola, soy tu asesor agrícola
            </div>
            <div style={{ fontSize: 15, color: "#666", lineHeight: 1.6, marginBottom: 28 }}>
              Cuéntame Puedo ayudarte con el riego, la fertilización, y el diagnóstico de problemas.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setInputText(s.text)}
                  style={{
                    background: "#fff", border: "0.5px solid #e0ddd5",
                    borderRadius: 12, padding: "14px 16px", cursor: "pointer",
                    fontSize: 13, color: "#666", textAlign: "left",
                    fontFamily: "inherit", transition: "all 0.15s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#97C459";
                    e.currentTarget.style.background = "#EAF3DE";
                    e.currentTarget.style.color = "#1a1a18";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#e0ddd5";
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = "#666";
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontWeight: 600, color: "#1a1a18", marginBottom: 3 }}>{s.title}</div>
                  <div>{s.text}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px" }}>
            {session.messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div style={{
        background: "#fff", borderTop: "0.5px solid #e8e6de",
        padding: "12px 20px 16px", flexShrink: 0,
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {pendingPhoto && (
            <div style={{ marginBottom: 10, display: "flex", gap: 8 }}>
              <div style={{ position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pendingPhoto}
                  alt="Foto a analizar"
                  style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "0.5px solid #e0ddd5" }}
                />
                <button
                  onClick={() => setPendingPhoto(null)}
                  style={{
                    position: "absolute", top: -7, right: -7,
                    width: 20, height: 20, borderRadius: "50%",
                    background: "#E24B4A", color: "#fff", border: "none",
                    cursor: "pointer", fontSize: 12, display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}
                >×</button>
              </div>
              <div style={{ fontSize: 12, color: "#888", alignSelf: "center" }}>
                La IA analizará esta foto de tu planta
              </div>
            </div>
          )}

          <div style={{
            display: "flex", gap: 8, alignItems: "flex-end",
            background: "#f7f6f1", border: "0.5px solid #d0cec5",
            borderRadius: 12, padding: "8px 8px 8px 14px",
            transition: "border-color 0.15s",
          }}
            onFocus={() => {}}
          >
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => { setInputText(e.target.value); autoResize(); }}
              onKeyDown={handleKey}
              placeholder="Describe tu cultivo, tu riego o tu problema..."
              rows={1}
              style={{
                flex: 1, border: "none", background: "transparent",
                resize: "none", fontSize: 14, fontFamily: "inherit",
                color: "#1a1a18", outline: "none", lineHeight: 1.55,
                minHeight: 22, maxHeight: 130, padding: "2px 0",
              }}
            />
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Subir foto de planta"
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: "0.5px solid #d0cec5", background: "transparent",
                  cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 16, transition: "all 0.12s",
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = "#fff"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; }}
              >📸</button>
              <button
                onClick={handleSend}
                disabled={isLoading || (!inputText.trim() && !pendingPhoto)}
                style={{
                  width: 32, height: 32, borderRadius: 8, border: "none",
                  background: isLoading || (!inputText.trim() && !pendingPhoto) ? "#d0cec5" : "#3B6D11",
                  cursor: isLoading || (!inputText.trim() && !pendingPhoto) ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s", flexShrink: 0,
                }}
              >
                <svg width="15" height="15" fill="none" stroke="#fff" strokeWidth="2.2" viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#bbb", textAlign: "center", marginTop: 7 }}>
            AgroIA puede analizar fotos de tus plantas · Presiona Enter para enviar
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handlePhoto}
      />
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  const isLoading = msg.text === "__loading__";

  return (
    <div style={{
      display: "flex", gap: 12, marginBottom: 22,
      flexDirection: isUser ? "row-reverse" : "row",
      alignItems: "flex-start",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
        background: isUser ? "#B5D4F4" : "#EAF3DE",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15,
      }}>
        {isUser ? "👤" : "🌱"}
      </div>
      <div style={{ maxWidth: "calc(100% - 50px)" }}>
        <div style={{ fontSize: 12, color: "#bbb", marginBottom: 4, textAlign: isUser ? "right" : "left" }}>
          {isUser ? "Tú" : "AgroIA"}
        </div>
        {isLoading ? (
          <div style={{
            background: "#fff", border: "0.5px solid #e0ddd5",
            borderRadius: 12, padding: "12px 16px", display: "inline-flex", gap: 5,
          }}>
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        ) : (
          <>
            <div
              className={isUser ? undefined : "ai-text"}
              style={{
                background: isUser ? "#3B6D11" : "#fff",
                color: isUser ? "#fff" : "#1a1a18",
                border: isUser ? "none" : "0.5px solid #e0ddd5",
                borderRadius: 12, padding: "10px 15px",
                fontSize: 14, lineHeight: 1.65, display: "inline-block",
                textAlign: "left",
              }}
              dangerouslySetInnerHTML={{ __html: isUser ? msg.text : renderMarkdown(msg.text) }}
            />
            {msg.imgSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={msg.imgSrc}
                alt="Foto de planta"
                style={{ display: "block", marginTop: 8, maxWidth: 220, borderRadius: 10, border: "0.5px solid #e0ddd5" }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
