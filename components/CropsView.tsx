"use client";

import { useState } from "react";
import { CROPS } from "@/lib/crops";

interface Props {
  onAskAI: (text: string) => void;
}

export default function CropsView({ onAskAI }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = CROPS.find((c) => c.id === selectedId);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>Guía de cultivos</h2>
          <p style={{ fontSize: 14, color: "#666" }}>
            Selecciona un cultivo para ver sus requerimientos de riego, fertilización y consejos clave.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 20 }}>
          {CROPS.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(selectedId === c.id ? null : c.id)}
              style={{
                background: selectedId === c.id ? "#EAF3DE" : "#fff",
                border: selectedId === c.id ? "1.5px solid #3B6D11" : "0.5px solid #e0ddd5",
                borderRadius: 12, padding: "16px 12px", cursor: "pointer",
                textAlign: "center", fontFamily: "inherit",
                transition: "all 0.15s",
              }}
              onMouseOver={(e) => { if (selectedId !== c.id) { e.currentTarget.style.borderColor = "#97C459"; e.currentTarget.style.background = "#f9fdf4"; } }}
              onMouseOut={(e) => { if (selectedId !== c.id) { e.currentTarget.style.borderColor = "#e0ddd5"; e.currentTarget.style.background = "#fff"; } }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{c.emoji}</div>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: "#1a1a18" }}>{c.name}</div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{c.type}</div>
            </button>
          ))}
        </div>

        {selected && (
          <div style={{
            background: "#fff", border: "0.5px solid #e0ddd5",
            borderRadius: 14, padding: 22, marginTop: 4,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div style={{ fontSize: 44 }}>{selected.emoji}</div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600 }}>{selected.name}</h3>
                <p style={{ fontSize: 13, color: "#888" }}>{selected.type}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                { icon: "💧", label: "Necesidad de agua", val: selected.agua },
                { icon: "🚿", label: "Sistema de riego", val: selected.riego },
                { icon: "📅", label: "Ciclo de cultivo", val: selected.ciclo },
                { icon: "⏱️", label: "Frecuencia de riego", val: selected.frecuencia },
                { icon: "🪣", label: "Dosis de agua", val: selected.dosis },
              ].map((item) => (
                <div key={item.label} style={{ background: "#f7f6f1", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 5 }}>{item.icon} {item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{item.val}</div>
                </div>
              ))}
              <div style={{ background: "#f7f6f1", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 5 }}>🌿 Fertilización</div>
                <div style={{ fontSize: 13, lineHeight: 1.4 }}>{selected.fertilizacion}</div>
              </div>
            </div>

            <div style={{ background: "#EAF3DE", border: "0.5px solid #97C459", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#3B6D11", marginBottom: 5 }}>💡 Consejo clave</div>
              <div style={{ fontSize: 13.5, color: "#27500A", lineHeight: 1.55 }}>{selected.tip}</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 8 }}>
                ⚠️ Deficiencias nutricionales comunes
              </div>
              {selected.deficiencias.map((d, i) => (
                <div key={i} style={{
                  fontSize: 13, color: "#555", padding: "6px 12px",
                  background: "#fff9ed", borderRadius: 8, marginBottom: 5,
                  border: "0.5px solid #FAC775",
                }}>
                  {d}
                </div>
              ))}
            </div>

            <button
              onClick={() => onAskAI(`¿Cuáles son las recomendaciones de riego y fertilización para ${selected.name}?`)}
              style={{
                background: "#3B6D11", color: "#fff", border: "none",
                borderRadius: 9, padding: "10px 18px", fontSize: 14,
                cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
                transition: "background 0.15s",
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "#27500A"}
              onMouseOut={(e) => e.currentTarget.style.background = "#3B6D11"}
            >
              Consultar a AgroIA sobre {selected.name} ↗
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
