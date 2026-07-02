"use client";

import { useState } from "react";

interface Props {
  onAskAI: () => void;
}

type KnowsFlow = "si" | "no" | null;
type Intensity = "ligero" | "normal" | "profundo";

const INTENSITY = {
  ligero: { mm: 3, label: "🌿 Riego ligero", desc: "Para humedecer el suelo" },
  normal: { mm: 5, label: "💧 Riego normal", desc: "Uso diario recomendado" },
  profundo: { mm: 7, label: "🌧 Riego profundo", desc: "Después de varios días sin regar" },
};

type Result = {
  flowPerDripperLh: number;
  totalFlowLh: number;
  totalFlowM3h: number;
  timeHours: number;
  density: number;
  warning?: string;
};

export default function FlowView({ onAskAI }: Props) {
  const [knowsFlow, setKnowsFlow] = useState<KnowsFlow>(null);
  const [flowLh, setFlowLh] = useState("4");         // caudal conocido L/h
  const [mlIn15, setMlIn15] = useState("");           // mL recolectados en 15 min
  const [drippers, setDrippers] = useState("");
  const [area, setArea] = useState("");
  const [intensity, setIntensity] = useState<Intensity>("normal");
  const [result, setResult] = useState<Result | null>(null);

  const calculate = () => {
    // Validaciones
    if (!knowsFlow) { alert("Indica si conoces el caudal de tu gotero."); return; }
    if (!drippers || parseFloat(drippers) <= 0) { alert("Ingresa el número de goteros."); return; }
    if (!area || parseFloat(area) <= 0) { alert("Ingresa el área de tu campo."); return; }

    let dripperFlowLh = 0;

    if (knowsFlow === "si") {
      dripperFlowLh = parseFloat(flowLh);
      if (!dripperFlowLh || dripperFlowLh <= 0) { alert("Ingresa el caudal del gotero."); return; }
    } else {
      const ml = parseFloat(mlIn15);
      if (!ml || ml <= 0) { alert("Ingresa los mL recolectados en 15 minutos."); return; }
      // mL en 15 min → L/h
      dripperFlowLh = (ml / 1000) * 4;
    }

    const drippersN = parseFloat(drippers);
    const areaNum = parseFloat(area);
    const laminaMm = INTENSITY[intensity].mm;

    // Caudal total del sistema en L/h
    const totalFlowLh = dripperFlowLh * drippersN;
    const totalFlowM3h = totalFlowLh / 1000;

    // Volumen necesario: lámina (mm) × área (m²) = litros (1mm × 1m² = 1L)
    const totalLNeeded = laminaMm * areaNum;

    // Tiempo en horas
    const timeHours = totalLNeeded / totalFlowLh;

    // Densidad de goteros
    const density = drippersN / areaNum;

    let warning: string | undefined;
    if (density < 0.5) {
      warning = "⚠️ La cantidad de goteros parece baja para el área ingresada. Revise los datos antes de regar.";
    } else if (timeHours > 24) {
      warning = "⚠️ El tiempo calculado supera 24 horas. El sistema puede no tener suficiente caudal para el área ingresada.";
    }

    setResult({
      flowPerDripperLh: Math.round(dripperFlowLh * 100) / 100,
      totalFlowLh: Math.round(totalFlowLh),
      totalFlowM3h: Math.round(totalFlowM3h * 100) / 100,
      timeHours: Math.round(timeHours * 10) / 10,
      density: Math.round(density * 100) / 100,
      warning,
    });
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>

        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>
            🌱 Calculadora de tiempo estimado de riego
          </h2>
          <p style={{ fontSize: 14, color: "#666" }}>
            Responde paso a paso y te diremos cuánto tiempo regar.
          </p>
        </div>

        {/* PASO 1 */}
        <Step number={1} title="¿Conoce el caudal de su gotero?">
          <div style={{ display: "flex", gap: 10, marginBottom: knowsFlow ? 16 : 0 }}>
            {(["si", "no"] as const).map((v) => (
              <button
                key={v}
                onClick={() => { setKnowsFlow(v); setResult(null); }}
                style={{
                  padding: "8px 22px", borderRadius: 8, border: "none",
                  background: knowsFlow === v ? "#3B6D11" : "#f0efe8",
                  color: knowsFlow === v ? "#fff" : "#555",
                  fontFamily: "inherit", fontSize: 14, cursor: "pointer",
                  fontWeight: knowsFlow === v ? 500 : 400, transition: "all 0.15s",
                }}
              >
                {v === "si" ? "Sí" : "No"}
              </button>
            ))}
          </div>

          {knowsFlow === "si" && (
            <Field
              label="Caudal del gotero"
              hint='Ejemplo: 2 L/h, 4 L/h o 8 L/h'
              value={flowLh}
              onChange={(v) => { setFlowLh(v); setResult(null); }}
              unit="L/h"
              placeholder="Ej: 4"
            />
          )}

          {knowsFlow === "no" && (
            <div>
              <div style={{ background: "#f7f6f1", borderRadius: 10, padding: "14px 16px", marginBottom: 14, fontSize: 13, color: "#555", lineHeight: 1.7 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: "#1a1a18" }}>Mida el caudal en 4 pasos:</div>
                {[
                  "Coloque un recipiente debajo de un solo gotero.",
                  "Abra el sistema de riego.",
                  "Espere exactamente 15 minutos.",
                  "Mida cuántos mililitros (mL) se recolectaron e ingréselos abajo.",
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 4 }}>
                    <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#EAF3DE", color: "#3B6D11", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
              <Field
                label="Agua recolectada en 15 minutos"
                value={mlIn15}
                onChange={(v) => { setMlIn15(v); setResult(null); }}
                unit="mL"
                placeholder="Ej: 1000"
              />
            </div>
          )}
        </Step>

        {/* PASO 2 */}
        <Step number={2} title="¿Cuántos goteros tiene instalados?">
          <Field
            label="Número total de goteros"
            value={drippers}
            onChange={(v) => { setDrippers(v); setResult(null); }}
            unit="goteros"
            placeholder="Ej: 2200"
          />
        </Step>

        {/* PASO 3 */}
        <Step number={3} title="Área del terreno">
          <Field
            label="Área del campo"
            value={area}
            onChange={(v) => { setArea(v); setResult(null); }}
            unit="m²"
            placeholder="Ej: 10000 (= 1 hectárea)"
          />
        </Step>

        {/* PASO 4 */}
        <Step number={4} title="Cantidad de agua que desea aplicar">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(Object.entries(INTENSITY) as [Intensity, typeof INTENSITY[Intensity]][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => { setIntensity(key); setResult(null); }}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px", borderRadius: 10, cursor: "pointer",
                  border: intensity === key ? "1.5px solid #3B6D11" : "0.5px solid #e0ddd5",
                  background: intensity === key ? "#EAF3DE" : "#fff",
                  fontFamily: "inherit", textAlign: "left", transition: "all 0.15s",
                }}
              >
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${intensity === key ? "#3B6D11" : "#ccc"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {intensity === key && <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#3B6D11" }} />}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#1a1a18" }}>{val.label}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{val.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </Step>

        {/* Botón calcular */}
        <button
          onClick={calculate}
          style={{
            width: "100%", marginBottom: 20, background: "#3B6D11", color: "#fff",
            border: "none", borderRadius: 10, padding: "13px", fontSize: 15,
            cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
            transition: "background 0.15s",
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "#27500A"}
          onMouseOut={(e) => e.currentTarget.style.background = "#3B6D11"}
        >
          Calcular tiempo de riego
        </button>

        {/* RESULTADOS */}
        {result && (
          <div style={{
            background: result.warning ? "#FFF9ED" : "#EAF3DE",
            border: `0.5px solid ${result.warning ? "#FAC775" : "#97C459"}`,
            borderRadius: 14, padding: 22, marginBottom: 20,
          }}>
            <h4 style={{ fontSize: 15, fontWeight: 600, color: "#27500A", marginBottom: 16 }}>📊 Resultados</h4>

            {result.warning && (
              <div style={{ background: "#FEF3CD", border: "0.5px solid #FAC775", borderRadius: 10, padding: "11px 14px", marginBottom: 14, fontSize: 13, color: "#854F0B", lineHeight: 1.5 }}>
                {result.warning}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <ResultCard icon="💧" label="Caudal del gotero" value={`${result.flowPerDripperLh} L/h`} />
              <ResultCard icon="🚰" label="Caudal total del sistema" value={`${result.totalFlowLh.toLocaleString()} L/h`} sub={`${result.totalFlowM3h} m³/h`} />
              <ResultCard icon="⏱" label="Tiempo estimado de riego" value={`${result.timeHours} horas`} highlight />
              <ResultCard icon="📊" label="Densidad de goteros" value={`${result.density} goteros/m²`} />
            </div>

            <p style={{ fontSize: 12, color: "#888", lineHeight: 1.5, marginBottom: 14 }}>
              El tiempo mostrado es una estimación basada en la cantidad de agua seleccionada. Puede variar según el cultivo, el tipo de suelo y las condiciones climáticas.
            </p>

            <button
              onClick={onAskAI}
              style={{
                background: "rgba(255,255,255,0.5)", color: "#3B6D11",
                border: "0.5px solid #97C459", borderRadius: 8,
                padding: "8px 14px", fontSize: 13, cursor: "pointer",
                fontFamily: "inherit", fontWeight: 500,
              }}
            >
              Consultar a AgroIA para más detalles ↗
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "0.5px solid #e0ddd5", borderRadius: 14, padding: 20, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#3B6D11", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
          {number}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a18" }}>{title}</div>
      </div>
      {children}
    </div>
  );
}

function ResultCard({ icon, label, value, sub, highlight }: { icon: string; label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div style={{ background: highlight ? "rgba(59,109,17,0.12)" : "rgba(255,255,255,0.6)", borderRadius: 10, padding: "13px 15px", border: highlight ? "0.5px solid #97C459" : "none" }}>
      <div style={{ fontSize: 11, color: "#3B6D11", marginBottom: 4 }}>{icon} {label}</div>
      <div style={{ fontSize: highlight ? 24 : 18, fontWeight: 700, color: "#27500A" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#3B6D11", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Field({ label, hint, value, onChange, unit, placeholder }: {
  label: string; hint?: string; value: string;
  onChange: (v: string) => void; unit: string; placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, color: "#444", marginBottom: 4, fontWeight: 500 }}>{label}</div>
      {hint && <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}>{hint}</div>}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1, padding: "9px 10px", border: "0.5px solid #d0cec5",
            borderRadius: 8, fontSize: 14, fontFamily: "inherit",
            background: "#f7f6f1", color: "#1a1a18", outline: "none",
          }}
          onFocus={(e) => e.target.style.borderColor = "#97C459"}
          onBlur={(e) => e.target.style.borderColor = "#d0cec5"}
        />
        <span style={{ fontSize: 13, color: "#888", whiteSpace: "nowrap" }}>{unit}</span>
      </div>
    </div>
  );
}