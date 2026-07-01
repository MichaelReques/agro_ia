"use client";

import { useState } from "react";

interface Props {
  onAskAI: () => void;
}

const CROPS_REQ: Record<string, number> = {
  acelga: 4.5, lechuga: 5.5, tomate: 7, aji: 4.5,
  cebolla: 5, zanahoria: 4.5, espinaca: 4, pepino: 7.5,
  berenjena: 5.5, rabano: 3.5,
};

export default function FlowView({ onAskAI }: Props) {
  const [system, setSystem] = useState<"goteo" | "gravedad">("goteo");
  //const [drops, setDrops] = useState("");
  const [dripFlow, setDripFlow] = useState("4");
  const [drippers, setDrippers] = useState("");
  const [area, setArea] = useState("10000");
  const [crop, setCrop] = useState("acelga");
  const [bucketTime, setBucketTime] = useState("");
  const [bucketVol, setBucketVol] = useState("10");
  const [result, setResult] = useState<{ flow: number; hours: number; tip: string } | null>(null);

  const calculate = () => {
    const reqPerSqM = CROPS_REQ[crop] || 5;
    const areaNum = parseFloat(area) || 10000;
    const totalLNeeded = reqPerSqM * areaNum;

    let flowLMin = 0;
    let tip = "";

    if (system === "goteo") {
      /*const dropsN = parseFloat(drops);
      const drippersN = parseFloat(drippers);
      if (!dropsN || !drippersN) { alert("Ingresa el número de gotas y goteros."); return; }
      const mlPerMin = dropsN * 0.05;
      flowLMin = (mlPerMin * drippersN) / 1000;
      tip = "💡 Para riego por goteo, riega en la mañana (6–9 am) para reducir evaporación. Divide el riego en 2 turnos si supera 4 horas.";*/
      const dripFlowN = parseFloat(dripFlow);
      const drippersN = parseFloat(drippers);

      if (
        isNaN(dripFlowN) ||
        isNaN(drippersN) ||
        dripFlowN <= 0 ||
        drippersN <= 0
      ) {
        alert("Ingresa un caudal y un número de goteros válidos.");
        return;
      }

      // Convierte L/h a L/min
      flowLMin = (dripFlowN * drippersN) / 60;

      tip =
        "💡 Para riego por goteo, riega en la mañana (6–9 am) para reducir evaporación. Divide el riego en 2 turnos si supera 4 horas.";
    } else {
      const timeS = parseFloat(bucketTime);
      const volL = parseFloat(bucketVol);
      if (!timeS || !volL) { alert("Ingresa el tiempo y el volumen del balde."); return; }
      flowLMin = (volL / timeS) * 60;
      tip = "💡 Para riego por gravedad, nivela los surcos para distribuir el agua uniformemente. El inicio del canal no debe inundarse.";
    }

    const hours = totalLNeeded / (flowLMin * 60);
    setResult({ flow: Number(flowLMin.toFixed(2)), hours: Math.round(hours * 10) / 10, tip });
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>Calcula el tiempo de riego</h2>
          <p style={{ fontSize: 14, color: "#666" }}>
            Ingresa el caudal de cada gotero y el número total de goteros para estimar el tiempo de riego de tu cultivo.
          </p>
        </div>

        {/* System selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["goteo", "gravedad"] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setSystem(s); setResult(null); }}
              style={{
                padding: "9px 18px", borderRadius: 9, border: "none",
                background: system === s ? "#3B6D11" : "#fff",
                color: system === s ? "#fff" : "#666",
                fontFamily: "inherit", fontSize: 14, cursor: "pointer",
                fontWeight: system === s ? 500 : 400,
                boxShadow: system === s ? "none" : "0 0 0 0.5px #e0ddd5",
                transition: "all 0.15s",
              }}
            >
              {s === "goteo" ? "💧 Riego por goteo" : "🌊 Riego por gravedad"}
            </button>
          ))}
        </div>

        <div style={{ background: "#fff", border: "0.5px solid #e0ddd5", borderRadius: 14, padding: 22, marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            {system === "goteo" ? "📐 Datos del sistema de goteo" : "📐 Datos del riego por gravedad"}
          </h3>

          {system === "goteo" ? (
            <>
              <Field
                label="Caudal de cada gotero"
                hint="Revisa el caudal indicado por el fabricante del gotero (2, 4 u 8 L/h)"
                value={dripFlow}
                onChange={setDripFlow}
                unit="L/h"
                placeholder="Ej: 4"
              />
              <Field
                label="¿Cuántos goteros tiene tu sistema en total?"
                hint="Cuenta todos los goteros de tus mangueras"
                value={drippers}
                onChange={setDrippers}
                unit="goteros"
                placeholder="Ej: 200"
              />
            </>
          ) : (
            <>
              <Field
                label={`¿Cuántos segundos tarda en llenarse un balde de ${bucketVol} litros?`}
                hint="Pon el balde bajo el canal y mide el tiempo con tu celular"
                value={bucketTime}
                onChange={setBucketTime}
                unit="segundos"
                placeholder="Ej: 45"
              />
              <Field
                label="Capacidad del balde"
                value={bucketVol}
                onChange={setBucketVol}
                unit="litros"
                placeholder="Ej: 10"
              />
            </>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>
            <div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Cultivo</div>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                style={{
                  width: "100%", padding: "9px 10px", border: "0.5px solid #d0cec5",
                  borderRadius: 8, fontSize: 14, fontFamily: "inherit",
                  background: "#f7f6f1", color: "#1a1a18", outline: "none",
                }}
              >
                {Object.keys(CROPS_REQ).map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <Field
              label="Área de tu campo"
              value={area}
              onChange={setArea}
              unit="m²"
              placeholder="10000 = 1 hectárea"
            />
          </div>

          <button
            onClick={calculate}
            style={{
              marginTop: 18, background: "#3B6D11", color: "#fff", border: "none",
              borderRadius: 9, padding: "11px 20px", fontSize: 14,
              cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
              transition: "background 0.15s",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#27500A"}
            onMouseOut={(e) => e.currentTarget.style.background = "#3B6D11"}
          >
            Calcular tiempo de riego
          </button>
        </div>

        {result && (
          <div style={{ background: "#EAF3DE", border: "0.5px solid #97C459", borderRadius: 14, padding: 22, marginBottom: 16 }}>
            <h4 style={{ fontSize: 15, fontWeight: 600, color: "#27500A", marginBottom: 14 }}>📊 Resultados del cálculo</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, color: "#3B6D11", marginBottom: 4 }}>Caudal total del sistema</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#27500A" }}>{result.flow}</div>
                <div style={{ fontSize: 13, color: "#3B6D11" }}>litros/minuto</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, color: "#3B6D11", marginBottom: 4 }}>Tiempo de riego recomendado</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#27500A" }}>{result.hours}</div>
                <div style={{ fontSize: 13, color: "#3B6D11" }}>horas por turno</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#27500A", lineHeight: 1.6, marginBottom: 14 }}>{result.tip}</p>
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

        {/* Info cards */}
        <div style={{ background: "#fff", border: "0.5px solid #e0ddd5", borderRadius: 12, padding: 18 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>💡 Datos de referencia</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
            {Object.entries(CROPS_REQ).slice(0, 6).map(([c, req]) => (
              <div key={c} style={{ background: "#f7f6f1", borderRadius: 8, padding: "8px 12px" }}>
                <div style={{ fontSize: 12, color: "#888" }}>{c.charAt(0).toUpperCase() + c.slice(1)}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{req} L/m²/turno</div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
