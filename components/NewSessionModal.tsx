"use client";

import { useState } from "react";
import { CROP_EMOJIS } from "@/lib/types";

interface Props {
  onClose: () => void;
  onCreate: (name: string, crop: string) => void;
}

const CROPS = [...Object.keys(CROP_EMOJIS).filter((c) => c !== "otro"), "otro"];

export default function NewSessionModal({ onClose, onCreate }: Props) {
  const [crop, setCrop] = useState("acelga");
  const [name, setName] = useState("");

  const handleCreate = () => {
    const sessionName = name.trim() || `${crop.charAt(0).toUpperCase() + crop.slice(1)}`;
    onCreate(sessionName, crop);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100, backdropFilter: "blur(2px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 16, padding: 28,
          width: 420, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600 }}>Nuevo chat de cultivo</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#bbb", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#555", display: "block", marginBottom: 8 }}>¿Qué cultivo tienes?</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {CROPS.map((c) => (
              <button
                key={c}
                onClick={() => setCrop(c)}
                style={{
                  padding: "8px 4px", borderRadius: 9,
                  border: crop === c ? "2px solid #3B6D11" : "0.5px solid #e0ddd5",
                  background: crop === c ? "#EAF3DE" : "#fff",
                  cursor: "pointer", fontFamily: "inherit",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                  transition: "all 0.12s",
                }}
              >
                <span style={{ fontSize: 22 }}>{CROP_EMOJIS[c]}</span>
                <span style={{ fontSize: 11, color: crop === c ? "#27500A" : "#666" }}>
                  {c === "otro" ? "Otro" : c.charAt(0).toUpperCase() + c.slice(1)}
                </span>
              </button>
            ))}
          </div>
          <div style={{
            marginTop: 10, padding: "9px 12px", borderRadius: 8,
            background: "#f7f6f1", border: "0.5px solid #e0ddd5",
            fontSize: 12, color: "#888", lineHeight: 1.5,
          }}>
            💬 <strong style={{ color: "#555" }}>¿No está tu cultivo?</strong> No importa — en el chat puedes preguntar sobre <strong style={{ color: "#555" }}>cualquier cultivo</strong> libremente.
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#555", display: "block", marginBottom: 8 }}>
            Nombre del chat <span style={{ color: "#bbb", fontWeight: 400 }}>(opcional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`${crop.charAt(0).toUpperCase() + crop.slice(1)}`}
            style={{
              width: "100%", padding: "9px 12px", border: "0.5px solid #d0cec5",
              borderRadius: 8, fontSize: 14, fontFamily: "inherit",
              background: "#f7f6f1", color: "#1a1a18", outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "11px", borderRadius: 9,
              border: "0.5px solid #e0ddd5", background: "#fff",
              cursor: "pointer", fontFamily: "inherit", fontSize: 14, color: "#666",
            }}
          >Cancelar</button>
          <button
            onClick={handleCreate}
            style={{
              flex: 2, padding: "11px", borderRadius: 9, border: "none",
              background: "#3B6D11", color: "#fff", cursor: "pointer",
              fontFamily: "inherit", fontSize: 14, fontWeight: 500,
              transition: "background 0.15s",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#27500A"}
            onMouseOut={(e) => e.currentTarget.style.background = "#3B6D11"}
          >
            Crear chat {CROP_EMOJIS[crop]}
          </button>
        </div>
      </div>
    </div>
  );
}
