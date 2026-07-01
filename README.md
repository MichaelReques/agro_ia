# 🌱 AgroIA — Asesor de riego inteligente

App Next.js completa para asesoría agrícola con IA, dirigida a pequeños agricultores de Lima, Perú.

## ✅ Features incluidas

- **Chat IA Premium** — Consultas en lenguaje natural sobre riego y fertilización, con historial por cultivo/parcela
- **Análisis de fotos** — Sube una foto de tu planta y la IA diagnostica deficiencias nutricionales
- **Guía de cultivos (Gratis)** — 10 cultivos con requerimientos detallados, frecuencias, dosis y deficiencias comunes
- **Identificador de suelo (Gratis)** — Prueba casera para identificar suelo arenoso, franco o arcilloso
- **Calculadora de caudal (Gratis)** — Para riego por goteo y por gravedad, con tiempo de riego recomendado
- **Clima en tiempo real** — Usando Open-Meteo API (gratis, sin API key)
- **Sesiones múltiples** — Un chat por cultivo/parcela, con pestañas organizadas

## 🚀 Cómo correr el proyecto

### 1. Instala dependencias (ya incluidas)
```bash
npm install
```

### 2. Configura tu API key de Anthropic
Edita el archivo `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

Consigue tu API key en: https://console.anthropic.com

### 3. Corre el servidor de desarrollo
```bash
npm run dev
```

Abre http://localhost:3000

### 4. Para producción
```bash
npm run build
npm start
```

## 🌐 Deploy en Vercel (recomendado)

1. Sube el proyecto a GitHub
2. Ve a https://vercel.com y conecta tu repo
3. En "Environment Variables" agrega:
   - `ANTHROPIC_API_KEY` = tu API key
4. Deploy automático ✅

## 📁 Estructura del proyecto

```
agroia/
├── app/
│   ├── api/
│   │   ├── chat/route.ts        # Endpoint de la IA (Anthropic)
│   │   └── weather/route.ts     # Clima en tiempo real (Open-Meteo)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AgroApp.tsx              # Componente principal con estado global
│   ├── Sidebar.tsx              # Barra lateral con navegación e historial
│   ├── WeatherBar.tsx           # Barra de clima en tiempo real
│   ├── ChatView.tsx             # Vista de chat con tabs y upload de fotos
│   ├── CropsView.tsx            # Guía de 10 cultivos (gratis)
│   ├── SoilView.tsx             # Identificador de tipo de suelo (gratis)
│   ├── FlowView.tsx             # Calculadora de caudal (gratis)
│   └── NewSessionModal.tsx      # Modal para crear nuevo chat de cultivo
└── lib/
    ├── types.ts                 # TypeScript types e interfaces
    └── crops.ts                 # Data de los 10 cultivos
```

## 💰 Costos estimados

- **Anthropic API**: ~$0.003 por conversación (claude-sonnet-4-6)
- **Open-Meteo**: Gratis ilimitado
- **Vercel hosting**: Gratis en plan hobby

## 🔧 Personalización fácil

- Agrega más cultivos en `lib/crops.ts`
- Cambia el system prompt en `app/api/chat/route.ts`
- Cambia las coordenadas del clima en `app/api/weather/route.ts`
