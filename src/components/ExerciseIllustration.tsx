// ============================================================================
// ExerciseIllustration — Filled silhouette animations (Style B) for every
// IllustrationKey type. Fully self-contained: no Lucide, no framer-motion.
// Drop-in replacement: same props as before.
// ============================================================================

import { useState, useEffect, useRef } from "react";
import type { IllustrationKey } from "../models/types";

interface ExerciseIllustrationProps {
  type: IllustrationKey;
  size?: number;
  active?: boolean;
}

// ─── Shared SVG filter (reused by all figures via unique ids) ───────────────
const GLOW_FILTER = (id: string) => (
  <filter id={id}>
    <feGaussianBlur stdDeviation="3" result="blur" />
    <feMerge>
      <feMergeNode in="blur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
);

// ─── SQUAT ──────────────────────────────────────────────────────────────────
function SquatFigure({ t }: { t: number }) {
  const lp = (a: number, b: number) => a + (b - a) * t;
  const hcy       = lp(38, 106);
  const shoulderY = lp(55, 122);
  const hipY      = lp(140, 172);
  const shoulderW = 38, hipW = 24;
  const kneeY     = lp(192, 212);
  const kneeX     = lp(16, 34);
  const uArmAngle = lp(0.4, 0.15);
  const uArmLen   = lp(35, 30);
  const lArmLen   = lp(28, 22);
  const lArmAngle = lp(0.1, 0.5);

  const arm = (side: 1 | -1) => {
    const sx = 100 + side * shoulderW, sy = shoulderY + 12;
    const ex = sx + side * Math.sin(uArmAngle) * uArmLen;
    const ey = sy + Math.cos(uArmAngle) * uArmLen;
    const fx = ex + side * Math.sin(lArmAngle) * lArmLen;
    const fy = ey + Math.cos(lArmAngle) * lArmLen;
    return { sx, sy, ex, ey, fx, fy };
  };
  const [la, ra] = [arm(-1), arm(1)];

  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      <defs>
        <linearGradient id="sq-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        {GLOW_FILTER("sq-f")}
      </defs>
      <line x1="30" y1="248" x2="170" y2="248" stroke="#1a1a1a" strokeWidth="2" />
      <ellipse cx="100" cy="252" rx={lp(22, 30)} ry="4" fill="rgba(124,58,237,0.3)" />
      {[la, ra].map((a, i) => (
        <g key={i}>
          <line x1={a.sx} y1={a.sy} x2={a.ex} y2={a.ey} stroke="#a78bfa" strokeWidth="9" strokeLinecap="round" />
          <line x1={a.ex} y1={a.ey} x2={a.fx} y2={a.fy} stroke="#c4b5fd" strokeWidth="7" strokeLinecap="round" />
          <circle cx={a.ex} cy={a.ey} r="4.5" fill="#fff" opacity="0.65" filter="url(#sq-f)" />
        </g>
      ))}
      <path
        d={`M${100 - shoulderW},${shoulderY} L${100 + shoulderW},${shoulderY} L${100 + hipW},${hipY} L${100 - hipW},${hipY} Z`}
        fill="url(#sq-g)" filter="url(#sq-f)"
      />
      {([-1, 1] as const).map((side, i) => {
        const kx = 100 + side * kneeX;
        const ax = 100 + side * 20;
        return (
          <g key={i}>
            <line x1={100 + side * hipW} y1={hipY} x2={kx} y2={kneeY}
              stroke={i === 0 ? "#7c3aed" : "#a78bfa"} strokeWidth={i === 0 ? 10 : 11} strokeLinecap="round" />
            <line x1={kx} y1={kneeY} x2={ax} y2={244}
              stroke={i === 0 ? "#6d28d9" : "#8b5cf6"} strokeWidth={i === 0 ? 9 : 10} strokeLinecap="round" />
            <circle cx={kx} cy={kneeY} r="5.5"
              fill={t > 0.4 ? "#60a5fa" : "#a78bfa"} opacity="0.9" filter="url(#sq-f)" />
          </g>
        );
      })}
      <rect x="95" y={hcy + 14} width="10" height="8" rx="3" fill="url(#sq-g)" />
      <circle cx="100" cy={hcy} r="15" fill="url(#sq-g)" filter="url(#sq-f)" />
      {t > 0.3 && (
        <>
          <ellipse cx={lp(108, 138)} cy={lp(162, 194)} rx={lp(9, 17)} ry={lp(5, 9)} fill="#60a5fa" opacity={t * 0.45} filter="url(#sq-f)" />
          <ellipse cx={lp(92, 62)} cy={lp(162, 194)} rx={lp(9, 17)} ry={lp(5, 9)} fill="#60a5fa" opacity={t * 0.45} filter="url(#sq-f)" />
        </>
      )}
    </svg>
  );
}

// ─── PUSH-UP ─────────────────────────────────────────────────────────────────
function PushupFigure({ t }: { t: number }) {
  const lp = (a: number, b: number) => a + (b - a) * t;
  const headCy    = lp(108, 148);
  const bodyStartY = lp(116, 156);
  const bodyEndY  = lp(124, 138);
  const armLowerY = lp(190, 218);
  const armHandX  = lp(70, 62);
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      <defs>
        <linearGradient id="pu-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        {GLOW_FILTER("pu-f")}
      </defs>
      <line x1="20" y1="244" x2="180" y2="244" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="148" y1={bodyEndY + 4} x2="164" y2="244" stroke="#1d4ed8" strokeWidth="12" strokeLinecap="round" />
      <line x1="155" y1={bodyEndY + 5} x2="170" y2="244" stroke="#2563eb" strokeWidth="10" strokeLinecap="round" />
      <line x1="44" y1={bodyStartY} x2="158" y2={bodyEndY} stroke="url(#pu-g)" strokeWidth="16" strokeLinecap="round" filter="url(#pu-f)" />
      <line x1="55" y1={bodyStartY + 2} x2="50" y2={armLowerY} stroke="#3b82f6" strokeWidth="10" strokeLinecap="round" />
      <line x1="50" y1={armLowerY} x2={armHandX} y2="244" stroke="#60a5fa" strokeWidth="9" strokeLinecap="round" />
      <circle cx="50" cy={armLowerY} r="5.5" fill="#fff" opacity="0.7" filter="url(#pu-f)" />
      <circle cx={armHandX} cy="244" r="5" fill="#93c5fd" />
      <circle cx="38" cy={headCy - 2} r="2" fill="white" opacity="0.7" />
      <circle cx="32" cy={headCy} r="13" fill="url(#pu-g)" filter="url(#pu-f)" />
      {t > 0.4 && (
        <ellipse cx="75" cy={lp(122, 162)} rx="20" ry="8" fill="#60a5fa" opacity={t * 0.4} filter="url(#pu-f)" />
      )}
    </svg>
  );
}

// ─── PLANK ───────────────────────────────────────────────────────────────────
function PlankFigure({ t }: { t: number }) {
  const breathe = Math.sin(t * Math.PI * 2) * 1.5;
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      <defs>
        <linearGradient id="pl-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        {GLOW_FILTER("pl-f")}
      </defs>
      <line x1="20" y1="244" x2="180" y2="244" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="150" y1={130 + breathe} x2="166" y2="244" stroke="#059669" strokeWidth="12" strokeLinecap="round" />
      <line x1="157" y1={131 + breathe} x2="172" y2="244" stroke="#065f46" strokeWidth="10" strokeLinecap="round" />
      <ellipse cx="103" cy={126 + breathe} rx="26" ry="7"
        fill="#34d399" opacity={0.28 + Math.sin(t * Math.PI * 4) * 0.14} filter="url(#pl-f)" />
      <line x1="44" y1={124 + breathe} x2="162" y2={128 + breathe}
        stroke="url(#pl-g)" strokeWidth="16" strokeLinecap="round" filter="url(#pl-f)" />
      <line x1="55" y1={126 + breathe} x2="55" y2="200" stroke="#34d399" strokeWidth="10" strokeLinecap="round" />
      <line x1="55" y1="200" x2="72" y2="244" stroke="#6ee7b7" strokeWidth="9" strokeLinecap="round" />
      <circle cx="55" cy="200" r="5" fill="#fff" opacity="0.65" filter="url(#pl-f)" />
      <circle cx="30" cy={114 + breathe} r="13" fill="url(#pl-g)" filter="url(#pl-f)" />
      <line x1="28" y1={125 + breathe} x2="165" y2={125 + breathe}
        stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  );
}

// ─── PULL-UP ─────────────────────────────────────────────────────────────────
function PullFigure({ t }: { t: number }) {
  const lp = (a: number, b: number) => a + (b - a) * t;
  const bodyCy = lp(152, 82);
  const headCy = lp(197, 127);
  const elbowY = lp(92, 70);
  const elbowX = lp(62, 50);
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      <defs>
        <linearGradient id="pul-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>
        {GLOW_FILTER("pul-f")}
      </defs>
      <line x1="35" y1="48" x2="165" y2="48" stroke="#555" strokeWidth="6" strokeLinecap="round" />
      <rect x="30" y="38" width="14" height="76" rx="4" fill="#333" />
      <rect x="156" y="38" width="14" height="76" rx="4" fill="#333" />
      {([-1, 1] as const).map((side, i) => {
        const handX = 100 + side * 38;
        const elbX  = 100 + side * elbowX;
        const shouX = 100 + side * 22;
        return (
          <g key={i}>
            <line x1={handX} y1={48} x2={elbX} y2={elbowY} stroke="#c084fc" strokeWidth="10" strokeLinecap="round" />
            <line x1={elbX} y1={elbowY} x2={shouX} y2={bodyCy - 20} stroke="#a855f7" strokeWidth="9" strokeLinecap="round" />
            <circle cx={elbX} cy={elbowY} r="5" fill="#fff" opacity="0.6" filter="url(#pul-f)" />
          </g>
        );
      })}
      <line x1="100" y1={bodyCy - 20} x2="100" y2={bodyCy + 50}
        stroke="url(#pul-g)" strokeWidth="16" strokeLinecap="round" filter="url(#pul-f)" />
      <line x1="94" y1={bodyCy + 50} x2="88" y2={bodyCy + 110} stroke="#7e22ce" strokeWidth="11" strokeLinecap="round" />
      <line x1="106" y1={bodyCy + 50} x2="112" y2={bodyCy + 110} stroke="#9333ea" strokeWidth="10" strokeLinecap="round" />
      <circle cx="100" cy={headCy} r="15" fill="url(#pul-g)" filter="url(#pul-f)" />
      {t > 0.3 && (
        <ellipse cx="100" cy={bodyCy + 5} rx="18" ry="8" fill="#c084fc" opacity={t * 0.5} filter="url(#pul-f)" />
      )}
    </svg>
  );
}

// ─── ROW (Inverted row / doorframe row) ─────────────────────────────────────
function RowFigure({ t }: { t: number }) {
  const lp = (a: number, b: number) => a + (b - a) * t;
  // Body moves from angled-down (hanging) to angled-up (chest to bar)
  const bodyTopY = lp(178, 124);
  const bodyTopX = lp(38, 48);
  const elbowY   = lp(158, 136);
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      <defs>
        <linearGradient id="rw-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        {GLOW_FILTER("rw-f")}
      </defs>
      {/* Frame */}
      <line x1="35" y1="30" x2="35" y2="144" stroke="#444" strokeWidth="5" />
      <line x1="125" y1="30" x2="125" y2="144" stroke="#444" strokeWidth="5" />
      <line x1="30" y1="30" x2="130" y2="30" stroke="#444" strokeWidth="4" />
      <line x1="35" y1="144" x2="125" y2="144" stroke="#555" strokeWidth="6" strokeLinecap="round" />
      {/* Ground */}
      <line x1="20" y1="244" x2="180" y2="244" stroke="#1a1a1a" strokeWidth="2" />
      {/* Legs flat on ground (heels) */}
      <line x1="155" y1={lp(208, 190)} x2="168" y2="244" stroke="#b45309" strokeWidth="12" strokeLinecap="round" />
      <line x1="163" y1={lp(210, 192)} x2="174" y2="244" stroke="#d97706" strokeWidth="10" strokeLinecap="round" />
      {/* Body inclined */}
      <line x1={bodyTopX} y1={bodyTopY} x2="160" y2={lp(208, 192)}
        stroke="url(#rw-g)" strokeWidth="16" strokeLinecap="round" filter="url(#rw-f)" />
      {/* Upper arm */}
      <line x1={bodyTopX + 8} y1={bodyTopY + 8} x2="56" y2={elbowY} stroke="#fbbf24" strokeWidth="10" strokeLinecap="round" />
      {/* Forearm to bar */}
      <line x1="56" y1={elbowY} x2="76" y2="144" stroke="#fcd34d" strokeWidth="9" strokeLinecap="round" />
      <circle cx="56" cy={elbowY} r="5" fill="#fff" opacity="0.65" filter="url(#rw-f)" />
      {/* Head */}
      <circle cx={bodyTopX - 2} cy={bodyTopY - 14} r="13" fill="url(#rw-g)" filter="url(#rw-f)" />
      {/* Back activation */}
      {t > 0.3 && (
        <ellipse cx={lp(95, 82)} cy={lp(178, 152)} rx="15" ry="6"
          fill="#fbbf24" opacity={t * 0.45} filter="url(#rw-f)" />
      )}
    </svg>
  );
}

// ─── DIP (Parallel-bar / chair dip) ─────────────────────────────────────────
function DipFigure({ t }: { t: number }) {
  const lp = (a: number, b: number) => a + (b - a) * t;
  const hipY   = lp(148, 198); // drops as elbows bend
  const elbowY = lp(130, 168);
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      <defs>
        <linearGradient id="dp-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        {GLOW_FILTER("dp-f")}
      </defs>
      {/* Parallel bars */}
      <line x1="50" y1="118" x2="50" y2="244" stroke="#333" strokeWidth="5" />
      <line x1="150" y1="118" x2="150" y2="244" stroke="#333" strokeWidth="5" />
      <line x1="38" y1="118" x2="62" y2="118" stroke="#555" strokeWidth="6" strokeLinecap="round" />
      <line x1="138" y1="118" x2="162" y2="118" stroke="#555" strokeWidth="6" strokeLinecap="round" />
      {/* Ground */}
      <line x1="20" y1="244" x2="180" y2="244" stroke="#1a1a1a" strokeWidth="2" />
      {/* Legs hanging */}
      <line x1="95"  y1={hipY + 10} x2="84"  y2={hipY + 100} stroke="#b91c1c" strokeWidth="11" strokeLinecap="round" />
      <line x1="105" y1={hipY + 10} x2="116" y2={hipY + 100} stroke="#ef4444" strokeWidth="10" strokeLinecap="round" />
      {/* Torso */}
      <path
        d={`M82,${hipY - 50} L118,${hipY - 50} L112,${hipY + 8} L88,${hipY + 8} Z`}
        fill="url(#dp-g)" filter="url(#dp-f)"
      />
      {/* Arms: upper arm from shoulder to elbow */}
      <line x1="82"  y1={hipY - 42} x2="50"  y2={elbowY} stroke="#f87171" strokeWidth="10" strokeLinecap="round" />
      <line x1="118" y1={hipY - 42} x2="150" y2={elbowY} stroke="#f87171" strokeWidth="10" strokeLinecap="round" />
      {/* Forearm: elbow to hand (on bar) */}
      <line x1="50"  y1={elbowY} x2="50"  y2="118" stroke="#fca5a5" strokeWidth="9" strokeLinecap="round" />
      <line x1="150" y1={elbowY} x2="150" y2="118" stroke="#fca5a5" strokeWidth="9" strokeLinecap="round" />
      <circle cx="50"  cy={elbowY} r="5" fill="#fff" opacity="0.65" filter="url(#dp-f)" />
      <circle cx="150" cy={elbowY} r="5" fill="#fff" opacity="0.65" filter="url(#dp-f)" />
      {/* Head */}
      <circle cx="100" cy={hipY - 64} r="15" fill="url(#dp-g)" filter="url(#dp-f)" />
      {/* Tricep activation */}
      {t > 0.35 && (
        <>
          <ellipse cx="60"  cy={lp(130, 158)} rx="11" ry="5" fill="#f87171" opacity={t * 0.5} filter="url(#dp-f)" />
          <ellipse cx="140" cy={lp(130, 158)} rx="11" ry="5" fill="#f87171" opacity={t * 0.5} filter="url(#dp-f)" />
        </>
      )}
    </svg>
  );
}

// ─── L-SIT ───────────────────────────────────────────────────────────────────
function LsitFigure({ t }: { t: number }) {
  // Static hold — only a subtle breathing tension pulse
  const pulse  = Math.sin(t * Math.PI * 4) * 1.2;
  const glow   = 0.35 + Math.sin(t * Math.PI * 4) * 0.18;
  const legY   = 180 + pulse;
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      <defs>
        <linearGradient id="ls-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>
        {GLOW_FILTER("ls-f")}
      </defs>
      {/* Parallettes */}
      <line x1="35" y1="200" x2="35" y2="244" stroke="#333" strokeWidth="5" />
      <line x1="28" y1="200" x2="55" y2="200" stroke="#555" strokeWidth="6" strokeLinecap="round" />
      <line x1="165" y1="200" x2="165" y2="244" stroke="#333" strokeWidth="5" />
      <line x1="145" y1="200" x2="172" y2="200" stroke="#555" strokeWidth="6" strokeLinecap="round" />
      {/* Head */}
      <circle cx="100" cy="58" r="15" fill="url(#ls-g)" filter="url(#ls-f)" />
      {/* Torso */}
      <path d="M82,76 L118,76 L112,146 L88,146 Z" fill="url(#ls-g)" filter="url(#ls-f)" />
      {/* Arms pressing straight down to parallettes */}
      <line x1="84"  y1="88" x2="42"  y2="200" stroke="#818cf8" strokeWidth="10" strokeLinecap="round" />
      <line x1="116" y1="88" x2="158" y2="200" stroke="#818cf8" strokeWidth="10" strokeLinecap="round" />
      <circle cx="42"  cy="200" r="6" fill="#818cf8" />
      <circle cx="158" cy="200" r="6" fill="#818cf8" />
      {/* Legs extended horizontally */}
      <line x1="90"  y1="146" x2="28"  y2={legY}     stroke="#4338ca" strokeWidth="11" strokeLinecap="round" />
      <line x1="96"  y1="148" x2="34"  y2={legY + 5} stroke="#6366f1" strokeWidth="9" strokeLinecap="round" />
      <line x1="110" y1="146" x2="172" y2={legY}     stroke="#4338ca" strokeWidth="11" strokeLinecap="round" />
      <line x1="104" y1="148" x2="166" y2={legY + 5} stroke="#6366f1" strokeWidth="9" strokeLinecap="round" />
      {/* Core activation glow */}
      <ellipse cx="100" cy="128" rx="18" ry="8" fill="#818cf8" opacity={glow} filter="url(#ls-f)" />
    </svg>
  );
}

// ─── REVERSE PLANK ───────────────────────────────────────────────────────────
function ReversePlankFigure({ t }: { t: number }) {
  const breathe = Math.sin(t * Math.PI * 2) * 1.2;
  const hipY    = 152 + breathe;
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      <defs>
        <linearGradient id="rp-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        {GLOW_FILTER("rp-f")}
      </defs>
      {/* Ground */}
      <line x1="20" y1="244" x2="180" y2="244" stroke="#1a1a1a" strokeWidth="2" />
      {/* Heels on ground → body rises diagonally (face up, head to left) */}
      <line x1="154" y1={hipY + 4}  x2="164" y2="244" stroke="#ea580c" strokeWidth="12" strokeLinecap="round" />
      <line x1="162" y1={hipY + 6}  x2="172" y2="244" stroke="#f97316" strokeWidth="10" strokeLinecap="round" />
      {/* Body */}
      <line x1="44" y1={hipY - 22} x2="158" y2={hipY + 4}
        stroke="url(#rp-g)" strokeWidth="16" strokeLinecap="round" filter="url(#rp-f)" />
      {/* Alignment dash */}
      <line x1="30" y1={hipY - 22} x2="168" y2={hipY - 22}
        stroke="rgba(255,255,255,0.09)" strokeWidth="1" strokeDasharray="4 5" />
      {/* Arms behind, hands on floor */}
      <line x1="68" y1={hipY - 18} x2="65" y2="244" stroke="#fb923c" strokeWidth="10" strokeLinecap="round" />
      <circle cx="65" cy="244" r="5" fill="#fed7aa" />
      {/* Hip glow */}
      <ellipse cx="150" cy={hipY + 2} rx="14" ry="7"
        fill="#fb923c" opacity={0.38 + Math.sin(t * Math.PI * 4) * 0.18} filter="url(#rp-f)" />
      {/* Head */}
      <circle cx="32" cy={hipY - 36} r="13" fill="url(#rp-g)" filter="url(#rp-f)" />
    </svg>
  );
}

// ─── JUMPING JACK ────────────────────────────────────────────────────────────
function JumpingJackFigure({ t }: { t: number }) {
  const lp       = (a: number, b: number) => a + (b - a) * t;
  const spread   = lp(0, 38);  // leg spread
  // Arm angle from "pointing down" (0) to "overhead-spread" (2.4 rad ≈ 137°)
  const armAngle = lp(0.12, 2.4);
  const armLen   = 42;
  const bodyY1 = 80, bodyY2 = 148;

  const arm = (side: 1 | -1) => {
    const sx = 100 + side * 20, sy = bodyY1 + 10;
    // angle measured from pointing straight down; positive = outward+up
    const ex = sx + side * Math.sin(armAngle) * armLen;
    const ey = sy + Math.cos(armAngle) * armLen;
    return { sx, sy, ex, ey };
  };
  const [la, ra] = [arm(-1), arm(1)];

  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      <defs>
        <linearGradient id="jj-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        {GLOW_FILTER("jj-f")}
      </defs>
      <line x1="30" y1="244" x2="170" y2="244" stroke="#1a1a1a" strokeWidth="2" />
      <ellipse cx="100" cy="248" rx={lp(14, 36)} ry="5" fill="rgba(74,222,128,0.2)" />
      <circle cx="100" cy="54" r="15" fill="url(#jj-g)" filter="url(#jj-f)" />
      <path d={`M80,${bodyY1} L120,${bodyY1} L112,${bodyY2} L88,${bodyY2} Z`}
        fill="url(#jj-g)" filter="url(#jj-f)" />
      {[la, ra].map((a, i) => (
        <line key={i} x1={a.sx} y1={a.sy} x2={a.ex} y2={a.ey}
          stroke="#4ade80" strokeWidth="10" strokeLinecap="round" />
      ))}
      {([-1, 1] as const).map((side, i) => (
        <line key={i}
          x1={100 + side * 12} y1={bodyY2}
          x2={100 + side * spread} y2="244"
          stroke={i === 0 ? "#16a34a" : "#22c55e"} strokeWidth="11" strokeLinecap="round" />
      ))}
    </svg>
  );
}

// ─── JOINT ROTATION (Warm-up arm circles) ────────────────────────────────────
function JointRotationFigure({ t }: { t: number }) {
  // t goes 0→1 as a continuous loop (arm makes a full circle)
  const angle = t * Math.PI * 2;
  const R = 44; // arm length
  const sx = 118, sy = 100; // shoulder
  const hx = sx + Math.sin(angle) * R;
  const hy = sy + Math.cos(angle) * R;
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      <defs>
        <linearGradient id="jr-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e879f9" />
          <stop offset="100%" stopColor="#a21caf" />
        </linearGradient>
        {GLOW_FILTER("jr-f")}
      </defs>
      <line x1="40" y1="244" x2="160" y2="244" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="88" cy="54" r="15" fill="url(#jr-g)" filter="url(#jr-f)" />
      <path d="M70,72 L106,72 L102,146 L74,146 Z" fill="url(#jr-g)" filter="url(#jr-f)" />
      {/* Static left arm */}
      <line x1="70" y1="86" x2="44" y2="130" stroke="#e879f9" strokeWidth="10" strokeLinecap="round" />
      <line x1="44" y1="130" x2="40" y2="172" stroke="#f0abfc" strokeWidth="8" strokeLinecap="round" />
      {/* Circle path indicator */}
      <circle cx={sx} cy={sy} r={R} stroke="#e879f9" strokeWidth="1"
        strokeDasharray="5 6" fill="none" opacity="0.2" />
      {/* Rotating right arm */}
      <line x1={sx} y1={sy} x2={hx} y2={hy} stroke="#e879f9" strokeWidth="10" strokeLinecap="round" filter="url(#jr-f)" />
      <circle cx={hx} cy={hy} r="7" fill="#f0abfc" opacity="0.85" filter="url(#jr-f)" />
      {/* Legs */}
      <line x1="77"  y1="146" x2="66"  y2="244" stroke="#a21caf" strokeWidth="11" strokeLinecap="round" />
      <line x1="95"  y1="146" x2="104" y2="244" stroke="#c026d3" strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}

// ─── HYDRATE / DRINK ─────────────────────────────────────────────────────────
function HydrateFigure({ t }: { t: number }) {
  const lp = (a: number, b: number) => a + (b - a) * t;
  const elbowY = lp(142, 108);
  const cupX   = lp(76, 64);
  const cupY   = lp(150, 88);
  const tilt   = lp(0, 28); // degrees

  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%">
      <defs>
        <linearGradient id="hd-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="hd-w" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.7" />
        </linearGradient>
        {GLOW_FILTER("hd-f")}
      </defs>
      <line x1="40" y1="244" x2="160" y2="244" stroke="#1a1a1a" strokeWidth="2" />
      {/* Head tilts back slightly when drinking */}
      <circle cx="100" cy={lp(55, 60)} r="15" fill="url(#hd-g)" filter="url(#hd-f)" />
      {/* Torso */}
      <path d="M82,74 L118,74 L112,148 L88,148 Z" fill="url(#hd-g)" filter="url(#hd-f)" />
      {/* Static right arm */}
      <line x1="116" y1="86" x2="130" y2="142" stroke="#38bdf8" strokeWidth="10" strokeLinecap="round" />
      <line x1="130" y1="142" x2="128" y2="188" stroke="#7dd3fc" strokeWidth="9" strokeLinecap="round" />
      {/* Left arm lifting cup */}
      <line x1="84" y1="86" x2="70" y2={elbowY} stroke="#38bdf8" strokeWidth="10" strokeLinecap="round" />
      <line x1="70" y1={elbowY} x2={cupX} y2={cupY} stroke="#7dd3fc" strokeWidth="9" strokeLinecap="round" />
      <circle cx="70" cy={elbowY} r="5" fill="#fff" opacity="0.6" filter="url(#hd-f)" />
      {/* Cup */}
      <g transform={`rotate(${-tilt}, ${cupX}, ${cupY})`}>
        <path d={`M${cupX - 10},${cupY} L${cupX + 10},${cupY} L${cupX + 7},${cupY + 22} L${cupX - 7},${cupY + 22} Z`}
          fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
        {/* Water level inside cup */}
        <path d={`M${cupX - lp(8, 4)},${cupY + lp(15, 3)} L${cupX + lp(8, 4)},${cupY + lp(15, 3)} L${cupX + 7},${cupY + 22} L${cupX - 7},${cupY + 22} Z`}
          fill="url(#hd-w)" opacity={1 - t * 0.65} />
      </g>
      {/* Water drops when drinking */}
      {t > 0.55 && (
        <>
          <circle cx={cupX + 5} cy={cupY - 5} r={lp(0, 4)} fill="#bae6fd" opacity={1 - t} filter="url(#hd-f)" />
          <circle cx={cupX - 3} cy={cupY - 9} r={lp(0, 3)} fill="#38bdf8" opacity={1 - t} filter="url(#hd-f)" />
        </>
      )}
      {/* Legs */}
      <line x1="90"  y1="148" x2="80"  y2="244" stroke="#0369a1" strokeWidth="11" strokeLinecap="round" />
      <line x1="108" y1="148" x2="116" y2="244" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}

// ─── Figure registry ─────────────────────────────────────────────────────────
const FIGURES: Record<IllustrationKey, React.ComponentType<{ t: number }>> = {
  squat:           SquatFigure,
  row:             RowFigure,
  dip:             DipFigure,
  lsit:            LsitFigure,
  pushup:          PushupFigure,
  pull:            PullFigure,
  plank:           PlankFigure,
  "reverse-plank": ReversePlankFigure,
  "jumping-jack":  JumpingJackFigure,
  "joint-rotation": JointRotationFigure,
  hydrate:         HydrateFigure,
  drink:           HydrateFigure,
};

// Ambient glow color per exercise
const GLOW: Record<IllustrationKey, string> = {
  squat:            "#7c3aed",
  row:              "#b45309",
  dip:              "#b91c1c",
  lsit:             "#4338ca",
  pushup:           "#1d4ed8",
  pull:             "#7e22ce",
  plank:            "#065f46",
  "reverse-plank":  "#ea580c",
  "jumping-jack":   "#16a34a",
  "joint-rotation": "#a21caf",
  hydrate:          "#0369a1",
  drink:            "#0369a1",
};

// Animation speed (Δt per frame); joint-rotation uses a wraparound loop
const SPEEDS: Partial<Record<IllustrationKey, number>> = {
  plank:            0.006,
  "reverse-plank":  0.006,
  lsit:             0.007,
  hydrate:          0.010,
  drink:            0.010,
  "joint-rotation": 0.016,
};
const DEFAULT_SPEED = 0.013;

// ─── Main export ─────────────────────────────────────────────────────────────
export function ExerciseIllustration({ type, size = 96, active = true }: ExerciseIllustrationProps) {
  const [t, setT]   = useState(0);
  const frameRef    = useRef<number>(0);
  const dirRef      = useRef(1);
  const tRef        = useRef(0);
  const isLoop      = type === "joint-rotation"; // continuous wrap-around

  useEffect(() => {
    if (!active) {
      setT(0);
      tRef.current = 0;
      dirRef.current = 1;
      return;
    }
    const speed = SPEEDS[type] ?? DEFAULT_SPEED;

    const tick = () => {
      if (isLoop) {
        tRef.current = (tRef.current + speed) % 1;
      } else {
        tRef.current += dirRef.current * speed;
        if (tRef.current >= 1) { tRef.current = 1; dirRef.current = -1; }
        if (tRef.current <= 0) { tRef.current = 0; dirRef.current = 1; }
      }
      setT(tRef.current);
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [type, active, isLoop]);

  const Figure        = FIGURES[type];
  const glowColor     = GLOW[type];
  const containerSize = size * 1.8;

  return (
    <div
      className="relative rounded-[2rem] overflow-hidden"
      style={{ width: containerSize, height: containerSize }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 blur-2xl opacity-25 rounded-[2rem]"
        style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
      />
      {/* Glass panel */}
      <div className="absolute inset-0 rounded-[2rem] glass-strong" />
      {/* Animated SVG */}
      <div className="absolute inset-0">
        <Figure t={t} />
      </div>
    </div>
  );
}
