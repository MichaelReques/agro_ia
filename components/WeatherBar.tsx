"use client";

import { WeatherData } from "@/lib/types";

interface Props {
  weather: WeatherData | null;
  locating: boolean;
}

export default function WeatherBar({ weather, locating }: Props) {
  return (
    <div style={{
      background: "#fff",
      borderBottom: "0.5px solid #e8e6de",
      padding: "7px 20px",
      display: "flex",
      alignItems: "center",
      gap: 20,
      fontSize: 13,
      color: "#666",
      flexShrink: 0,
    }}>
      {locating ? (
        <div style={{ fontSize: 12, color: "#bbb" }}>📍 Obteniendo tu ubicación...</div>
      ) : weather ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span>📍</span>
            <span style={{ fontWeight: 500, color: "#1a1a18" }}>
              {weather.locationName || "Tu ubicación"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span>☀️</span>
            <span>{weather.temp}°C</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span>💧</span>
            <span>{weather.hum}% hum.</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span>🌬️</span>
            <span>{weather.wind} km/h</span>
          </div>
          <div style={{ marginLeft: "auto", fontWeight: 500, color: "#3B6D11", fontSize: 12 }}>
            {weather.rec}
          </div>
        </>
      ) : (
        <div style={{ fontSize: 12, color: "#bbb" }}>Cargando datos climáticos...</div>
      )}
    </div>
  );
}
