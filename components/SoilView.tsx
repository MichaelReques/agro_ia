"use client";

interface Props {
  onAskAI: () => void;
}

const SOILS = [
  {
    name: "Suelo arenoso",
    badge: { bg: "#EAF3DE", color: "#3B6D11", label: "Arenoso" },
    description: "No forma bola al amasar. Se desmorona fácilmente. Sientes granos rugosos entre los dedos.",
    riego: "Riega con más frecuencia pero con menor cantidad. El agua drena rápido y no retiene nutrientes.",
    fertilizacion: "Aplica fertilizantes fraccionados. Los nutrientes se lavan con el riego.",
    icon: "🏜️",
    cultivos: ["Zanahoria", "Rábano", "Espárrago"],
  },
  {
    name: "Suelo franco",
    badge: { bg: "#FAC775", color: "#633806", label: "Franco" },
    description: "Forma una bola suave que se puede moldear pero se quiebra al presionar con el dedo. Mezcla equilibrada.",
    riego: "Riego moderado y regular. El mejor tipo de suelo para la mayoría de hortalizas.",
    fertilizacion: "Retiene bien los nutrientes. La fertilización estándar funciona perfectamente.",
    icon: "🏞️​",
    cultivos: ["Tomate", "Lechuga", "Acelga", "Ají"],
  },
  {
    name: "Suelo arcilloso",
    badge: { bg: "#F5C4B3", color: "#712B13", label: "Arcilloso" },
    description: "Forma una bola firme como plastilina que no se agrieta. Se pega a los dedos. Muy compacto.",
    riego: "Riega menos frecuente. Retiene mucha agua. Alto riesgo de encharcamiento y asfixia de raíces.",
    fertilizacion: "Buena retención de nutrientes pero puede haber compactación. Agrega materia orgánica.",
    icon: "🧱",
    cultivos: ["Cebolla", "Espinaca"],
  },
];

export default function SoilView({ onAskAI }: Props) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>Identifica tu tipo de suelo</h2>
          <p style={{ fontSize: 14, color: "#666" }}>
            Haz esta prueba casera sencilla para saber qué tipo de suelo tienes y cómo ajustar tu riego.
          </p>
        </div>

        {/* Test steps */}
        <div style={{ background: "#fff", border: "0.5px solid #e0ddd5", borderRadius: 14, padding: 22, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>🧪 La prueba casera — 3 pasos</h3>
          {[
            "Toma un puñado de tierra de tu campo a unos 10 cm de profundidad.",
            "Humedece la tierra con un poco de agua hasta que puedas amasarla (no debe quedar ni seca ni empapada).",
            "Amasa la tierra en tu palma formando una bola y observa: ¿se desmorona? ¿se moldea suave? ¿queda como plastilina?",
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: "#EAF3DE", color: "#3B6D11",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 600, flexShrink: 0, marginTop: 1,
              }}>{i + 1}</div>
              <p style={{ fontSize: 14, color: "#444", lineHeight: 1.55 }}>{step}</p>
            </div>
          ))}
        </div>

        {/* Soil cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
          {SOILS.map((soil) => (
            <div key={soil.name} style={{ background: "#fff", border: "0.5px solid #e0ddd5", borderRadius: 12, padding: "18px 16px" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{soil.icon}</div>
              <div style={{
                display: "inline-block", fontSize: 11, padding: "3px 9px",
                borderRadius: 20, fontWeight: 500, marginBottom: 10,
                background: soil.badge.bg, color: soil.badge.color,
              }}>{soil.badge.label}</div>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 7 }}>{soil.name}</h4>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.5, marginBottom: 10 }}>{soil.description}</p>
              <div style={{ background: "#EAF3DE", borderRadius: 8, padding: "8px 10px", marginBottom: 7 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#3B6D11", marginBottom: 3 }}>💧 Riego</div>
                <p style={{ fontSize: 12, color: "#27500A", lineHeight: 1.4 }}>{soil.riego}</p>
              </div>
              <div style={{ background: "#fff9ed", borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#854F0B", marginBottom: 3 }}>🌿 Fertilización</div>
                <p style={{ fontSize: 12, color: "#633806", lineHeight: 1.4 }}>{soil.fertilizacion}</p>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>Cultivos recomendados:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {soil.cultivos.map((c) => (
                    <span key={c} style={{ fontSize: 11, background: "#f0efe8", padding: "2px 8px", borderRadius: 10, color: "#555" }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onAskAI}
          style={{
            background: "#3B6D11", color: "#fff", border: "none",
            borderRadius: 9, padding: "11px 20px", fontSize: 14,
            cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
            transition: "background 0.15s",
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "#27500A"}
          onMouseOut={(e) => e.currentTarget.style.background = "#3B6D11"}
        >
          Consultar a AgroIA sobre mi tipo de suelo ↗
        </button>
      </div>
    </div>
  );
}
