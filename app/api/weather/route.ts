import { NextResponse } from "next/server";

// Uses Open-Meteo (free, no API key needed)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat") || "-12.1044";
    const lon = searchParams.get("lon") || "-76.8783";

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=America%2FLima`;

    const res = await fetch(url, { next: { revalidate: 1800 } });
    const data = await res.json();

    const current = data.current;
    const temp = Math.round(current.temperature_2m);
    const hum = Math.round(current.relative_humidity_2m);
    const wind = Math.round(current.wind_speed_10m);
    const wCode = current.weather_code;

    let rec = "";
    if (hum > 75) rec = "Alta humedad, reduce el riego hoy";
    else if (temp > 25) rec = "Día cálido, riega temprano en la mañana";
    else if (wCode >= 61) rec = "Lluvia esperada, suspende el riego";
    else rec = "Buen día para riego por goteo";

    return NextResponse.json({ temp, hum, wind, rec });
  } catch {
    return NextResponse.json({ temp: 22, hum: 68, wind: 12, rec: "Buen día para riego por goteo" });
  }
}
