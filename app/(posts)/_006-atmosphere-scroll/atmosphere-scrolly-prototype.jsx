"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// ─── Scale & Constants ───────────────────────────────────────────────
const MAX_ALTITUDE_KM = 550;
// Ocean height is computed dynamically as 50vh inside the component

const PX_PER_KM = 200;

function altitudeToPixels(km) {
  return Math.max(0, km * PX_PER_KM);
}

function pixelsToAltitude(px) {
  return Math.max(0, px / PX_PER_KM);
}

const ATM_HEIGHT = altitudeToPixels(MAX_ALTITUDE_KM) + 400; // atmosphere portion only

// ─── Atmosphere Data ─────────────────────────────────────────────────
const layers = [
  {
    name: "Troposphere",
    startKm: 0,
    endKm: 12,
    color: "rgba(135, 206, 235, 0.12)",
    description:
      "Where all weather happens. Temperature drops about 6.5°C (11.7°F) for every kilometer you climb.",
    climateNote:
      "This layer is warming fastest — about 0.2°C (0.36°F) per decade near the surface. More moisture, stronger storms, shifting jet streams.",
  },
  {
    name: "Stratosphere",
    startKm: 12,
    endKm: 50,
    color: "rgba(100, 149, 237, 0.08)",
    description:
      "Calm, stable air. Commercial jets cruise near the bottom. The ozone layer lives here, absorbing UV and warming the air.",
    climateNote:
      "Counterintuitively, this layer is cooling as CO₂ radiates more heat to space. The ozone layer is slowly recovering from CFCs.",
  },
  {
    name: "Mesosphere",
    startKm: 50,
    endKm: 85,
    color: "rgba(72, 61, 139, 0.08)",
    description:
      "The coldest place in Earth's atmosphere, dropping to −90°C (−130°F). Meteors burn up here — the 'shooting stars' you see.",
    climateNote:
      "Cooling and contracting. Noctilucent clouds — ice crystals at 80 km — are appearing more often, possibly a fingerprint of climate change.",
  },
  {
    name: "Thermosphere",
    startKm: 85,
    endKm: 500,
    color: "rgba(25, 25, 80, 0.06)",
    description:
      "Temperatures soar above 1000°C (1832°F), but with so few molecules you wouldn't feel warm. The ISS orbits here. Auroras shimmer through this layer.",
    climateNote:
      "CO₂ increase is causing this layer to cool and contract — satellites experience less drag, which changes their orbital decay rates.",
  },
];

const landmarks = [
  { km: 0, label: "Sea level", detail: "1013 hPa · 15°C (59°F) · where you are now" },
  { km: 0.8, label: "Burj Khalifa", detail: "The tallest building on Earth (828 m)" },
  { km: 5.895, label: "Mount Kilimanjaro", detail: "Africa's tallest mountain (5,895 m)" },
  { km: 5.5, label: "Half the atmosphere by mass", detail: "Half of all air molecules are below this point" },
  { km: 8.8, label: "Mount Everest", detail: "8,849 m — air pressure is 1/3 of sea level" },
  { km: 10, label: "Cruising altitude", detail: "Where commercial jets fly · about −50°C (−58°F) outside" },
  { km: 12, label: "Tropopause", detail: "The boundary where weather ends and the stratosphere begins", isBoundary: true },
  { km: 20, label: "Ozone layer begins", detail: "Peak ozone concentration is around 20–25 km" },
  { km: 35, label: "Peak ozone density", detail: "Maximum O₃ concentration — blocks UV-B and UV-C" },
  { km: 39, label: "Felix Baumgartner's jump", detail: "Jumped from 39 km in 2012, broke the sound barrier in freefall" },
  { km: 50, label: "Stratopause", detail: "Temperature peaks here (~0°C / 32°F) before dropping again", isBoundary: true },
  { km: 80, label: "Noctilucent clouds", detail: "Earth's highest clouds — ice crystals glowing after sunset" },
  { km: 85, label: "Mesopause", detail: "The coldest point in the atmosphere: around −90°C (−130°F)", isBoundary: true },
  { km: 100, label: "Kármán line", detail: "The internationally recognized edge of space" },
  { km: 110, label: "Auroras begin", detail: "Northern and southern lights shimmer from ~110–500 km" },
  { km: 408, label: "International Space Station", detail: "Orbiting at ~408 km · still technically in the atmosphere" },
];


// ─── Chapter Breaks ──────────────────────────────────────────────────
// Each boundary has an array of lines that scroll through one at a time.
const CHAPTER_BREAKS = {
  12: {
    lines: [
      "You've reached the tropopause, at about 12 km.",
      "This is where weather ends.",
      "Below here, temperature falls with altitude — warm air rises, cold air sinks, and the atmosphere churns.",
      "Above here, temperature starts to rise. The air becomes stable, layered, and still.",
      "Almost everything you think of as \"weather\" — clouds, rain, wind, storms — is confined to the layer you just passed through.",
    ],
  },
  50: {
    lines: [
      "You've reached the stratopause, at about 50 km.",
      "You just passed through the ozone layer — a thin veil of O₃ that absorbs the sun's ultraviolet radiation.",
      "That absorption is why temperatures rose through the stratosphere.",
      "Above here, without ozone to capture sunlight, temperatures plummet again.",
    ],
  },
  85: {
    lines: [
      "You've reached the mesopause, at about 85 km.",
      "This is the coldest point in the atmosphere.",
      "Like the troposphere, the mesosphere's temperature decreases with height, allowing for mixing.",
      "Shooting stars burn up here — bits of cosmic debris incinerated by friction with the thin remaining air.",
      "Above this line, the rules change. Molecules are so sparse that temperature loses its everyday meaning.",
    ],
  },
  100: {
    lines: [
      "You've crossed the Kármán line — 100 km.",
      "This is the internationally recognized boundary of space.",
      "Below here, aerodynamics works. Above here, only orbital mechanics matter.",
      "And yet, the atmosphere doesn't truly end. It just... fades.",
    ],
  },
};

// ─── Physics Helpers ─────────────────────────────────────────────────
function getTemperature(km) {
  if (km <= 12) return 15 - 6.5 * km;
  if (km <= 20) return -56.5;
  if (km <= 50) return -56.5 + ((km - 20) / 30) * 56.5;
  if (km <= 85) return 0 - ((km - 50) / 35) * 90;
  if (km <= 150) return -90 + ((km - 85) / 65) * 590;
  return 500 + ((km - 150) / 350) * 1000;
}

function getPressure(km) {
  return 1013 * Math.exp(-km / 8.5);
}

function cToF(celsius) {
  return (celsius * 9) / 5 + 32;
}

function formatTempWithF(celsius, digits = 0) {
  const fahrenheit = cToF(celsius);
  return `${celsius.toFixed(digits)}°C (${fahrenheit.toFixed(digits)}°F)`;
}

// ─── Color Helpers ───────────────────────────────────────────────────
function lerpColor(a, b, t) {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)}, ${Math.round(a[1] + (b[1] - a[1]) * t)}, ${Math.round(a[2] + (b[2] - a[2]) * t)})`;
}

function getBackgroundColor(km) {
  if (km < 5) return lerpColor([166, 210, 240], [120, 180, 230], km / 5);
  if (km < 12) return lerpColor([120, 180, 230], [70, 120, 200], (km - 5) / 7);
  if (km < 30) return lerpColor([70, 120, 200], [30, 50, 140], (km - 12) / 18);
  if (km < 60) return lerpColor([30, 50, 140], [15, 20, 80], (km - 30) / 30);
  if (km < 100) return lerpColor([15, 20, 80], [5, 5, 30], (km - 60) / 40);
  return "rgb(3, 3, 15)";
}

function getTextColor(km) {
  if (km < 20) return "rgba(30, 40, 80, 0.9)";
  if (km < 50) return "rgba(200, 210, 240, 0.9)";
  return "rgba(220, 225, 245, 0.9)";
}

function getSubtextColor(km) {
  if (km < 20) return "rgba(80, 90, 120, 0.75)";
  if (km < 50) return "rgba(160, 170, 200, 0.7)";
  return "rgba(180, 185, 210, 0.65)";
}

function getLayerLabelOffset(layerName, compact, phone) {
  if (phone) {
    if (layerName === "Troposphere") return -18;
    if (layerName === "Stratosphere") return -6;
    if (layerName === "Mesosphere") return 8;
    if (layerName === "Thermosphere") return 26;
    return 0;
  }

  if (compact) {
    if (layerName === "Troposphere") return -10;
    if (layerName === "Stratosphere") return -2;
    if (layerName === "Mesosphere") return 10;
    if (layerName === "Thermosphere") return 22;
  }

  return 0;
}

function getLandmarkOffset(km, compact, phone) {
  if (phone) {
    if (km <= 12) return 0;
    if (km < 60) return 4;
    if (km < 100) return 8;
    return 14;
  }

  if (compact) {
    if (km <= 12) return 0;
    if (km < 60) return 8;
    if (km < 100) return 16;
    return 28;
  }

  if (km >= 100) return 32;
  if (km >= 80) return 18;
  return 0;
}

function getChapterLineStates(chapter, progress) {
  if (!chapter) return [];

  const lineCount = chapter.lines.length;
  const sliceSize = 1 / lineCount;
  const overlap = 0.3;

  return chapter.lines.map((_, i) => {
    const effectiveSlice = sliceSize + overlap * sliceSize;
    const lineStart = i * sliceSize - overlap * sliceSize * 0.5;
    const t = Math.max(0, Math.min(1, (progress - lineStart) / effectiveSlice));
    return {
      progress: t,
      passed: t >= 0.999,
    };
  });
}

// ─── Chapter Overlay (scroll-driven bottom-to-top text) ──────────────
// Each line scrolls from below the viewport to above it.
// `progress` is a continuous 0→1 value driven by wheel input.
// Each line owns a slice of the progress range.
function ChapterOverlay({ chapter, progress, lineProgress, passedLines, fadingOut, compact }) {
  if (!chapter) return null;

  const lineCount = chapter.lines.length;
  // Each line gets an equal share of progress, with overlap for smooth transitions
  const sliceSize = 1 / lineCount;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        overflow: "hidden",
        pointerEvents: fadingOut ? "none" : "auto",
        transition: "opacity 0.5s ease",
        opacity: fadingOut ? 0 : 1,
      }}
    >
      {/* Each line scrolls continuously top → bottom with overlap between lines */}
      {/* First line fades in at center; subsequent lines scroll through */}
      {chapter.lines.map((line, i) => {
        const overlap = 0.3;
        const effectiveSlice = sliceSize + overlap * sliceSize;
        const lineStart = i * sliceSize - overlap * sliceSize * 0.5;

        const derivedT = Math.max(0, Math.min(1, (progress - lineStart) / effectiveSlice));
        const t = lineProgress[i] ?? derivedT;
        const wasPassed = passedLines[i];

        let yPercent;
        let opacity = 0;

        if (i === 0) {
          // First line: fade in at center, hold, then scroll down to exit
          const fadeInEnd = 0.24;
          const holdEnd = 0.5; // holds at center until halfway through its slice
          if (t <= holdEnd) {
            yPercent = 50;
          } else {
            // Scroll from center (50%) down to 115%
            const exitT = (t - holdEnd) / (1 - holdEnd);
            const eased = exitT * exitT; // ease-in (accelerate out)
            yPercent = 50 + eased * 65;
          }
          // Opacity: fade in quickly, full through middle, fade out near bottom
          if (t > 0 && t <= fadeInEnd) {
            opacity = t / fadeInEnd;
          } else if (t > fadeInEnd && t <= 0.85) {
            opacity = 1;
          } else if (t > 0.85 && t < 1) {
            opacity = (1 - t) / 0.15;
          }
        } else {
          // Subsequent lines: smooth continuous scroll top → bottom
          const eased = t < 0.5
            ? 2 * t * t
            : 1 - Math.pow(-2 * t + 2, 2) / 2;
          yPercent = -15 + eased * 130;

          if (t > 0 && t < 0.15) {
            opacity = t / 0.15;
          } else if (t >= 0.15 && t <= 0.85) {
            opacity = 1;
          } else if (t > 0.85 && t < 1) {
            opacity = (1 - t) / 0.15;
          }
        }

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: yPercent + "%",
              transform: "translateY(-50%)",
              textAlign: "center",
              padding: compact ? "0 18px" : "0 40px",
              opacity: opacity,
              zIndex: t > 0 && t < 1 ? 2 : wasPassed ? 0 : 1,
              willChange: "transform, opacity",
            }}
          >
            <div
              style={{
                fontFamily: "'Domine', Georgia, serif",
                fontSize: "16px",
                lineHeight: 1.55,
                color: "rgba(255, 255, 255, 0.95)",
                maxWidth: compact ? 320 : 400,
                margin: "0 auto",
                background: "rgba(0, 0, 0, 0.35)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                padding: compact ? "10px 12px" : "12px 16px",
                borderRadius: 12,
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              {line}
            </div>
          </div>
        );
      })}

      {/* Scroll hint at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: compact ? "13px" : "14px",
          color: "rgba(255, 255, 255, 0.28)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontFamily: "'Roboto Mono', monospace",
          animation: "pulse 2s ease-in-out infinite",
        }}
      >
        {compact ? "swipe or scroll to continue" : "scroll to continue"}
      </div>
    </div>
  );
}

// ─── Temperature Profile SVG (draggable) ─────────────────────────────
function TempProfile({ currentKm, showClimate, onDragAltitude, compact, fullHeight, topOffset, availableHeight }) {
  const svgWidth = fullHeight ? 32 : compact ? 54 : 72;
  const svgHeight = fullHeight
    ? Math.max(availableHeight, 320)
    : compact ? 280 : 360;
  const padding = { top: 16, bottom: 16, left: 4, right: 4 };
  const plotW = svgWidth - padding.left - padding.right;
  const plotH = svgHeight - padding.top - padding.bottom;
  const svgRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const samples = useMemo(() => {
    const pts = [];
    const altitudes = [
      0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 25, 30, 35, 40, 45, 50, 55, 60,
      65, 70, 75, 80, 85, 90, 100, 120, 150, 200, 300, 400, 500,
    ];
    for (const km of altitudes) {
      pts.push({ km, temp: getTemperature(km) });
    }
    return pts;
  }, []);

  const minTemp = -100;
  const maxTemp = 1500;

  const tempToX = (t) =>
    padding.left + ((t - minTemp) / (maxTemp - minTemp)) * plotW;
  const kmToY = (km) =>
    padding.top + plotH - (km / MAX_ALTITUDE_KM) * plotH;
  const yToKm = (y) =>
    Math.max(0, Math.min(MAX_ALTITUDE_KM, ((padding.top + plotH - y) / plotH) * MAX_ALTITUDE_KM));

  const eventToAltitude = useCallback(
    (e) => {
      if (!svgRef.current) return null;
      const rect = svgRef.current.getBoundingClientRect();
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const svgY = clientY - rect.top;
      return Math.max(
        0,
        Math.min(MAX_ALTITUDE_KM, ((padding.top + plotH - svgY) / plotH) * MAX_ALTITUDE_KM)
      );
    },
    [padding.top, plotH]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e) => {
      e.preventDefault();
      const km = eventToAltitude(e);
      if (km !== null) onDragAltitude(km);
    };

    const handleEnd = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, eventToAltitude, onDragAltitude]);

  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const km = eventToAltitude(e);
    if (km !== null) onDragAltitude(km);
  };

  const pathD = samples
    .map((p, i) => {
      const x = tempToX(Math.min(Math.max(p.temp, minTemp), maxTemp));
      const y = kmToY(p.km);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  const curTemp = getTemperature(currentKm);
  const curX = tempToX(Math.min(Math.max(curTemp, minTemp), maxTemp));
  const curY = kmToY(Math.min(currentKm, MAX_ALTITUDE_KM));

  const boundaries = [12, 50, 85];

  return (
    <div
      style={{
        position: "fixed",
        left: fullHeight ? 0 : compact ? 6 : 8,
        top: fullHeight ? topOffset : topOffset,
        bottom: fullHeight ? 8 : "auto",
        width: fullHeight ? 40 : "auto",
        transform: fullHeight ? "none" : "translateY(-50%)",
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: fullHeight ? "flex-start" : "center",
      }}
    >
      <div style={{ position: "relative" }}>
        <svg
          ref={svgRef}
          width={svgWidth}
          height={svgHeight}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          style={{
            display: "block",
            overflow: "visible",
            background: "rgba(0,0,0,0.35)",
            borderRadius: 10,
            backdropFilter: "blur(10px)",
            border: isDragging
              ? "1px solid rgba(255,200,100,0.45)"
              : "1px solid rgba(255,255,255,0.12)",
            cursor: isDragging ? "grabbing" : "grab",
            transition: "border 0.2s ease",
            touchAction: "none",
          }}
        >
          <text
            x={padding.left + 6}
            y={padding.top + 10}
            fill="rgba(255,255,255,0.52)"
            fontSize={compact ? "11" : "12"}
            fontFamily="'Roboto Mono', monospace"
            letterSpacing="1.2"
          >
            TEMP
          </text>
          <line
            x1={tempToX(0)} y1={padding.top} x2={tempToX(0)} y2={padding.top + plotH}
            stroke="rgba(255,255,255,0.18)" strokeWidth="0.75" strokeDasharray="2,3"
          />
          <text x={tempToX(0)} y={padding.top - 5} fill="rgba(255,255,255,0.42)" fontSize={compact ? "12" : "13"} textAnchor="middle" fontFamily="'Roboto Mono', monospace">
            0°C
          </text>

          {boundaries.map((km) => (
            <line
              key={km}
              x1={padding.left} y1={kmToY(km)} x2={padding.left + plotW} y2={kmToY(km)}
              stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeDasharray="3,3"
            />
          ))}

          <path d={pathD} fill="none" stroke="rgba(255,180,100,0.78)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

          {showClimate && (
            <path
              d={samples
                .map((p, i) => {
                  let shiftedTemp = p.temp;
                  if (p.km <= 12) shiftedTemp += 2.5 - p.km * 0.08;
                  else if (p.km <= 50) shiftedTemp -= 1.5;
                  else if (p.km <= 85) shiftedTemp -= 2;
                  else shiftedTemp -= 4;
                  const x = tempToX(Math.min(Math.max(shiftedTemp, minTemp), maxTemp));
                  const y = kmToY(p.km);
                  return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
                })
                .join(" ")}
              fill="none" stroke="rgba(255,90,50,0.55)" strokeWidth="1.4" strokeDasharray="3,2" strokeLinecap="round"
            />
          )}

          {isDragging && (
            <circle cx={curX} cy={curY} r="12" fill="rgba(255,200,100,0.15)" />
          )}
          <circle
            cx={curX} cy={curY} r={isDragging ? 6 : 4.5}
            fill={isDragging ? "rgba(255,220,130,1)" : "rgba(255,200,100,0.9)"}
            stroke="rgba(255,255,255,0.6)" strokeWidth={isDragging ? 1.5 : 1}
            style={{ transition: "r 0.15s ease" }}
          />

          <text
            x={Math.min(svgWidth - 8, curX + 10)}
            y={Math.max(padding.top + 20, Math.min(svgHeight - 12, curY - 8))}
            fill="rgba(255,215,140,0.95)"
            fontSize={compact ? "11" : "12"}
            fontFamily="'Roboto Mono', monospace"
            fontWeight={isDragging ? "700" : "500"}
            textAnchor={curX > svgWidth - 56 ? "end" : "start"}
          >
            {formatTempWithF(curTemp)}
          </text>

          <text x={padding.left + 2} y={padding.top + plotH + 13} fill="rgba(255,255,255,0.34)" fontSize={compact ? "12" : "13"} fontFamily="'Roboto Mono', monospace">
            −100°C
          </text>
          {showClimate && (
            <>
              <line x1={padding.left + 6} y1={svgHeight - 34} x2={padding.left + 20} y2={svgHeight - 34} stroke="rgba(255,180,100,0.7)" strokeWidth="2" />
              <text x={padding.left + 24} y={svgHeight - 31} fill="rgba(255,255,255,0.5)" fontSize={compact ? "11" : "12"} fontFamily="'Roboto Mono', monospace">Now</text>
              <line x1={padding.left + 6} y1={svgHeight - 18} x2={padding.left + 20} y2={svgHeight - 18} stroke="rgba(255,90,50,0.55)" strokeWidth="2" strokeDasharray="3,2" />
              <text x={padding.left + 24} y={svgHeight - 15} fill="rgba(255,90,50,0.58)" fontSize={compact ? "11" : "12"} fontFamily="'Roboto Mono', monospace">+CO₂</text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}

function AltitudeRuler({ currentKm, onDragAltitude, compact }) {
  const rulerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const rulerTicks = [0, 10, 20, 50, 85, 100, 200, 300, 400, 500];
  const rulerHeight = compact ? 320 : 420;
  const rulerWidth = compact ? 52 : 68;

  const eventToAltitude = useCallback((e) => {
    if (!rulerRef.current) return null;
    const rect = rulerRef.current.getBoundingClientRect();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const localY = clientY - rect.top;
    const pctFromBottom = 1 - localY / rect.height;
    return Math.max(0, Math.min(MAX_ALTITUDE_KM, pctFromBottom * MAX_ALTITUDE_KM));
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e) => {
      e.preventDefault();
      const km = eventToAltitude(e);
      if (km !== null) onDragAltitude(km);
    };

    const handleEnd = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, eventToAltitude, onDragAltitude]);

  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const km = eventToAltitude(e);
    if (km !== null) onDragAltitude(km);
  };

  return (
    <div
      style={{
        position: "fixed",
        right: compact ? 8 : 12,
        top: "50%",
        transform: "translateY(-50%)",
        height: rulerHeight,
        width: rulerWidth,
        zIndex: 30,
      }}
    >
      <div
        ref={rulerRef}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.28)",
          border: isDragging
            ? "1px solid rgba(120,190,255,0.45)"
            : "1px solid rgba(255,255,255,0.12)",
          borderRadius: 12,
          backdropFilter: "blur(10px)",
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: compact ? 13 : 16,
            top: 12,
            bottom: 12,
            width: 2,
            background: "rgba(255,255,255,0.18)",
          }}
        />

        {rulerTicks.map((km) => {
          const pct = (km / MAX_ALTITUDE_KM) * 100;
          const isMajor = km === 0 || km === 100 || km === 200 || km === 400;
          return (
            <div key={km} style={{ position: "absolute", bottom: `calc(${pct}% + 12px)`, left: compact ? 13 : 16, transform: "translateY(50%)" }}>
              <div
                style={{
                  width: isMajor ? 12 : 8,
                  height: 2,
                  background: isMajor ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.22)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: isMajor ? 16 : 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: isMajor ? (compact ? "12px" : "13px") : (compact ? "12px" : "13px"),
                  lineHeight: 1,
                  fontFamily: "'Roboto Mono', monospace",
                  color: isMajor ? "rgba(255,255,255,0.56)" : "rgba(255,255,255,0.38)",
                  whiteSpace: "nowrap",
                }}
              >
                {km}
              </div>
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            bottom: `calc(${Math.min(100, (currentKm / MAX_ALTITUDE_KM) * 100)}% + 12px)`,
            left: compact ? 13 : 16,
            transform: "translate(-50%, 50%)",
          }}
        >
          {isDragging && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "rgba(120,190,255,0.18)",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
          <div
            style={{
              width: isDragging ? 10 : 8,
              height: isDragging ? 10 : 8,
              borderRadius: "50%",
              background: currentKm < 20
                ? "rgba(135, 206, 235, 0.9)"
                : currentKm < 60
                ? "rgba(100, 140, 220, 0.9)"
                : "rgba(150, 130, 255, 0.82)",
              border: "1px solid rgba(255,255,255,0.72)",
              transition: "width 0.15s ease, height 0.15s ease, background 0.5s ease",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: 4,
            left: compact ? 10 : 13,
            fontSize: compact ? "12px" : "13px",
            fontFamily: "'Roboto Mono', monospace",
            color: "rgba(255,255,255,0.46)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          km
        </div>
      </div>
    </div>
  );
}

// ─── Stars ───────────────────────────────────────────────────────────
function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        top: Math.random() * 45,
        left: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        twinkle: Math.random() * 4 + 2,
      })),
    []
  );
  return (
    <>
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: s.top + "%",
            left: s.left + "%",
            width: s.size,
            height: s.size,
            background: "#fff",
            borderRadius: "50%",
            opacity: s.opacity,
            animation: `twinkle ${s.twinkle}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </>
  );
}

function CruisingPlanes({ currentKm, topVisibleKm, oceanHeight }) {
  const isVisible = topVisibleKm >= 10 && currentKm <= 14;

  if (!isVisible) return null;

  const planeBottom = altitudeToPixels(10) + oceanHeight + 36;
  const planes = [
    { delay: "0s", duration: "18s", size: 48, bottomOffset: 0 },
    { delay: "-6s", duration: "22s", size: 40, bottomOffset: 34 },
    { delay: "-12s", duration: "20s", size: 44, bottomOffset: -30 },
  ];

  return (
    <>
      {planes.map((plane, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            bottom: planeBottom + plane.bottomOffset,
            left: "-10%",
            fontSize: plane.size,
            lineHeight: 1,
            opacity: 0.78,
            filter: "drop-shadow(0 2px 10px rgba(255,255,255,0.15))",
            animation: `planeFlyby ${plane.duration} linear infinite`,
            animationDelay: plane.delay,
            pointerEvents: "none",
            transformOrigin: "center",
          }}
        >
          ✈️
        </div>
      ))}
    </>
  );
}

function TroposphereClouds({ oceanHeight }) {
  const clouds = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => ({
        id: index,
        km: Math.random() * 11.5 + 0.2,
        left: Math.random() * 100,
        size: Math.random() * 36 + 56,
        opacity: 1,
        duration: Math.random() * 28 + 72,
        delay: -(Math.random() * 80),
      })),
    []
  );

  return (
    <>
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          style={{
            position: "absolute",
            left: `${cloud.left}%`,
            bottom: altitudeToPixels(cloud.km) + oceanHeight,
            fontSize: cloud.size,
            lineHeight: 1,
            opacity: cloud.opacity,
            filter: "blur(0.2px)",
            transform: "translateX(-50%)",
            animation: `cloudDrift ${cloud.duration}s linear infinite`,
            animationDelay: `${cloud.delay}s`,
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          ☁️
        </div>
      ))}
    </>
  );
}

function OzoneMolecules({ oceanHeight }) {
  const molecules = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        km: 20 + Math.random() * 5,
        left: Math.random() * 100,
        size: Math.random() * 8 + 12,
        opacity: Math.random() * 0.18 + 0.18,
        duration: Math.random() * 18 + 22,
        delay: -(Math.random() * 24),
      })),
    []
  );

  return (
    <>
      {molecules.map((molecule) => (
        <div
          key={molecule.id}
          style={{
            position: "absolute",
            left: `${molecule.left}%`,
            bottom: altitudeToPixels(molecule.km) + oceanHeight,
            fontSize: molecule.size,
            lineHeight: 1,
            color: `rgba(210, 235, 255, ${molecule.opacity})`,
            fontFamily: "'Roboto Mono', monospace",
            transform: "translateX(-50%)",
            animation: `ozoneDrift ${molecule.duration}s ease-in-out infinite`,
            animationDelay: `${molecule.delay}s`,
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          O₃
        </div>
      ))}
    </>
  );
}

function BurjComparison({ compact, phone, oceanHeight }) {
  const svgWidth = phone ? 36 : compact ? 42 : 48;
  const svgHeight = altitudeToPixels(0.828);

  return (
    <div
      style={{
        position: "absolute",
        left: "33.333%",
        bottom: oceanHeight,
        width: svgWidth,
        height: svgHeight,
        zIndex: 1,
        pointerEvents: "none",
        transform: "translateX(-50%)",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        aria-hidden="true"
        style={{ display: "block" }}
      >
        <path
          d={`
            M 0 ${svgHeight}
            L 8 ${svgHeight}
            L 8 ${svgHeight - svgHeight * 0.16}
            L 12 ${svgHeight - svgHeight * 0.16}
            L 12 ${svgHeight - svgHeight * 0.34}
            L 16 ${svgHeight - svgHeight * 0.34}
            L 16 ${svgHeight - svgHeight * 0.56}
            L 19 ${svgHeight - svgHeight * 0.56}
            L 19 ${svgHeight - svgHeight * 0.78}
            L 21 ${svgHeight - svgHeight * 0.78}
            L 21 10
            L 22.5 0
            L 24 10
            L 24 ${svgHeight - svgHeight * 0.78}
            L 27 ${svgHeight - svgHeight * 0.78}
            L 27 ${svgHeight - svgHeight * 0.56}
            L 31 ${svgHeight - svgHeight * 0.56}
            L 31 ${svgHeight - svgHeight * 0.34}
            L 35 ${svgHeight - svgHeight * 0.34}
            L 35 ${svgHeight - svgHeight * 0.16}
            L ${svgWidth} ${svgHeight - svgHeight * 0.16}
            L ${svgWidth} ${svgHeight}
            Z
          `}
          fill="#6f7782"
        />
      </svg>
    </div>
  );
}

function MountainComparison({ compact, phone, oceanHeight }) {
  const svgWidth = phone ? 124 : compact ? 184 : 244;
  const svgHeight = altitudeToPixels(8.849);

  return (
    <div
      style={{
        position: "absolute",
        left: "66.667%",
        bottom: oceanHeight,
        width: svgWidth,
        height: svgHeight,
        zIndex: 1,
        pointerEvents: "none",
        transform: "translateX(-50%)",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        aria-hidden="true"
        style={{ display: "block" }}
      >
        <path
          d={`
            M 0 ${svgHeight}
            L ${svgWidth * 0.12} ${svgHeight * 0.8}
            L ${svgWidth * 0.2} ${svgHeight * 0.76}
            L ${svgWidth * 0.3} ${svgHeight * 0.5}
            L ${svgWidth * 0.42} ${svgHeight * 0.3}
            L ${svgWidth * 0.5} 0
            L ${svgWidth * 0.6} ${svgHeight * 0.2}
            L ${svgWidth * 0.72} ${svgHeight * 0.44}
            L ${svgWidth * 0.82} ${svgHeight * 0.58}
            L ${svgWidth * 0.9} ${svgHeight * 0.76}
            L ${svgWidth} ${svgHeight}
            Z
          `}
          fill="#6f7782"
        />
      </svg>
    </div>
  );
}

function KilimanjaroComparison({ compact, phone, oceanHeight }) {
  const svgWidth = phone ? 104 : compact ? 148 : 196;
  const svgHeight = altitudeToPixels(5.895);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: oceanHeight,
        width: svgWidth,
        height: svgHeight,
        zIndex: 1,
        pointerEvents: "none",
        transform: "translateX(-50%)",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        aria-hidden="true"
        style={{ display: "block" }}
      >
        <path
          d={`
            M 0 ${svgHeight}
            L ${svgWidth * 0.1} ${svgHeight * 0.86}
            L ${svgWidth * 0.2} ${svgHeight * 0.72}
            L ${svgWidth * 0.32} ${svgHeight * 0.52}
            L ${svgWidth * 0.44} ${svgHeight * 0.28}
            L ${svgWidth * 0.5} 0
            L ${svgWidth * 0.58} ${svgHeight * 0.22}
            L ${svgWidth * 0.7} ${svgHeight * 0.46}
            L ${svgWidth * 0.82} ${svgHeight * 0.68}
            L ${svgWidth * 0.92} ${svgHeight * 0.84}
            L ${svgWidth} ${svgHeight}
            Z
          `}
          fill="#6f7782"
        />
      </svg>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function AtmosphereScrolly() {
  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 1280,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  }));
  // Ocean = half the viewport height
  const [oceanHeight, setOceanHeight] = useState(() =>
    typeof window !== "undefined" ? Math.round(window.innerHeight / 2) : 400
  );
  const totalHeight = ATM_HEIGHT + oceanHeight;

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    if (!document.getElementById("gfonts-atm")) {
      const link = document.createElement("link");
      link.id = "gfonts-atm";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Domine:wght@400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=Roboto+Mono:wght@300;400;500;600&display=swap";
      document.head.appendChild(link);
    }
    return undefined;
  }, []);

  // Update on resize
  useEffect(() => {
    const onResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      setOceanHeight(Math.round(window.innerHeight / 2));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const [currentKm, setCurrentKm] = useState(0);
  const [showClimate, setShowClimate] = useState(false);
  const containerRef = useRef(null);
  const hudRef = useRef(null);
  const [hudHeight, setHudHeight] = useState(88);

  // ─── Chapter break state ───
  const [activeChapterKm, setActiveChapterKm] = useState(null);
  const [chapterProgress, setChapterProgress] = useState(0); // 0→1 continuous
  const [chapterLineProgress, setChapterLineProgress] = useState([]);
  const [chapterPassedLines, setChapterPassedLines] = useState([]);
  const [chapterFadingOut, setChapterFadingOut] = useState(false);
  const [chapterDirection, setChapterDirection] = useState("up"); // "up" or "down"
  const prevCenterKm = useRef(0);
  const prevChapterProgress = useRef(null);
  const chapterActivatedAt = useRef(0);
  const hasInitialized = useRef(false); // prevent re-init on effect re-run
  const chapterCooldown = useRef(false); // suppress snap right after chapter closes
  const frozenScrollTop = useRef(null); // scroll position locked during a chapter
  const touchStartY = useRef(null);

  const activeChapter = activeChapterKm ? CHAPTER_BREAKS[activeChapterKm] : null;
  const isCompact = viewport.width < 900;
  const isPhone = viewport.width < 680;
  const showRuler = viewport.width >= 880;
  const mobileRailWidth = 40;
  const profileTopOffset = isPhone ? hudHeight + 8 : "50%";
  const profileAvailableHeight = isPhone ? Math.max(viewport.height - hudHeight - 16, 320) : 360;

  useEffect(() => {
    if (!hudRef.current) return undefined;

    const updateHudHeight = () => {
      if (hudRef.current) {
        setHudHeight(hudRef.current.getBoundingClientRect().height);
      }
    };

    updateHudHeight();

    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(updateHudHeight);
    observer.observe(hudRef.current);
    return () => observer.disconnect();
  }, [viewport.width, showClimate, currentKm]);

  // ─── Reset everything ───
  const handleReset = useCallback(() => {
    if (!containerRef.current) return;
    setActiveChapterKm(null);
    setChapterProgress(0);
    setChapterLineProgress([]);
    setChapterPassedLines([]);
    setChapterFadingOut(false);
    setChapterDirection("up");
    chapterCooldown.current = false;
    frozenScrollTop.current = null;
    prevChapterProgress.current = null;
    chapterActivatedAt.current = 0;
    prevCenterKm.current = 0;
    const el = containerRef.current;
    // Scroll back so sea level is at 50% viewport height
    el.scrollTo({ top: el.scrollHeight - el.clientHeight / 2 - oceanHeight, behavior: "smooth" });
  }, [oceanHeight]);

  // Called by TempProfile when user drags the dot
  const scrollToAltitude = useCallback((km) => {
    if (!containerRef.current || activeChapterKm) return; // block during chapter
    const el = containerRef.current;
    const targetPx = altitudeToPixels(km) + oceanHeight;
    const targetScrollTop = el.scrollHeight - el.clientHeight - targetPx;
    el.scrollTop = targetScrollTop;
  }, [activeChapterKm, oceanHeight]);

  const updateAltitude = useCallback(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const scrollBottom = el.scrollHeight - el.scrollTop - el.clientHeight - oceanHeight;
    const km = pixelsToAltitude(Math.max(0, scrollBottom));
    setCurrentKm(Math.max(0, Math.min(km, MAX_ALTITUDE_KM)));
  }, [oceanHeight]);

  // ─── Detect boundary crossings at viewport center (both directions) ───
  const centerKm = useMemo(() => {
    if (!containerRef.current) return currentKm;
    const el = containerRef.current;
    const scrollCenter = el.scrollHeight - el.scrollTop - el.clientHeight + el.clientHeight / 2 - oceanHeight;
    return pixelsToAltitude(Math.max(0, scrollCenter));
  }, [currentKm, oceanHeight]); // recalc whenever currentKm updates (same scroll event)

  useEffect(() => {
    if (activeChapterKm || chapterCooldown.current) return;

    const boundaries = Object.keys(CHAPTER_BREAKS).map(Number);
    for (const bKm of boundaries) {
      // Check upward crossing at viewport center
      const crossedUp = prevCenterKm.current < bKm && centerKm >= bKm;
      // Check downward crossing at viewport center
      const crossedDown = prevCenterKm.current > bKm && centerKm <= bKm;

      const direction = crossedUp ? "up" : crossedDown ? "down" : null;
      if (!direction) continue;

      // Snap scroll to exactly the boundary position and freeze it there
      if (containerRef.current) {
        const el = containerRef.current;
        const boundaryScrollTop = el.scrollHeight - el.clientHeight - (altitudeToPixels(bKm) + oceanHeight) + el.clientHeight / 2;
        el.scrollTop = boundaryScrollTop;
        frozenScrollTop.current = boundaryScrollTop;
      }
      setActiveChapterKm(bKm);
      setChapterDirection(direction);
      setChapterProgress(direction === "up" ? 0 : 1);
      const initialLineStates = getChapterLineStates(
        CHAPTER_BREAKS[bKm],
        direction === "up" ? 0 : 1
      );
      setChapterLineProgress(initialLineStates.map((state) => state.progress));
      setChapterPassedLines(initialLineStates.map((state) => state.passed));
      prevChapterProgress.current = direction === "up" ? 0 : 1;
      chapterActivatedAt.current =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      setChapterFadingOut(false);
      break;
    }

    prevCenterKm.current = centerKm;
  }, [centerKm, activeChapterKm, oceanHeight]);

  useEffect(() => {
    if (!activeChapter) {
      setChapterLineProgress([]);
      setChapterPassedLines([]);
      prevChapterProgress.current = null;
      return;
    }

    const lineStates = getChapterLineStates(activeChapter, chapterProgress);
    const isReversing =
      prevChapterProgress.current !== null && chapterProgress < prevChapterProgress.current;

    setChapterLineProgress(lineStates.map((state) => state.progress));
    setChapterPassedLines((prev) =>
      lineStates.map((state, index) => {
        if (state.passed) return true;
        if (isReversing && state.progress <= 0.001) return false;
        return prev[index] ?? false;
      })
    );
    prevChapterProgress.current = chapterProgress;
  }, [activeChapter, chapterProgress]);

  // ─── Handle wheel events during chapter overlay (continuous, direction-aware) ───
  useEffect(() => {
    if (!activeChapterKm || chapterFadingOut) return;

    const chapter = CHAPTER_BREAKS[activeChapterKm];
    if (!chapter) return;

    const PIXELS_PER_LINE = 300;
    const totalDistance = chapter.lines.length * PIXELS_PER_LINE;

    const dismissChapter = () => {
      setChapterFadingOut(true);
      chapterCooldown.current = true;
      frozenScrollTop.current = null;
      chapterActivatedAt.current = 0;
      setTimeout(() => {
        setActiveChapterKm(null);
        setChapterFadingOut(false);
        setTimeout(() => {
          chapterCooldown.current = false;
        }, 800);
      }, 600);
    };

    const advanceChapter = (rawDelta) => {
      if (Math.abs(rawDelta) === 0) return;
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      const activationAge = now - chapterActivatedAt.current;
      const enteredForward =
        (chapterDirection === "up" && rawDelta < 0) ||
        (chapterDirection === "down" && rawDelta > 0);

      // Ignore residual momentum from the scroll that triggered the chapter.
      if (activationAge < 220 && enteredForward) {
        return;
      }

      const progressDelta = Math.abs(rawDelta) / totalDistance;

      setChapterProgress((prev) => {
        let next;
        if (chapterDirection === "up") {
          // Entered going up: scroll-up (negative deltaY) advances, scroll-down retreats
          next = rawDelta < 0 ? prev + progressDelta : prev - progressDelta;
        } else {
          // Entered going down: scroll-down (positive deltaY) advances (reverse playback), scroll-up retreats
          next = rawDelta > 0 ? prev - progressDelta : prev + progressDelta;
        }

        next = Math.max(-0.05, Math.min(1.05, next));

        // Completed forward (progress >= 1 going up, or progress <= 0 going down)
        if (chapterDirection === "up" && next >= 1.0 && prev < 1.0) {
          dismissChapter();
          return Math.min(1, next);
        }
        if (chapterDirection === "down" && next <= 0.0 && prev > 0.0) {
          dismissChapter();
          return Math.max(0, next);
        }

        // Allow backing out: if going up and progress drops below 0, dismiss back down
        if (chapterDirection === "up" && next <= 0.0 && prev > 0.0) {
          dismissChapter();
          return 0;
        }
        // If going down and progress rises above 1, dismiss back up
        if (chapterDirection === "down" && next >= 1.0 && prev < 1.0) {
          dismissChapter();
          return 1;
        }

        return Math.max(0, Math.min(1, next));
      });
    };

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      advanceChapter(e.deltaY);
    };

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (e) => {
      const nextY = e.touches[0]?.clientY;
      if (touchStartY.current === null || nextY == null) return;
      e.preventDefault();
      e.stopPropagation();
      const delta = nextY - touchStartY.current;
      touchStartY.current = nextY;
      advanceChapter(delta * 1.35);
    };

    const handleTouchEnd = () => {
      touchStartY.current = null;
    };

    const handleKeyDown = (e) => {
      if (!["ArrowUp", "ArrowDown", "PageUp", "PageDown", " ", "Spacebar"].includes(e.key)) {
        return;
      }
      e.preventDefault();
      const delta =
        e.key === "ArrowUp" || e.key === "PageUp"
          ? -120
          : 120;
      advanceChapter(delta);
    };

    const container = containerRef.current;
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    if (container) container.addEventListener("wheel", handleWheel, { passive: false });
    if (container) container.addEventListener("touchstart", handleTouchStart, { passive: true });
    if (container) container.addEventListener("touchmove", handleTouchMove, { passive: false });
    if (container) container.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
      if (container) container.removeEventListener("wheel", handleWheel);
      if (container) container.removeEventListener("touchstart", handleTouchStart);
      if (container) container.removeEventListener("touchmove", handleTouchMove);
      if (container) container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeChapterKm, chapterFadingOut, chapterDirection]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (activeChapterKm) {
        // Freeze scroll position at the boundary while chapter is active
        if (frozenScrollTop.current !== null && containerRef.current) {
          containerRef.current.scrollTop = frozenScrollTop.current;
        }
        return;
      }
      updateAltitude();
    };

    el.addEventListener("scroll", handleScroll, { passive: true });

    // Only initialize scroll position once (not on every re-run)
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight - el.clientHeight / 2 - oceanHeight;
        updateAltitude();
      });
    }

    return () => el.removeEventListener("scroll", handleScroll);
  }, [updateAltitude, activeChapterKm, oceanHeight]);

  const bgColor = getBackgroundColor(currentKm);
  const temp = getTemperature(currentKm).toFixed(0);
  const pressure = getPressure(currentKm);
  const pressureStr =
    pressure >= 1
      ? pressure.toFixed(0) + " hPa"
      : pressure.toExponential(1) + " hPa";
  const currentLayer = layers.find(
    (l) => currentKm >= l.startKm && currentKm < l.endKm
  );
  const topVisibleKm = currentKm + pixelsToAltitude(containerRef.current?.clientHeight ?? viewport.height);

  // Dim everything behind the chapter overlay
  const behindChapterStyle = {};

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Open Sans', 'Roboto Mono', sans-serif",
        background: "#000",
        overflow: "hidden",
      }}
    >
      {/* ─── Chapter Overlay ─── */}
      {activeChapterKm && (
        <ChapterOverlay
          chapter={activeChapter}
          progress={chapterProgress}
          lineProgress={chapterLineProgress}
          passedLines={chapterPassedLines}
          fadingOut={chapterFadingOut}
          compact={isPhone}
        />
      )}

      {/* ─── Fixed HUD ─── */}
      <div
        ref={hudRef}
        style={{
          position: "relative",
          zIndex: 20,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(10px)",
          width: "100%",
          padding: isPhone ? "10px 12px 10px 8px" : isCompact ? "12px 16px 12px 64px" : "12px 20px 12px 72px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: isPhone ? "flex-start" : "center",
          flexWrap: "wrap",
          gap: isPhone ? 10 : 16,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          flexShrink: 0,
          ...behindChapterStyle,
        }}
      >
        <div>
          <div style={{ fontSize: isPhone ? "12px" : "13px", color: "rgba(255,255,255,0.48)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>
            Altitude
          </div>
          <div style={{ fontSize: isPhone ? "22px" : "28px", color: "#fff", fontWeight: 600, fontFamily: "'Roboto Mono', monospace", lineHeight: 1.1 }}>
            {currentKm < 1
              ? (currentKm * 1000).toFixed(0) + " m"
              : currentKm.toFixed(1) + " km"}
          </div>
        </div>

        <div style={{ textAlign: isPhone ? "left" : "center", flex: isPhone ? "1 1 100%" : "0 1 auto", order: isPhone ? 3 : "initial", alignSelf: isPhone ? "flex-start" : "auto" }}>
          <div style={{ fontSize: isPhone ? "12px" : "13px", color: "rgba(255,255,255,0.48)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>
            {currentLayer?.name || "Exosphere"}
          </div>
          <div style={{ fontSize: isPhone ? "16px" : "18px", color: "rgba(255,255,255,0.8)", fontFamily: "'Roboto Mono', monospace", lineHeight: 1.4 }}>
            {formatTempWithF(Number(temp))} · {pressureStr}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: isPhone ? "auto" : 0 }}>
          <button
            onClick={() => setShowClimate(!showClimate)}
            style={{
              background: showClimate ? "rgba(255, 100, 50, 0.3)" : "rgba(255,255,255,0.1)",
              border: showClimate ? "1px solid rgba(255, 100, 50, 0.5)" : "1px solid rgba(255,255,255,0.2)",
              color: showClimate ? "#ff8855" : "rgba(255,255,255,0.6)",
              padding: isPhone ? "6px 10px" : "6px 14px",
              borderRadius: "20px",
              fontSize: isPhone ? "12px" : "13px",
              cursor: "pointer",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              transition: "all 0.3s ease",
            }}
          >
            {showClimate ? (isPhone ? "Climate On" : "🌡 Climate On") : "Climate"}
          </button>
          <button
            onClick={handleReset}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.6)",
              padding: isPhone ? "6px 10px" : "6px 14px",
              borderRadius: "20px",
              fontSize: isPhone ? "12px" : "13px",
              cursor: "pointer",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              transition: "all 0.3s ease",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* ─── Temp Profile (fixed, left edge) ─── */}
      <div style={behindChapterStyle}>
        <TempProfile
          currentKm={currentKm}
          showClimate={showClimate}
          onDragAltitude={scrollToAltitude}
          compact={isPhone}
          fullHeight={isPhone}
          topOffset={profileTopOffset}
          availableHeight={profileAvailableHeight}
        />
      </div>

      {/* ─── Scroll Container ─── */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          background: bgColor,
          transition: "background 0.4s ease",
          position: "relative",
          marginLeft: isPhone ? `${mobileRailWidth}px` : 0,
          width: isPhone ? `calc(100% - ${mobileRailWidth}px)` : "100%",
          ...behindChapterStyle,
        }}
      >
        <div
          style={{
            height: totalHeight + "px",
            position: "relative",
          }}
        >
          {/* ─── Ocean ─── */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: oceanHeight + 24,
              transform: "translateY(24px)",
              background: "#0e4d6b",
              overflow: "hidden",
            }}
          >
            <svg
              viewBox="0 0 1440 80"
              preserveAspectRatio="none"
              aria-hidden="true"
              style={{
                position: "absolute",
                top: -20,
                left: 0,
                width: "200%",
                height: 48,
                opacity: 1,
                animation: "oceanDrift 20s linear infinite",
              }}
            >
              <path
                d="M0,38 C48,28 96,22 144,26 C192,30 240,44 288,44 C336,44 384,28 432,24 C480,20 528,28 576,34 C624,40 672,44 720,40 C768,36 816,24 864,22 C912,20 960,30 1008,36 C1056,42 1104,44 1152,38 C1200,32 1248,22 1296,22 C1344,22 1392,28 1440,32 L1440,80 L0,80 Z"
                fill="#1a6b8a"
              />
              <path
                d="M0,44 C60,36 120,28 180,30 C240,32 300,46 360,48 C420,50 480,40 540,32 C600,24 660,24 720,30 C780,36 840,48 900,48 C960,48 1020,34 1080,28 C1140,22 1200,24 1260,30 C1320,36 1380,42 1440,42 L1440,80 L0,80 Z"
                fill="#145c79"
              />
            </svg>
            {/* Sea level label */}
            <div style={{
              position: "absolute",
              top: -12,
              left: 80,
              fontSize: "12px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}>
              Sea Level
            </div>
          </div>

          {/* ─── Intro text (below ocean) ─── */}
          <div
            style={{
              position: "absolute",
              bottom: 30,
              left: 0,
              right: 0,
              textAlign: "center",
              padding: "0 20px",
            }}
          >
            <div style={{ marginBottom: 10, fontSize: isPhone ? "44px" : "52px", lineHeight: 1, color: "rgba(140, 190, 210, 0.42)", animation: "pulse 2s ease-in-out infinite" }}>
              ↑
            </div>
            <div style={{ fontSize: isPhone ? "16px" : "18px", color: "rgba(160, 210, 228, 0.76)", maxWidth: isPhone ? 320 : 460, margin: "0 auto", lineHeight: 1.65, fontFamily: "'Domine', Georgia, serif" }}>
              You&apos;re standing at sea level. The atmosphere stretches above you for hundreds of kilometers — but almost all of it, by mass, is closer than you think.
            </div>
          </div>

          {/* ─── Layer Backgrounds ─── */}
          {layers.map((layer) => {
            const bottom = altitudeToPixels(layer.startKm) + oceanHeight;
            const height = altitudeToPixels(layer.endKm) - altitudeToPixels(layer.startKm);
            return (
              <div
                key={layer.name}
                style={{
                  position: "absolute",
                  bottom: bottom,
                  height: height,
                  left: 0,
                  right: 0,
                  background: layer.color,
                  borderTop:
                    layer.startKm > 0
                      ? "1.5px dashed rgba(255,255,255,0.22)"
                      : "none",
                }}
              />
            );
          })}

          {/* ─── Layer Labels (right side) ─── */}
          {layers.map((layer) => {
            const bottomPx = altitudeToPixels(layer.startKm) + oceanHeight;
            const heightPx = altitudeToPixels(layer.endKm) - altitudeToPixels(layer.startKm);
            const midKm = (layer.startKm + layer.endKm) / 2;
            const subColor = getSubtextColor(midKm);
            const layerOffset = getLayerLabelOffset(layer.name, isCompact, isPhone);
            return (
              <div
                key={layer.name + "-label"}
                style={{
                  position: "absolute",
                  bottom: bottomPx + heightPx / 2 - 50 + layerOffset,
                  right: "10vw",
                  maxWidth: isPhone ? 150 : isCompact ? 190 : 240,
                  textAlign: "right",
                }}
              >
                <div style={{ fontSize: isPhone ? "12px" : "13px", letterSpacing: "0.15em", textTransform: "uppercase", color: subColor, marginBottom: 5 }}>
                  {layer.name}
                </div>
                {!isPhone && (
                  <div style={{ fontSize: isCompact ? "13px" : "15px", color: subColor, lineHeight: 1.65, fontFamily: "'Domine', Georgia, serif" }}>
                    {layer.description}
                  </div>
                )}
                {showClimate && layer.climateNote && (
                  <div
                    style={{
                      fontSize: isPhone ? "14px" : "16px",
                      color: "rgba(255, 150, 90, 0.92)",
                      lineHeight: 1.6,
                      marginTop: 8,
                      padding: isPhone ? "8px 9px" : "10px 12px",
                      background: "rgba(255, 100, 50, 0.08)",
                      borderRadius: 6,
                      borderLeft: "2px solid rgba(255, 100, 50, 0.3)",
                      fontFamily: "'Domine', Georgia, serif",
                      transition: "opacity 0.4s ease",
                    }}
                  >
                    {layer.climateNote}
                  </div>
                )}
              </div>
            );
          })}

          {/* ─── Landmark dashed lines ─── */}
          {landmarks.map((lm) => {
            if (lm.km === 0) return null; // skip sea level (has its own border)
            const bottomPx = altitudeToPixels(lm.km) + oceanHeight;
            const lineColor = lm.isBoundary
              ? "rgba(255,255,255,0.18)"
              : "rgba(255,255,255,0.08)";
            return (
              <div
                key={lm.label + "-line"}
                style={{
                  position: "absolute",
                  bottom: bottomPx,
                  left: 0,
                  right: 0,
                  height: 0,
                  borderTop: `1.5px dashed ${lineColor === "rgba(255,255,255,0.18)" ? "rgba(255,255,255,0.26)" : "rgba(255,255,255,0.16)"}`,
                  pointerEvents: "none",
                }}
              />
            );
          })}

          {/* ─── Landmarks (left side) ─── */}
          {landmarks.map((lm) => {
            const bottomPx = altitudeToPixels(lm.km) + oceanHeight;
            const lmTextColor = getTextColor(lm.km);
            const lmSubColor = getSubtextColor(lm.km);
            const landmarkOffset = getLandmarkOffset(lm.km, isCompact, isPhone);
            const landmarkBlockBottom = lm.km === 0
              ? bottomPx + (isPhone ? 10 : 12)
              : bottomPx - (isPhone ? 30 : 36);
            return (
              <div
                key={lm.label}
                style={{
                  position: "absolute",
                  bottom: landmarkBlockBottom,
                  left: isPhone ? `${mobileRailWidth + 26 + landmarkOffset}px` : `calc(10vw + ${landmarkOffset}px)`,
                  maxWidth: isPhone ? "50%" : isCompact ? "42%" : "36%",
                  zIndex: 8,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: lm.isBoundary ? (isPhone ? "11px" : "13px") : isPhone ? "15px" : "18px",
                      fontWeight: lm.isBoundary ? 400 : 600,
                      color: lm.isBoundary ? lmSubColor : lmTextColor,
                      letterSpacing: lm.isBoundary ? "0.1em" : "0",
                      textTransform: lm.isBoundary ? "uppercase" : "none",
                      lineHeight: isPhone ? 1.3 : 1.2,
                    }}
                  >
                    {lm.label}
                    <span style={{ display: "inline-block", fontSize: isPhone ? "11px" : "13px", color: lmSubColor, marginLeft: 8, fontWeight: 400 }}>
                      {lm.km < 1 ? (lm.km * 1000).toFixed(0) + " m" : lm.km + " km"}
                    </span>
                  </div>
                  <div style={{ fontSize: isPhone ? "12px" : isCompact ? "14px" : "16px", color: lmSubColor, marginTop: 3, lineHeight: isPhone ? 1.45 : 1.6, fontFamily: "'Domine', Georgia, serif" }}>
                    {lm.detail}
                  </div>
                </div>
              </div>
            );
          })}

          <TroposphereClouds oceanHeight={oceanHeight} />
          <OzoneMolecules oceanHeight={oceanHeight} />
          <KilimanjaroComparison compact={isCompact} phone={isPhone} oceanHeight={oceanHeight} />
          <MountainComparison compact={isCompact} phone={isPhone} oceanHeight={oceanHeight} />
          <BurjComparison compact={isCompact} phone={isPhone} oceanHeight={oceanHeight} />
          <CruisingPlanes currentKm={currentKm} topVisibleKm={topVisibleKm} oceanHeight={oceanHeight} />
          <Stars />

          <div
            style={{
              position: "absolute",
              top: 60,
              left: 0,
              right: 0,
              textAlign: "center",
              color: "rgba(255,255,255,0.38)",
              fontSize: isPhone ? "12px" : "13px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: isPhone ? "0 56px" : "0 20px",
            }}
          >
            ~550 km — the boundary blurs into space
          </div>
        </div>
      </div>

      {/* ─── Altitude ruler (right edge) ─── */}
      {showRuler && (
        <AltitudeRuler
          currentKm={currentKm}
          onDragAltitude={scrollToAltitude}
          compact={isCompact}
        />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 0.7; transform: translateY(-6px); }
        }
        @keyframes oceanDrift {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes planeFlyby {
          0% { transform: translateX(0) translateY(0) rotate(45deg); opacity: 0.78; }
          50% { transform: translateX(62vw) translateY(-6px) rotate(45deg); opacity: 0.82; }
          92% { opacity: 0.78; }
          100% { transform: translateX(122vw) translateY(-10px) rotate(45deg); opacity: 0; }
        }
        @keyframes cloudDrift {
          0% { transform: translateX(-50%) translate3d(-12vw, 0, 0); }
          50% { transform: translateX(-50%) translate3d(4vw, -4px, 0); }
          100% { transform: translateX(-50%) translate3d(20vw, -2px, 0); }
        }
        @keyframes ozoneDrift {
          0% { transform: translateX(-50%) translate3d(-6px, 8px, 0); }
          50% { transform: translateX(-50%) translate3d(10px, -10px, 0); }
          100% { transform: translateX(-50%) translate3d(-4px, 6px, 0); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: var(--base-opacity, 0.3); }
          50% { opacity: 0.05; }
        }
        * { scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
