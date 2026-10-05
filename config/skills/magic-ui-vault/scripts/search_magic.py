#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Magic UI Component Vault - Ultra-Fast Search Engine & Catalog CLI
File: search_magic.py
Pure Python 3 standard library (0 external dependencies).
UTF-8 console compatible on Windows/Linux/macOS.
"""

import sys
import os
import json
import argparse

# Windows console UTF-8 output reconfigure
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# ==============================================================================
# 84+ MAGIC UI COMPONENTS DICTIONARY (6 CATEGORIES)
# ==============================================================================
COMPONENTS = [
    # --------------------------------------------------------------------------
    # CATEGORY 1: AI (13 COMPONENTS)
    # --------------------------------------------------------------------------
    {
        "name": "Animated Beam",
        "slug": "animated-beam",
        "category": "ai",
        "description": "Glowing animated energy beam connecting multiple SVG nodes or icons with bidirectional flow and gradient pulses.",
        "tags": ["beam", "connection", "nodes", "flow", "ai", "svg", "path", "network", "pipeline"],
        "css": """@keyframes beam {
  0% { stroke-dashoffset: 200; opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 0; }
}
.animate-beam {
  animation: beam 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}""",
        "snippet": """// AnimatedBeam component (Luminous Light Theme)
import React from "react";

export function AnimatedBeamDemo() {
  return (
    <div className="relative flex h-[300px] w-full items-center justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-[#FAF9F6] p-8 shadow-sm">
      <div className="z-10 flex size-14 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-md">
        <span className="text-xl">🤖</span>
      </div>
      <div className="z-10 flex size-14 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-md">
        <span className="text-xl">⚡</span>
      </div>
      <div className="z-10 flex size-14 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-md">
        <span className="text-xl">🎯</span>
      </div>
      <svg className="pointer-events-none absolute inset-0 size-full" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50 150 Q 200 70 350 150" fill="none" stroke="#E2E8F0" strokeWidth="2" />
        <path d="M 50 150 Q 200 70 350 150" fill="none" stroke="url(#beam-gradient)" strokeWidth="3" strokeDasharray="30 180" className="animate-beam" />
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}"""
    },
    {
        "name": "Orbiting Circles",
        "slug": "orbiting-circles",
        "category": "ai",
        "description": "Concentric rotating circular rings with orbiting child icons or tech badges moving in harmonious orbital paths.",
        "tags": ["orbit", "circles", "satellites", "rotation", "ai", "icons", "ring", "solar"],
        "css": """@keyframes orbit {
  0% { transform: rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg); }
  100% { transform: rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg); }
}
.animate-orbit {
  animation: orbit var(--duration, 20s) linear infinite;
}""",
        "snippet": """// OrbitingCircles component (Luminous Light Theme)
import React from "react";

export function OrbitingCirclesDemo() {
  return (
    <div className="relative flex h-[340px] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-[#FAF9F6]">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent">
        Agents
      </span>
      {/* Concentric Orbit Paths */}
      <div className="pointer-events-none absolute size-[160px] rounded-full border border-slate-300/60" />
      <div className="pointer-events-none absolute size-[260px] rounded-full border border-slate-300/40" />
      {/* Orbiting Icons */}
      <div className="animate-orbit absolute flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm" style={{"--radius": "80", "--duration": "14s"}}>
        <span className="text-base">🧠</span>
      </div>
      <div className="animate-orbit absolute flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm" style={{"--radius": "130", "--duration": "22s"}}>
        <span className="text-base">✨</span>
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Pulsating Button",
        "slug": "pulsating-button",
        "category": "ai",
        "description": "High-conversion AI action button with soft radial expanding radar pulse ripples that draw user focus.",
        "tags": ["button", "pulse", "cta", "ai", "ripple", "action", "radar"],
        "css": """@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.35); opacity: 0; }
  100% { transform: scale(1.35); opacity: 0; }
}
.animate-pulse-ring {
  animation: pulse-ring 2.2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
}""",
        "snippet": """// PulsatingButton component (Luminous Light Theme)
import React from "react";

export function PulsatingButton({ children = "Ask AI Assistant" }) {
  return (
    <div className="relative inline-flex items-center justify-center">
      <div className="animate-pulse-ring absolute inset-0 rounded-xl bg-blue-500/20" />
      <button className="relative z-10 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-md transition-transform duration-150 active:scale-95 hover:shadow-lg">
        <span>✨</span>
        <span>{children}</span>
      </button>
    </div>
  );
}"""
    },
    {
        "name": "Shimmer Button",
        "slug": "shimmer-button",
        "category": "ai",
        "description": "Luxurious CTA button with metallic shimmering border beam circulating smoothly around perimeter.",
        "tags": ["button", "shimmer", "metallic", "glow", "cta", "border", "premium"],
        "css": """@keyframes shimmer-slide {
  to { transform: rotate(360deg); }
}
.animate-shimmer-spin {
  animation: shimmer-slide 3s linear infinite;
}""",
        "snippet": """// ShimmerButton component (Luminous Light Theme)
import React from "react";

export function ShimmerButton({ children = "Upgrade to Pro" }) {
  return (
    <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-[1px] font-semibold text-slate-800 transition active:scale-95 shadow-sm hover:shadow-md">
      <span className="animate-shimmer-spin absolute inset-[-100%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#3B82F6_50%,#E2E8F0_100%)]" />
      <span className="relative inline-flex size-full items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-medium backdrop-blur-3xl transition group-hover:bg-slate-50">
        {children}
      </span>
    </button>
  );
}"""
    },
    {
        "name": "Animated Gradient Text",
        "slug": "animated-gradient-text",
        "category": "ai",
        "description": "Radiant animated linear gradient heading badge with shimmering flowing spectrum and border accent.",
        "tags": ["text", "gradient", "badge", "animated", "ai", "heading", "pill"],
        "css": """@keyframes gradient-flow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-gradient-flow {
  background-size: 200% auto;
  animation: gradient-flow 4s ease infinite;
}""",
        "snippet": """// AnimatedGradientText component (Luminous Light Theme)
import React from "react";

export function AnimatedGradientTextDemo() {
  return (
    <div className="group relative mx-auto flex items-center justify-center rounded-full border border-slate-200/90 bg-white/90 px-4 py-1.5 shadow-sm transition-all duration-300 hover:shadow-md">
      <span className="animate-gradient-flow bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-xs font-semibold uppercase tracking-wider text-transparent">
        🎉 Introducing AI Canvas v2.0
      </span>
      <span className="ml-1 text-xs text-slate-400">→</span>
    </div>
  );
}"""
    },
    {
        "name": "Avatar Circles",
        "slug": "avatar-circles",
        "category": "ai",
        "description": "Overlapping stack of collaborative user/agent avatars with tooltip and remaining counter pill.",
        "tags": ["avatar", "stack", "users", "team", "ai-agents", "counter", "collaborators"],
        "css": """.avatar-ring {
  box-shadow: 0 0 0 2px #FFFFFF;
}""",
        "snippet": """// AvatarCircles component (Luminous Light Theme)
import React from "react";

export function AvatarCircles({ numPeople = 99, avatarUrls = [] }) {
  return (
    <div className="flex items-center -space-x-2">
      {avatarUrls.map((url, i) => (
        <img key={i} src={url} alt={`Member ${i}`} className="avatar-ring size-9 rounded-full object-cover" />
      ))}
      <div className="avatar-ring flex size-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
        +{numPeople}
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Copilot Bubble",
        "slug": "copilot-bubble",
        "category": "ai",
        "description": "Floating conversational AI suggestion pill with breathing glow aura and click-to-fill prompt.",
        "tags": ["copilot", "bubble", "ai", "prompt", "suggestion", "chat", "assistant"],
        "css": """@keyframes bubble-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
}
.animate-bubble-float {
  animation: bubble-float 3s ease-in-out infinite;
}""",
        "snippet": """// CopilotBubble component (Luminous Light Theme)
import React from "react";

export function CopilotBubble({ suggestion = "Explain this architecture diagram" }) {
  return (
    <button className="animate-bubble-float inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-4 py-2 text-xs font-medium text-blue-700 shadow-sm backdrop-blur-md transition hover:bg-blue-100/80 hover:shadow">
      <span>💡</span>
      <span>{suggestion}</span>
    </button>
  );
}"""
    },
    {
        "name": "Prompt Input Bar",
        "slug": "prompt-input",
        "category": "ai",
        "description": "Modern multi-modal AI prompt bar with auto-expanding textarea, chip attachments, and submit button.",
        "tags": ["input", "prompt", "ai", "textarea", "chat", "search", "bar"],
        "css": """.prompt-focus-ring:focus-within {
  box-shadow: 0 0 0 2px #3B82F6, 0 10px 25px -5px rgba(59, 130, 246, 0.1);
}""",
        "snippet": """// PromptInputBar component (Luminous Light Theme)
import React, { useState } from "react";

export function PromptInputBar() {
  const [val, setVal] = useState("");
  return (
    <div className="prompt-focus-ring relative flex w-full max-w-xl items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition-all">
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Ask anything or generate a UI component..."
        className="w-full bg-transparent px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none"
      />
      <button className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-800 active:scale-95">
        ↑
      </button>
    </div>
  );
}"""
    },
    {
        "name": "Voice Wave Visualizer",
        "slug": "voice-wave",
        "category": "ai",
        "description": "Dynamic rhythmic voice frequency equalizer bars for AI speech synthesis, recording, or listening state.",
        "tags": ["voice", "wave", "audio", "sound", "equalizer", "speech", "ai"],
        "css": """@keyframes wave-bounce {
  0%, 100% { height: 6px; }
  50% { height: 28px; }
}
.wave-bar {
  animation: wave-bounce 1.2s ease-in-out infinite;
}""",
        "snippet": """// VoiceWaveVisualizer component (Luminous Light Theme)
import React from "react";

export function VoiceWaveVisualizer() {
  const delays = ["0ms", "150ms", "300ms", "450ms", "200ms", "350ms"];
  return (
    <div className="flex h-10 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 shadow-sm">
      {delays.map((delay, idx) => (
        <span
          key={idx}
          className="wave-bar w-1 rounded-full bg-blue-600"
          style={{ animationDelay: delay }}
        />
      ))}
      <span className="ml-2 text-xs font-medium text-slate-600">AI Speaking...</span>
    </div>
  );
}"""
    },
    {
        "name": "Thinking Indicator",
        "slug": "thinking-indicator",
        "category": "ai",
        "description": "Multi-phase breathing pulse wave indicator reflecting deep reasoning and chain-of-thought processing.",
        "tags": ["thinking", "reasoning", "cot", "loader", "pulse", "ai", "status"],
        "css": """@keyframes breathe {
  0%, 100% { transform: scale(0.8); opacity: 0.4; }
  50% { transform: scale(1.1); opacity: 1; }
}
.animate-breathe {
  animation: breathe 1.6s ease-in-out infinite;
}""",
        "snippet": """// ThinkingIndicator component (Luminous Light Theme)
import React from "react";

export function ThinkingIndicator({ label = "Thinking deeply..." }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-3.5 py-1.5 text-xs font-medium text-amber-800 shadow-sm">
      <span className="animate-breathe size-2 rounded-full bg-amber-500" />
      <span>{label}</span>
    </div>
  );
}"""
    },
    {
        "name": "Token Budget Counter",
        "slug": "token-counter",
        "category": "ai",
        "description": "Real-time context window token meter with color-coded warning tiers and consumption rate ticker.",
        "tags": ["tokens", "budget", "meter", "context-window", "counter", "ai", "stats"],
        "css": """.token-bar-fill {
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}""",
        "snippet": """// TokenBudgetCounter component (Luminous Light Theme)
import React from "react";

export function TokenBudgetCounter({ used = 42500, total = 128000 }) {
  const pct = Math.round((used / total) * 100);
  return (
    <div className="w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
        <span>Context Budget</span>
        <span className="font-semibold text-slate-900">{pct}% ({used.toLocaleString()} tok)</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="token-bar-fill h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Agent Swarm Node",
        "slug": "agent-swarm-node",
        "category": "ai",
        "description": "Interactive multi-agent network node displaying telemetry status, latency metrics, and pod health.",
        "tags": ["swarm", "node", "multi-agent", "telemetry", "pod", "health", "graph"],
        "css": """.swarm-node-active {
  box-shadow: 0 0 0 1px #3B82F6, 0 4px 12px rgba(59, 130, 246, 0.15);
}""",
        "snippet": """// AgentSwarmNode component (Luminous Light Theme)
import React from "react";

export function AgentSwarmNode({ name = "Pod 4: Visual UI", status = "active", role = "Design Duo" }) {
  return (
    <div className="swarm-node-active flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
      <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-xs">
        P4
      </div>
      <div>
        <div className="text-xs font-semibold text-slate-900">{name}</div>
        <div className="text-[11px] text-slate-500">{role} • <span className="text-emerald-600 font-medium">Running</span></div>
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Code Block Streamer",
        "slug": "code-block-stream",
        "category": "ai",
        "description": "Syntax-highlighted streaming code container with typing cursor, line numbering, and copy-to-clipboard button.",
        "tags": ["code", "stream", "syntax", "editor", "copy", "ai", "terminal"],
        "css": """@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.animate-cursor {
  animation: cursor-blink 0.9s infinite;
}""",
        "snippet": """// CodeBlockStreamer component (Luminous Light Theme)
import React, { useState } from "react";

export function CodeBlockStreamer({ code = "const greeting = 'Hello World';", language = "typescript" }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm text-xs font-mono">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2">
        <span className="font-semibold text-slate-600">{language}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); }} className="text-slate-500 hover:text-slate-900">
          {copied ? "Copied! ✓" : "Copy"}
        </button>
      </div>
      <pre className="p-4 text-slate-800 overflow-x-auto">
        <code>{code}</code>
        <span className="animate-cursor ml-0.5 inline-block h-3.5 w-1.5 bg-blue-600 align-middle" />
      </pre>
    </div>
  );
}"""
    },

    # --------------------------------------------------------------------------
    # CATEGORY 2: CARDS (15 COMPONENTS)
    # --------------------------------------------------------------------------
    {
        "name": "Bento Grid",
        "slug": "bento-grid",
        "category": "cards",
        "description": "Modular 3-column Bento Grid container engineered for modern SaaS product feature highlights.",
        "tags": ["bento", "grid", "cards", "layout", "saas", "dashboard", "features"],
        "css": """.bento-grid-container {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}""",
        "snippet": """// BentoGrid container (Luminous Light Theme)
import React from "react";

export function BentoGrid({ children }) {
  return (
    <div className="bento-grid-container w-full max-w-6xl mx-auto p-4">
      {children}
    </div>
  );
}"""
    },
    {
        "name": "Bento Card",
        "slug": "bento-card",
        "category": "cards",
        "description": "Individual modular Bento Card with background graphic preview, header tag, title, and hover CTA.",
        "tags": ["bento", "card", "feature", "hover", "cta", "preview"],
        "css": """.bento-card-hover {
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease;
}
.bento-card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.06), 0 4px 8px -2px rgba(0, 0, 0, 0.03);
}""",
        "snippet": """// BentoCard component (Luminous Light Theme)
import React from "react";

export function BentoCard({ name, className = "", background, Icon, description, href, cta = "Learn more" }) {
  return (
    <div className={`bento-card-hover relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 ${className}`}>
      <div className="relative z-10 flex flex-col gap-2">
        {Icon && <Icon className="size-6 text-slate-700" />}
        <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="relative z-10 mt-6 flex items-center font-medium text-xs text-blue-600">
        <span>{cta}</span>
        <span className="ml-1">→</span>
      </div>
      {background}
    </div>
  );
}"""
    },
    {
        "name": "Magic Card",
        "slug": "magic-card",
        "category": "cards",
        "description": "High-fidelity interactive card with cursor-following radial spotlight highlight and perimeter border glow.",
        "tags": ["card", "magic", "spotlight", "glow", "radial", "cursor", "interactive"],
        "css": """.magic-card-glow {
  background: radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(59, 130, 246, 0.08), transparent 80%);
}""",
        "snippet": """// MagicCard component (Luminous Light Theme)
import React, { useRef } from "react";

export function MagicCard({ children, className = "" }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`magic-card-glow relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}"""
    },
    {
        "name": "Border Beam",
        "slug": "border-beam",
        "category": "cards",
        "description": "Luminous animated laser beam traveling continuously around the border perimeter of any card.",
        "tags": ["beam", "border", "laser", "glow", "card", "perimeter", "animated"],
        "css": """@keyframes border-beam {
  100% { offset-distance: 100%; }
}
.animate-border-beam {
  animation: border-beam calc(var(--duration, 8) * 1s) infinite linear;
}""",
        "snippet": """// BorderBeam component (Luminous Light Theme)
import React from "react";

export function BorderBeam({ size = 200, duration = 8, delay = 0, colorFrom = "#3B82F6", colorTo = "#10B981" }) {
  return (
    <div
      style={{
        "--size": size,
        "--duration": duration,
        "--delay": -delay,
        "--color-from": colorFrom,
        "--color-to": colorTo,
      }}
      className="pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width,1.5)*1px)_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)] after:animate-border-beam after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:[animation-delay:calc(var(--delay)*1s)] after:[offset-anchor:calc(var(--anchor,100)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)]"
    />
  );
}"""
    },
    {
        "name": "Shine Border",
        "slug": "shine-border",
        "category": "cards",
        "description": "Multi-colored continuous rotating conic gradient border glow highlighting card borders seamlessly.",
        "tags": ["border", "shine", "conic", "gradient", "card", "glow", "rotating"],
        "css": """@keyframes shine-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.animate-shine-spin {
  animation: shine-spin 14s linear infinite;
}""",
        "snippet": """// ShineBorder component (Luminous Light Theme)
import React from "react";

export function ShineBorder({ children, className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-[1.5px] ${className}`}>
      <div className="animate-shine-spin absolute -inset-[200%] bg-[conic-gradient(from_0deg,#3B82F6,#10B981,#F59E0B,#3B82F6)] opacity-60" />
      <div className="relative rounded-2xl bg-white p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Magnifying Lens",
        "slug": "lens",
        "category": "cards",
        "description": "Interactive magnifying glass lens overlay zooming in on intricate diagrams, mockups, or typography.",
        "tags": ["lens", "zoom", "magnifier", "preview", "inspection", "hover", "card"],
        "css": """.lens-portal {
  pointer-events: none;
  border-radius: 9999px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), inset 0 0 0 2px rgba(255, 255, 255, 0.8);
}""",
        "snippet": """// MagnifyingLens component (Luminous Light Theme)
import React, { useState } from "react";

export function MagnifyingLens({ src, alt = "Preview" }) {
  const [pos, setPos] = useState({ x: 0, y: 0, show: false });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, show: true });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos((p) => ({ ...p, show: false }))}
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white"
    >
      <img src={src} alt={alt} className="w-full object-cover" />
      {pos.show && (
        <div
          className="lens-portal absolute size-32 border border-blue-400 bg-white/20 backdrop-blur-none"
          style={{
            top: pos.y - 64,
            left: pos.x - 64,
            backgroundImage: `url(${src})`,
            backgroundPosition: `${-pos.x * 2 + 64}px ${-pos.y * 2 + 64}px`,
            backgroundSize: "200%",
          }}
        />
      )}
    </div>
  );
}"""
    },
    {
        "name": "Meteors Card",
        "slug": "meteors-card",
        "category": "cards",
        "description": "Feature display card with animated shooting star meteors traversing across the card canvas.",
        "tags": ["meteors", "stars", "card", "shooting-stars", "background", "animation"],
        "css": """@keyframes meteor {
  0% { transform: rotate(215deg) translateX(0); opacity: 1; }
  70% { opacity: 1; }
  100% { transform: rotate(215deg) translateX(-500px); opacity: 0; }
}
.animate-meteor-effect {
  animation: meteor 5s linear infinite;
}""",
        "snippet": """// MeteorsCard component (Luminous Light Theme)
import React from "react";

export function MeteorsCard({ title = "Next-Gen Engine", description = "Accelerated runtime with zero lag." }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-[#FAF9F6] to-white p-6 shadow-sm">
      <span className="animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-blue-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg] before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-blue-500 before:to-transparent" />
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}"""
    },
    {
        "name": "Tilt Card",
        "slug": "tilt-card",
        "category": "cards",
        "description": "3D spring-physics gyroscopic tilt card tilting fluidly in perspective according to cursor coordinates.",
        "tags": ["tilt", "3d", "card", "perspective", "gyroscope", "spring", "physics"],
        "css": """.tilt-card-wrapper {
  perspective: 1000px;
}
.tilt-card-inner {
  transition: transform 0.15s ease-out;
  transform-style: preserve-3d;
}""",
        "snippet": """// TiltCard component (Luminous Light Theme)
import React, { useRef } from "react";

export function TiltCard({ children }) {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `rotateX(${-y / 15}deg) rotateY(${x / 15}deg)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = `rotateX(0deg) rotateY(0deg)`;
  };

  return (
    <div className="tilt-card-wrapper inline-block">
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="tilt-card-inner rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {children}
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Glow Card",
        "slug": "glow-card",
        "category": "cards",
        "description": "Subtle luminous ambient glow card with dual-layer key & ambient drop shadows.",
        "tags": ["glow", "shadow", "ambient", "card", "luminous", "hover"],
        "css": """.luminous-card-shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.03), 0 0 0 1px rgba(226, 232, 240, 0.8);
}
.luminous-card-shadow:hover {
  box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.08), 0 8px 10px -6px rgba(59, 130, 246, 0.04), 0 0 0 1px rgba(59, 130, 246, 0.3);
}""",
        "snippet": """// GlowCard component (Luminous Light Theme)
import React from "react";

export function GlowCard({ title = "Deep Integration", description = "Seamlessly connect with your existing tools." }) {
  return (
    <div className="luminous-card-shadow relative rounded-2xl bg-white p-6 transition-all duration-300">
      <h4 className="text-base font-semibold text-slate-900">{title}</h4>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}"""
    },
    {
        "name": "Neon Gradient Card",
        "slug": "neon-gradient-card",
        "category": "cards",
        "description": "High-contrast colorful gradient border card creating a striking modern neon frame on light background.",
        "tags": ["neon", "gradient", "border", "card", "vibrant", "frame"],
        "css": """.neon-gradient-border {
  background: linear-gradient(135deg, #6366F1, #EC4899, #F59E0B);
}""",
        "snippet": """// NeonGradientCard component (Luminous Light Theme)
import React from "react";

export function NeonGradientCard({ children }) {
  return (
    <div className="neon-gradient-border rounded-2xl p-[2px] shadow-sm">
      <div className="rounded-[14px] bg-white p-6">
        {children}
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Direction-Aware Hover Card",
        "slug": "direction-aware-hover",
        "category": "cards",
        "description": "Card revealing an interactive overlay sliding in smoothly from the exact compass direction cursor entered.",
        "tags": ["direction", "hover", "card", "overlay", "compass", "smooth"],
        "css": """.direction-card-overlay {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}""",
        "snippet": """// DirectionAwareHoverCard component (Luminous Light Theme)
import React, { useState } from "react";

export function DirectionAwareHoverCard({ title = "Interactive Preview", imgUrl }) {
  const [direction, setDirection] = useState("top");

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    if (angle >= -45 && angle < 45) setDirection("right");
    else if (angle >= 45 && angle < 135) setDirection("bottom");
    else if (angle >= -135 && angle < -45) setDirection("top");
    else setDirection("left");
  };

  return (
    <div onMouseEnter={handleMouseEnter} className="group relative h-64 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <img src={imgUrl} alt={title} className="size-full object-cover" />
      <div className="absolute inset-0 flex items-center justify-center bg-white/90 p-4 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
        <h4 className="font-semibold text-slate-900">{title}</h4>
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Card Stack",
        "slug": "card-stack",
        "category": "cards",
        "description": "Stacked cards with spring tension, offset elevation, and sequential cycling on swipe or click.",
        "tags": ["stack", "cards", "cycle", "swipe", "spring", "deck", "rotation"],
        "css": """.card-stack-offset-0 { transform: translateY(0px) scale(1); z-index: 3; }
.card-stack-offset-1 { transform: translateY(12px) scale(0.95); z-index: 2; opacity: 0.8; }
.card-stack-offset-2 { transform: translateY(24px) scale(0.9); z-index: 1; opacity: 0.6; }""",
        "snippet": """// CardStack component (Luminous Light Theme)
import React, { useState } from "react";

export function CardStack({ items = [] }) {
  const [deck, setDeck] = useState(items);
  const cycle = () => setDeck((prev) => [...prev.slice(1), prev[0]]);

  return (
    <div className="relative h-64 w-80 cursor-pointer" onClick={cycle}>
      {deck.slice(0, 3).map((item, idx) => (
        <div
          key={item.id}
          className={`card-stack-offset-${idx} absolute inset-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300`}
        >
          <p className="text-sm font-medium text-slate-800">{item.content}</p>
          <span className="mt-4 block text-xs text-slate-400">{item.author}</span>
        </div>
      ))}
    </div>
  );
}"""
    },
    {
        "name": "3D Flip Card",
        "slug": "flip-card",
        "category": "cards",
        "description": "Double-sided 3D flipping card rotating 180 degrees to reveal back-side details on hover or trigger.",
        "tags": ["flip", "card", "3d", "double-sided", "perspective", "backface"],
        "css": """.flip-card-wrapper { perspective: 1000px; }
.flip-card-inner {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}
.flip-card-wrapper:hover .flip-card-inner { transform: rotateY(180deg); }
.flip-card-front, .flip-card-back {
  backface-visibility: hidden;
}
.flip-card-back { transform: rotateY(180deg); }""",
        "snippet": """// 3DFlipCard component (Luminous Light Theme)
import React from "react";

export function FlipCard({ front, back }) {
  return (
    <div className="flip-card-wrapper size-72">
      <div className="flip-card-inner relative size-full">
        <div className="flip-card-front absolute inset-0 flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {front}
        </div>
        <div className="flip-card-back absolute inset-0 flex items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-md">
          {back}
        </div>
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Spotlight Card",
        "slug": "spotlight-card",
        "category": "cards",
        "description": "Card illuminating subtle mesh textures and luminous borders along the exact cursor focal point.",
        "tags": ["spotlight", "card", "cursor", "mesh", "focus", "interactive"],
        "css": """.spotlight-gradient {
  background: radial-gradient(400px circle at var(--x, 100px) var(--y, 100px), rgba(243, 244, 246, 0.8), transparent 80%);
}""",
        "snippet": """// SpotlightCard component (Luminous Light Theme)
import React, { useRef } from "react";

export function SpotlightCard({ children }) {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="spotlight-gradient relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm"
    >
      {children}
    </div>
  );
}"""
    },
    {
        "name": "Glassmorphic Card",
        "slug": "glassmorphic-card",
        "category": "cards",
        "description": "Frosted glass container with backdrop blur, specular top highlight, and translucent luminous border.",
        "tags": ["glass", "glassmorphic", "blur", "frosted", "card", "translucent", "specular"],
        "css": """.glass-card-specular {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
}""",
        "snippet": """// GlassmorphicCard component (Luminous Light Theme)
import React from "react";

export function GlassmorphicCard({ children, className = "" }) {
  return (
    <div className={`glass-card-specular rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}"""
    },

    # --------------------------------------------------------------------------
    # CATEGORY 3: BACKGROUNDS (14 COMPONENTS)
    # --------------------------------------------------------------------------
    {
        "name": "Retro Grid",
        "slug": "retro-grid",
        "category": "backgrounds",
        "description": "Perspective 3D retro grid plane animated toward the horizon with soft linear gradient fade.",
        "tags": ["grid", "retro", "perspective", "background", "3d", "horizon", "retro-grid"],
        "css": """@keyframes retro-grid-move {
  0% { transform: translateY(0); }
  100% { transform: translateY(60px); }
}
.animate-retro-grid {
  animation: retro-grid-move 4s linear infinite;
}""",
        "snippet": """// RetroGrid component (Luminous Light Theme)
import React from "react";

export function RetroGrid({ angle = 65 }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden [perspective:200px]">
      <div
        style={{ transform: `rotateX(${angle}deg)` }}
        className="animate-retro-grid absolute -inset-[100%] origin-top [background-image:linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_0),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_0)] [background-size:60px_60px]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-transparent" />
    </div>
  );
}"""
    },
    {
        "name": "Ripple",
        "slug": "ripple",
        "category": "backgrounds",
        "description": "Concentric pulsating circular ripples gently radiating outward across the entire screen canvas.",
        "tags": ["ripple", "background", "waves", "pulse", "circles", "concentric"],
        "css": """@keyframes ripple {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.9; }
  50% { opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
}
.animate-ripple {
  animation: ripple var(--duration, 4s) ease-out infinite;
}""",
        "snippet": """// Ripple component (Luminous Light Theme)
import React from "react";

export function Ripple({ numCircles = 6, mainCircleSize = 180 }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: numCircles }).map((_, i) => (
        <div
          key={i}
          className="animate-ripple absolute top-1/2 left-1/2 rounded-full border border-blue-500/20 bg-blue-500/[0.015]"
          style={{
            width: mainCircleSize + i * 70,
            height: mainCircleSize + i * 70,
            animationDelay: `${i * 0.45}s`,
            "--duration": "4s",
          }}
        />
      ))}
    </div>
  );
}"""
    },
    {
        "name": "Dot Pattern",
        "slug": "dot-pattern",
        "category": "backgrounds",
        "description": "Subtle repeating SVG dot matrix grid pattern with optional radial gradient mask feathering.",
        "tags": ["dots", "pattern", "grid", "background", "svg", "radial-mask"],
        "css": """.dot-pattern-mask {
  mask-image: radial-gradient(ellipse at center, white, transparent 75%);
}""",
        "snippet": """// DotPattern component (Luminous Light Theme)
import React from "react";

export function DotPattern({ width = 16, height = 16, cx = 1, cy = 1, cr = 1, className = "" }) {
  return (
    <svg className={`dot-pattern-mask pointer-events-none absolute inset-0 size-full fill-slate-300 ${className}`}>
      <defs>
        <pattern id="dot-pattern" width={width} height={height} patternUnits="userSpaceOnUse">
          <circle cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill="url(#dot-pattern)" />
    </svg>
  );
}"""
    },
    {
        "name": "Grid Pattern",
        "slug": "grid-pattern",
        "category": "backgrounds",
        "description": "Geometric architectural square grid pattern with linear and radial masking for hero backdrops.",
        "tags": ["grid", "pattern", "squares", "background", "architectural", "svg"],
        "css": """.grid-pattern-mask {
  mask-image: radial-gradient(600px circle at center, white, transparent);
}""",
        "snippet": """// GridPattern component (Luminous Light Theme)
import React from "react";

export function GridPattern({ width = 40, height = 40, x = -1, y = -1, strokeDasharray = "0", className = "" }) {
  return (
    <svg className={`grid-pattern-mask pointer-events-none absolute inset-0 size-full stroke-slate-200/80 ${className}`}>
      <defs>
        <pattern id="grid-pattern" width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" strokeDasharray={strokeDasharray} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill="url(#grid-pattern)" />
    </svg>
  );
}"""
    },
    {
        "name": "Flickering Grid",
        "slug": "flickering-grid",
        "category": "backgrounds",
        "description": "High-performance HTML5 canvas grid with subtle random square opacity flickering animation.",
        "tags": ["canvas", "flicker", "grid", "background", "performance", "squares"],
        "css": """.canvas-flicker-container {
  mask-image: radial-gradient(ellipse at center, white, transparent 80%);
}""",
        "snippet": """// FlickeringGrid component (Luminous Light Theme)
import React, { useRef, useEffect } from "react";

export function FlickeringGrid({ squareSize = 4, gridGap = 6, flickerChance = 0.3, color = "rgb(148, 163, 184)" }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = Math.floor(canvas.width / (squareSize + gridGap));
      const rows = Math.floor(canvas.height / (squareSize + gridGap));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() < flickerChance) {
            ctx.fillStyle = color;
            ctx.globalAlpha = Math.random() * 0.25;
            ctx.fillRect(c * (squareSize + gridGap), r * (squareSize + gridGap), squareSize, squareSize);
          }
        }
      }
      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [squareSize, gridGap, flickerChance, color]);

  return <canvas ref={canvasRef} width={800} height={400} className="canvas-flicker-container pointer-events-none absolute inset-0 size-full" />;
}"""
    },
    {
        "name": "Meteors Background",
        "slug": "meteors",
        "category": "backgrounds",
        "description": "Full-screen meteor shower effect with shooting stars streaking diagonally across the viewport.",
        "tags": ["meteors", "shooting-stars", "sky", "background", "streaks", "cosmos"],
        "css": """@keyframes meteor-streak {
  0% { transform: rotate(215deg) translateX(0); opacity: 1; }
  70% { opacity: 1; }
  100% { transform: rotate(215deg) translateX(-600px); opacity: 0; }
}
.meteor-item {
  animation: meteor-streak 4s linear infinite;
}""",
        "snippet": """// MeteorsBackground component (Luminous Light Theme)
import React from "react";

export function Meteors({ number = 20 }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: number }).map((_, i) => (
        <span
          key={i}
          className="meteor-item absolute size-1 rounded-full bg-blue-500 shadow-[0_0_0_1px_#ffffff20]"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${Math.random() * 3 + 2}s`,
          }}
        />
      ))}
    </div>
  );
}"""
    },
    {
        "name": "Particles Canvas",
        "slug": "particles",
        "category": "backgrounds",
        "description": "Interactive physics particle network connecting nearby floating points with elastic lines on mouse proximity.",
        "tags": ["particles", "network", "canvas", "interactive", "constellation", "physics"],
        "css": """.particles-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}""",
        "snippet": """// ParticlesCanvas component (Luminous Light Theme)
import React, { useRef, useEffect } from "react";

export function Particles({ quantity = 40, staticity = 50, ease = 50 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    // Lightweight canvas particle setup
    let animId;
    const particles = Array.from({ length: quantity }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(100, 116, 139, 0.4)";
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [quantity]);

  return <canvas ref={canvasRef} width={800} height={500} className="particles-layer size-full" />;
}"""
    },
    {
        "name": "Interactive Grid Pattern",
        "slug": "interactive-grid-pattern",
        "category": "backgrounds",
        "description": "Geometric grid canvas where squares dynamically highlight, shift color, and scale under cursor hover.",
        "tags": ["interactive", "grid", "hover", "squares", "canvas", "cursor"],
        "css": """.interactive-grid-square:hover {
  fill: rgba(59, 130, 246, 0.12);
  transition: fill 0.1s ease;
}""",
        "snippet": """// InteractiveGridPattern component (Luminous Light Theme)
import React, { useState } from "react";

export function InteractiveGridPattern({ width = 40, height = 40, squares = [20, 20] }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="size-full stroke-slate-200/60">
        {Array.from({ length: squares[0] }).map((_, r) =>
          Array.from({ length: squares[1] }).map((_, c) => (
            <rect
              key={`${r}-${c}`}
              x={c * width}
              y={r * height}
              width={width}
              height={height}
              fill={hovered === `${r}-${c}` ? "rgba(59, 130, 246, 0.15)" : "transparent"}
              onMouseEnter={() => setHovered(`${r}-${c}`)}
              onMouseLeave={() => setHovered(null)}
              className="transition-colors duration-150"
            />
          ))
        )}
      </svg>
    </div>
  );
}"""
    },
    {
        "name": "Radial Gradient Backdrop",
        "slug": "radial-gradient",
        "category": "backgrounds",
        "description": "Warm, multi-stop radial gradient backdrop establishing radiant depth without dark theme shadows.",
        "tags": ["radial", "gradient", "backdrop", "luminous", "depth", "soft"],
        "css": """.radial-luminous-bg {
  background: radial-gradient(circle at 50% 0%, #F1F5F9 0%, #FAF9F6 50%, #FFFFFF 100%);
}""",
        "snippet": """// RadialGradientBackdrop component (Luminous Light Theme)
import React from "react";

export function RadialGradientBackdrop({ children }) {
  return (
    <div className="radial-luminous-bg relative min-h-screen w-full">
      {children}
    </div>
  );
}"""
    },
    {
        "name": "Linear Gradient Flow",
        "slug": "linear-gradient",
        "category": "backgrounds",
        "description": "Animated gentle multi-angle linear gradient background shifting slowly between warm ivory tones.",
        "tags": ["linear", "gradient", "animated", "flow", "warm", "background"],
        "css": """@keyframes linear-bg-flow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-linear-bg {
  background: linear-gradient(-45deg, #FAF9F6, #F8FAFC, #F1F5F9, #FDFBF7);
  background-size: 300% 300%;
  animation: linear-bg-flow 12s ease infinite;
}""",
        "snippet": """// LinearGradientFlow component (Luminous Light Theme)
import React from "react";

export function LinearGradientFlow({ children }) {
  return (
    <div className="animate-linear-bg relative min-h-screen w-full">
      {children}
    </div>
  );
}"""
    },
    {
        "name": "Volumetric Light Rays",
        "slug": "light-rays",
        "category": "backgrounds",
        "description": "Sunburst volumetric light beams radiating diagonally downwards with soft atmospheric blur.",
        "tags": ["rays", "sunburst", "beams", "light", "atmospheric", "volumetric"],
        "css": """.light-rays-mask {
  background: conic-gradient(from 180deg at 50% 0%, transparent 40%, rgba(255, 255, 255, 0.6) 50%, transparent 60%);
  filter: blur(24px);
}""",
        "snippet": """// VolumetricLightRays component (Luminous Light Theme)
import React from "react";

export function VolumetricLightRays() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="light-rays-mask absolute -top-40 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 opacity-70" />
    </div>
  );
}"""
    },
    {
        "name": "Aurora Background",
        "slug": "aurora-background",
        "category": "backgrounds",
        "description": "Flowing fluid multi-colored aurora borealis ribbon wave gradient moving organically behind content.",
        "tags": ["aurora", "ribbon", "fluid", "borealis", "gradient", "wave"],
        "css": """@keyframes aurora-flow {
  0% { transform: translateY(0%) scale(1); filter: blur(40px); }
  50% { transform: translateY(-5%) scale(1.1); filter: blur(50px); }
  100% { transform: translateY(0%) scale(1); filter: blur(40px); }
}
.animate-aurora {
  animation: aurora-flow 10s ease-in-out infinite;
}""",
        "snippet": """// AuroraBackground component (Luminous Light Theme)
import React from "react";

export function AuroraBackground({ children }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FAF9F6]">
      <div className="animate-aurora pointer-events-none absolute -inset-[10%] opacity-40 [background-image:radial-gradient(ellipse_at_100%_0%,#93C5FD_15%,#C4B5FD_30%,#FDE68A_60%,transparent_80%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}"""
    },
    {
        "name": "Warp Speed Background",
        "slug": "warp-background",
        "category": "backgrounds",
        "description": "Hyperspace sci-fi warp speed star travel effect with stars accelerating radially outward.",
        "tags": ["warp", "stars", "hyperspace", "speed", "canvas", "sci-fi"],
        "css": """.warp-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
}""",
        "snippet": """// WarpSpeedBackground component (Luminous Light Theme)
import React, { useRef, useEffect } from "react";

export function WarpBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const stars = Array.from({ length: 120 }, () => ({
      x: (Math.random() - 0.5) * canvas.width,
      y: (Math.random() - 0.5) * canvas.height,
      z: Math.random() * canvas.width,
    }));
    const render = () => {
      ctx.fillStyle = "rgba(250, 249, 246, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      stars.forEach((s) => {
        s.z -= 4;
        if (s.z <= 0) s.z = canvas.width;
        const k = 128 / s.z;
        const px = s.x * k + cx;
        const py = s.y * k + cy;
        ctx.fillStyle = "#3B82F6";
        ctx.fillRect(px, py, 2, 2);
      });
      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} width={800} height={500} className="warp-canvas size-full" />;
}"""
    },
    {
        "name": "Striped Pattern",
        "slug": "striped-pattern",
        "category": "backgrounds",
        "description": "Delicate diagonal repeating striped pattern creating sophisticated tactile depth.",
        "tags": ["stripes", "diagonal", "pattern", "tactile", "texture", "background"],
        "css": """.striped-bg {
  background-image: repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.02) 0px, rgba(0, 0, 0, 0.02) 2px, transparent 2px, transparent 8px);
}""",
        "snippet": """// StripedPattern component (Luminous Light Theme)
import React from "react";

export function StripedPattern({ children }) {
  return (
    <div className="striped-bg relative min-h-screen w-full bg-[#FAF9F6]">
      {children}
    </div>
  );
}"""
    },

    # --------------------------------------------------------------------------
    # CATEGORY 4: TYPOGRAPHY (16 COMPONENTS)
    # --------------------------------------------------------------------------
    {
        "name": "Word Rotate",
        "slug": "word-rotate",
        "category": "typography",
        "description": "Smooth vertical flipping transition cycling through an array of highlighted words with spring physics.",
        "tags": ["word", "rotate", "flip", "text", "typography", "spring", "cycle"],
        "css": """.word-rotate-enter {
  animation: word-flip-up 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes word-flip-up {
  0% { transform: translateY(100%); opacity: 0; }
  100% { transform: translateY(0%); opacity: 1; }
}""",
        "snippet": """// WordRotate component (Luminous Light Theme)
import React, { useState, useEffect } from "react";

export function WordRotate({ words = ["Innovative", "Scalable", "Intelligent"], duration = 2500 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % words.length), duration);
    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <span className="inline-block overflow-hidden py-1 align-bottom">
      <span key={index} className="word-rotate-enter inline-block font-bold text-blue-600">
        {words[index]}
      </span>
    </span>
  );
}"""
    },
    {
        "name": "Typing Animation",
        "slug": "typing-animation",
        "category": "typography",
        "description": "Classic typewriter text animation typing out characters sequentially with an active blinking cursor.",
        "tags": ["typing", "typewriter", "text", "cursor", "characters", "writing"],
        "css": """@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.animate-typing-cursor {
  animation: cursor-blink 0.8s infinite;
}""",
        "snippet": """// TypingAnimation component (Luminous Light Theme)
import React, { useState, useEffect } from "react";

export function TypingAnimation({ text = "Autonomous Multi-Agent Engineering", speed = 50 }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className="font-mono text-xl font-bold text-slate-900">
      {displayed}
      <span className="animate-typing-cursor ml-1 inline-block h-5 w-2 bg-blue-600 align-middle" />
    </span>
  );
}"""
    },
    {
        "name": "Sparkles Text",
        "slug": "sparkles-text",
        "category": "typography",
        "description": "Dynamic sparkling stars and radiant glitter bursting randomly around prominent heading characters.",
        "tags": ["sparkles", "stars", "glitter", "text", "heading", "radiant"],
        "css": """@keyframes sparkle-burst {
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  50% { transform: scale(1) rotate(90deg); opacity: 1; }
  100% { transform: scale(0) rotate(180deg); opacity: 0; }
}
.animate-sparkle {
  animation: sparkle-burst 1.2s ease-in-out infinite;
}""",
        "snippet": """// SparklesText component (Luminous Light Theme)
import React from "react";

export function SparklesText({ text = "Supercharged Engine" }) {
  return (
    <div className="relative inline-block">
      <span className="animate-sparkle absolute -top-3 -left-3 text-amber-500 text-sm">✦</span>
      <span className="animate-sparkle absolute -bottom-2 -right-3 text-blue-500 text-xs" style={{ animationDelay: "400ms" }}>✦</span>
      <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">{text}</h2>
    </div>
  );
}"""
    },
    {
        "name": "Flip Text",
        "slug": "flip-text",
        "category": "typography",
        "description": "3D character rotation perspective effect staggering letter by letter when entering viewport.",
        "tags": ["flip", "text", "3d", "characters", "perspective", "stagger"],
        "css": """@keyframes flip-char {
  0% { transform: rotateX(-90deg); opacity: 0; }
  100% { transform: rotateX(0deg); opacity: 1; }
}
.char-flip {
  animation: flip-char 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}""",
        "snippet": """// FlipText component (Luminous Light Theme)
import React from "react";

export function FlipText({ word = "ANTIGRAVITY" }) {
  return (
    <div className="flex [perspective:1000px]">
      {word.split("").map((c, i) => (
        <span
          key={i}
          className="char-flip inline-block font-extrabold text-3xl text-slate-900"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </div>
  );
}"""
    },
    {
        "name": "Gradual Spacing",
        "slug": "gradual-spacing",
        "category": "typography",
        "description": "Letter spacing animation smoothly collapsing from wide expansive kerning to standard typography.",
        "tags": ["spacing", "kerning", "gradual", "text", "reveal", "wide"],
        "css": """@keyframes spacing-collapse {
  0% { letter-spacing: 0.5em; opacity: 0; filter: blur(4px); }
  100% { letter-spacing: normal; opacity: 1; filter: blur(0px); }
}
.animate-spacing-collapse {
  animation: spacing-collapse 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}""",
        "snippet": """// GradualSpacing component (Luminous Light Theme)
import React from "react";

export function GradualSpacing({ text = "ENTERPRISE PROTOCOL" }) {
  return (
    <h3 className="animate-spacing-collapse text-2xl font-bold tracking-tight text-slate-800">
      {text}
    </h3>
  );
}"""
    },
    {
        "name": "Letter Pullup",
        "slug": "letter-pullup",
        "category": "typography",
        "description": "Playful staggered character pull-up effect with elastic bouncing spring physics.",
        "tags": ["letter", "pullup", "spring", "bounce", "stagger", "elastic"],
        "css": """@keyframes letter-rise {
  0% { transform: translateY(100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.letter-rise-item {
  animation: letter-rise 0.5s cubic-bezier(0.22, 1.61, 0.36, 1) forwards;
}""",
        "snippet": """// LetterPullup component (Luminous Light Theme)
import React from "react";

export function LetterPullup({ words = "Crafting Pure Delight" }) {
  return (
    <div className="flex overflow-hidden">
      {words.split("").map((c, i) => (
        <span
          key={i}
          className="letter-rise-item inline-block text-2xl font-semibold text-slate-900"
          style={{ animationDelay: `${i * 35}ms` }}
        >
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </div>
  );
}"""
    },
    {
        "name": "Blur In Text",
        "slug": "blur-in",
        "category": "typography",
        "description": "Cinematic text reveal smoothly transitioning from heavy atmospheric blur to crisp pixel sharpness.",
        "tags": ["blur", "reveal", "cinematic", "filter", "sharp", "text"],
        "css": """@keyframes blur-reveal {
  0% { filter: blur(12px); opacity: 0; }
  100% { filter: blur(0px); opacity: 1; }
}
.animate-blur-in {
  animation: blur-reveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}""",
        "snippet": """// BlurInText component (Luminous Light Theme)
import React from "react";

export function BlurIn({ text = "Experience Fluid Speed" }) {
  return (
    <h1 className="animate-blur-in text-5xl font-black tracking-tight text-slate-900">
      {text}
    </h1>
  );
}"""
    },
    {
        "name": "Separate Away",
        "slug": "separate-away",
        "category": "typography",
        "description": "Text splits into two directional halves separating smoothly to reveal underlying subheaders.",
        "tags": ["separate", "split", "text", "reveal", "divider", "typography"],
        "css": """.split-top { animation: split-up 0.8s ease forwards; }
.split-bottom { animation: split-down 0.8s ease forwards; }
@keyframes split-up { 0% { transform: translateY(0); } 100% { transform: translateY(-8px); } }
@keyframes split-down { 0% { transform: translateY(0); } 100% { transform: translateY(8px); } }""",
        "snippet": """// SeparateAway component (Luminous Light Theme)
import React from "react";

export function SeparateAway({ upper = "ADVANCED", lower = "INTELLIGENCE" }) {
  return (
    <div className="flex flex-col items-center">
      <div className="split-top text-3xl font-extrabold text-slate-900">{upper}</div>
      <div className="h-0.5 w-16 bg-blue-500 my-2" />
      <div className="split-bottom text-3xl font-extrabold text-blue-600">{lower}</div>
    </div>
  );
}"""
    },
    {
        "name": "Scroll-Based Velocity",
        "slug": "scroll-based-velocity",
        "category": "typography",
        "description": "Marquee text stream dynamically accelerating or reversing direction proportional to scroll speed.",
        "tags": ["velocity", "scroll", "marquee", "speed", "ticker", "typography"],
        "css": """@keyframes velocity-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.animate-velocity {
  animation: velocity-scroll 18s linear infinite;
}""",
        "snippet": """// ScrollBasedVelocity component (Luminous Light Theme)
import React from "react";

export function ScrollBasedVelocity({ text = "PRECISION • INTEGRITY • DELIGHT • " }) {
  return (
    <div className="w-full overflow-hidden whitespace-nowrap border-y border-slate-200 bg-white py-3">
      <div className="animate-velocity inline-flex">
        <span className="text-xl font-bold tracking-wider text-slate-400">{text.repeat(4)}</span>
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Aurora Text",
        "slug": "aurora-text",
        "category": "typography",
        "description": "Mesmerizing multi-color fluid gradient shimmer clipped directly inside typography characters.",
        "tags": ["aurora", "gradient", "text", "shimmer", "clip", "colorful"],
        "css": """@keyframes aurora-text-shimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.aurora-text-gradient {
  background: linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B, #3B82F6);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: aurora-text-shimmer 6s linear infinite;
}""",
        "snippet": """// AuroraText component (Luminous Light Theme)
import React from "react";

export function AuroraText({ children = "The Infinite Canvas" }) {
  return (
    <span className="aurora-text-gradient font-black tracking-tight">
      {children}
    </span>
  );
}"""
    },
    {
        "name": "Hyper Text",
        "slug": "hyper-text",
        "category": "typography",
        "description": "Sci-fi matrix character scramble decryption effect cycling random glyphs until settling on text.",
        "tags": ["hyper-text", "matrix", "scramble", "decryption", "sci-fi", "random"],
        "css": """.hyper-text-font {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}""",
        "snippet": """// HyperText component (Luminous Light Theme)
import React, { useState, useEffect } from "react";

export function HyperText({ text = "SYSTEM_OPTIMAL" }) {
  const [current, setCurrent] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@!";

  const scramble = () => {
    let iterations = 0;
    const interval = setInterval(() => {
      setCurrent(
        text
          .split("")
          .map((letter, index) => {
            if (index < iterations) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      if (iterations >= text.length) clearInterval(interval);
      iterations += 1 / 3;
    }, 30);
  };

  return (
    <span onMouseEnter={scramble} className="hyper-text-font cursor-pointer text-xl font-bold text-slate-800">
      {current}
    </span>
  );
}"""
    },
    {
        "name": "Text Reveal by Scroll",
        "slug": "text-reveal",
        "category": "typography",
        "description": "Editorial word-by-word opacity and contrast reveal progressively synchronized to page scroll progress.",
        "tags": ["reveal", "scroll", "editorial", "opacity", "progress", "read"],
        "css": """.word-reveal-active {
  transition: opacity 0.3s ease, color 0.3s ease;
}""",
        "snippet": """// TextRevealByScroll component (Luminous Light Theme)
import React from "react";

export function TextReveal({ text = "Every interaction is calibrated with spring tension and optical margin alignment." }) {
  const words = text.split(" ");
  return (
    <div className="max-w-2xl py-20 text-3xl font-bold leading-relaxed">
      {words.map((w, idx) => (
        <span key={idx} className="mr-2 text-slate-900 transition-opacity duration-200">
          {w}
        </span>
      ))}
    </div>
  );
}"""
    },
    {
        "name": "Number Ticker",
        "slug": "number-ticker",
        "category": "typography",
        "description": "Precision numerical counter ticker with spring tension easing from 0 to target metrics.",
        "tags": ["number", "ticker", "counter", "metrics", "stats", "spring"],
        "css": """.ticker-value {
  font-variant-numeric: tabular-nums;
}""",
        "snippet": """// NumberTicker component (Luminous Light Theme)
import React, { useState, useEffect } from "react";

export function NumberTicker({ value = 99.9, decimals = 1, suffix = "%" }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    const update = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(ease * value);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }, [value]);

  return (
    <span className="ticker-value text-4xl font-black text-slate-900">
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}"""
    },
    {
        "name": "Morphing Text",
        "slug": "morphing-text",
        "category": "typography",
        "description": "Smooth SVG threshold filter text morphing between words with liquid optical blending.",
        "tags": ["morph", "liquid", "svg-filter", "text", "blend", "typography"],
        "css": """.morph-filter {
  filter: url(#threshold) blur(0.6px);
}""",
        "snippet": """// MorphingText component (Luminous Light Theme)
import React, { useState, useEffect } from "react";

export function MorphingText({ texts = ["Architecture", "Engineering", "Craftsmanship"] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % texts.length), 3000);
    return () => clearInterval(t);
  }, [texts]);

  return (
    <div className="relative h-16 w-full text-center">
      <span className="text-3xl font-extrabold text-slate-900 transition-opacity duration-700">
        {texts[idx]}
      </span>
    </div>
  );
}"""
    },
    {
        "name": "Word Fade In",
        "slug": "word-fade-in",
        "category": "typography",
        "description": "Sequential stagger fade in animating each word with clean upward slide on page load.",
        "tags": ["fade", "words", "stagger", "slide", "entrance", "typography"],
        "css": """@keyframes word-fade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-word-fade {
  animation: word-fade 0.5s ease forwards;
}""",
        "snippet": """// WordFadeIn component (Luminous Light Theme)
import React from "react";

export function WordFadeIn({ words = "Designed with obsessive attention to craft." }) {
  return (
    <div className="flex flex-wrap gap-2 text-2xl font-semibold text-slate-800">
      {words.split(" ").map((w, i) => (
        <span key={i} className="animate-word-fade opacity-0" style={{ animationDelay: `${i * 120}ms` }}>
          {w}
        </span>
      ))}
    </div>
  );
}"""
    },
    {
        "name": "Text Shimmer",
        "slug": "text-shimmer",
        "category": "typography",
        "description": "Light beam sliding continuously across subtle text gradient creating glossy reflections.",
        "tags": ["shimmer", "light-beam", "glossy", "reflection", "text", "shimmer-text"],
        "css": """@keyframes text-shimmer-sweep {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.animate-text-shimmer {
  background: linear-gradient(90deg, #64748B 0%, #0F172A 50%, #64748B 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: text-shimmer-sweep 3.5s infinite;
}""",
        "snippet": """// TextShimmer component (Luminous Light Theme)
import React from "react";

export function TextShimmer({ text = "Hyper-overclocked engineering" }) {
  return (
    <span className="animate-text-shimmer text-lg font-medium">
      {text}
    </span>
  );
}"""
    },

    # --------------------------------------------------------------------------
    # CATEGORY 5: DATA (14 COMPONENTS)
    # --------------------------------------------------------------------------
    {
        "name": "Marquee",
        "slug": "marquee",
        "category": "data",
        "description": "Smooth infinitely scrolling ticker track for client logos, reviews, or metrics (left, right, vertical).",
        "tags": ["marquee", "ticker", "logos", "infinite-scroll", "carousel", "data"],
        "css": """@keyframes marquee-slide {
  from { transform: translateX(0%); }
  to { transform: translateX(-50%); }
}
.animate-marquee-track {
  display: flex;
  width: max-content;
  animation: marquee-slide var(--duration, 25s) linear infinite;
}
.marquee-pause:hover .animate-marquee-track {
  animation-play-state: paused;
}""",
        "snippet": """// Marquee component (Luminous Light Theme)
import React from "react";

export function Marquee({ children, pauseOnHover = true, reverse = false, duration = "25s" }) {
  return (
    <div className={`marquee-pause relative flex w-full overflow-hidden border-y border-slate-200/80 bg-white py-4`}>
      <div
        className="animate-marquee-track flex gap-8"
        style={{
          "--duration": duration,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}"""
    },
    {
        "name": "3D Carousel",
        "slug": "3d-carousel",
        "category": "data",
        "description": "Cylindrical revolving 3D carousel showcasing cards or logos with depth perspective.",
        "tags": ["carousel", "3d", "cylinder", "revolving", "depth", "showcase"],
        "css": """.carousel-3d-stage {
  perspective: 1000px;
}
.carousel-3d-rotator {
  transform-style: preserve-3d;
  animation: rotate-3d-carousel 20s linear infinite;
}
@keyframes rotate-3d-carousel {
  from { transform: rotateY(0deg); }
  to { transform: rotateY(360deg); }
}""",
        "snippet": """// 3DCarousel component (Luminous Light Theme)
import React from "react";

export function ThreeDCarousel({ items = [] }) {
  const count = items.length;
  const radius = 240;
  return (
    <div className="carousel-3d-stage flex h-72 w-full items-center justify-center overflow-hidden">
      <div className="carousel-3d-rotator relative size-40">
        {items.map((item, idx) => {
          const angle = (idx / count) * 360;
          return (
            <div
              key={idx}
              className="absolute inset-0 flex items-center justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Interactive Globe",
        "slug": "globe",
        "category": "data",
        "description": "Lightweight 3D rotating globe canvas with animated latitude arcs and glowing city destination markers.",
        "tags": ["globe", "3d", "map", "earth", "world", "canvas", "arcs"],
        "css": """.globe-canvas-wrapper {
  mask-image: radial-gradient(circle at center, white 60%, transparent 100%);
}""",
        "snippet": """// InteractiveGlobe component (Luminous Light Theme)
import React, { useRef, useEffect } from "react";

export function Globe({ size = 320 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let angle = 0;
    let animId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      ctx.strokeStyle = "#CBD5E1";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, size / 2.5, 0, Math.PI * 2);
      ctx.stroke();
      // Orbiting meridian lines
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.abs(Math.sin(angle)) * (size / 2.5), size / 2.5, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "#94A3B8";
      ctx.stroke();
      angle += 0.02;
      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [size]);

  return (
    <div className="globe-canvas-wrapper flex items-center justify-center">
      <canvas ref={canvasRef} width={size} height={size} />
    </div>
  );
}"""
    },
    {
        "name": "Milestone Timeline",
        "slug": "timeline",
        "category": "data",
        "description": "Chronological vertical timeline with illuminated milestone nodes and connecting progress trail.",
        "tags": ["timeline", "chronology", "milestones", "history", "roadmap", "progress"],
        "css": """.timeline-trail-line {
  background: linear-gradient(to bottom, #3B82F6, #94A3B8);
}""",
        "snippet": """// MilestoneTimeline component (Luminous Light Theme)
import React from "react";

export function MilestoneTimeline({ events = [] }) {
  return (
    <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-8">
      {events.map((e, idx) => (
        <div key={idx} className="relative">
          <span className="absolute -left-[31px] top-1 flex size-4 items-center justify-center rounded-full border-2 border-white bg-blue-600 shadow-sm" />
          <span className="text-xs font-semibold text-blue-600 uppercase">{e.date}</span>
          <h4 className="text-sm font-bold text-slate-900">{e.title}</h4>
          <p className="text-xs text-slate-500 mt-1">{e.description}</p>
        </div>
      ))}
    </div>
  );
}"""
    },
    {
        "name": "Stats Counter Grid",
        "slug": "stats-counter",
        "category": "data",
        "description": "Key Performance Indicator (KPI) metric cards with dynamic animated values and growth delta badges.",
        "tags": ["stats", "kpi", "metrics", "counter", "delta", "growth", "dashboard"],
        "css": """.stat-card-border {
  border: 1px solid rgba(226, 232, 240, 0.8);
}""",
        "snippet": """// StatsCounterGrid component (Luminous Light Theme)
import React from "react";

export function StatsCounterGrid({ stats = [] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((s, idx) => (
        <div key={idx} className="stat-card-border rounded-2xl bg-white p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-500">{s.label}</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{s.value}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {s.growth}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}"""
    },
    {
        "name": "Interactive Tree View",
        "slug": "tree-view",
        "category": "data",
        "description": "Nested hierarchical folder and file tree view with smooth accordion node expansion.",
        "tags": ["tree", "hierarchy", "folders", "files", "navigation", "nested", "explorer"],
        "css": """.tree-item-hover:hover {
  background-color: #F8FAFC;
}""",
        "snippet": """// InteractiveTreeView component (Luminous Light Theme)
import React, { useState } from "react";

export function TreeView({ data }) {
  const [open, setOpen] = useState(true);
  const hasChildren = data.children && data.children.length > 0;

  return (
    <div className="text-xs font-medium text-slate-700">
      <div
        onClick={() => setOpen(!open)}
        className="tree-item-hover flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5"
      >
        <span>{hasChildren ? (open ? "📂" : "📁") : "📄"}</span>
        <span>{data.name}</span>
      </div>
      {hasChildren && open && (
        <div className="ml-4 border-l border-slate-200 pl-2">
          {data.children.map((child, idx) => (
            <TreeView key={idx} data={child} />
          ))}
        </div>
      )}
    </div>
  );
}"""
    },
    {
        "name": "Comparison Split Slider",
        "slug": "comparison-slider",
        "category": "data",
        "description": "Interactive before/after visual comparison slider with draggable split line handle.",
        "tags": ["comparison", "slider", "before-after", "split", "images", "handle"],
        "css": """.slider-handle-line {
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
}""",
        "snippet": """// ComparisonSplitSlider component (Luminous Light Theme)
import React, { useState } from "react";

export function ComparisonSlider({ beforeSrc, afterSrc }) {
  const [inset, setInset] = useState(50);

  return (
    <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-slate-200">
      <img src={afterSrc} alt="After" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${inset}%` }}>
        <img src={beforeSrc} alt="Before" className="size-full object-cover max-w-none" style={{ width: "100%" }} />
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={inset}
        onChange={(e) => setInset(Number(e.target.value))}
        className="absolute inset-0 z-20 size-full cursor-ew-resize opacity-0"
      />
      <div className="slider-handle-line pointer-events-none absolute top-0 bottom-0 w-0.5 bg-white" style={{ left: `${inset}%` }} />
    </div>
  );
}"""
    },
    {
        "name": "Data Table Grid",
        "slug": "data-table",
        "category": "data",
        "description": "High-density clean data table with sortable column headers, pagination controls, and zebra striping.",
        "tags": ["table", "grid", "data", "columns", "sorting", "records", "zebra"],
        "css": """.table-row-zebra:nth-child(even) {
  background-color: #FAFAFA;
}""",
        "snippet": """// DataTableGrid component (Luminous Light Theme)
import React from "react";

export function DataTable({ headers = ["ID", "Agent Name", "Status", "Latency"], rows = [] }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-600">
          {rows.map((row, i) => (
            <tr key={i} className="table-row-zebra hover:bg-blue-50/40">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}"""
    },
    {
        "name": "Radial Progress Ring",
        "slug": "radial-progress",
        "category": "data",
        "description": "Circular progress ring gauge with smooth stroke-dashoffset transition animation.",
        "tags": ["progress", "radial", "circle", "gauge", "percentage", "ring"],
        "css": """.progress-ring-circle {
  transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}""",
        "snippet": """// RadialProgressRing component (Luminous Light Theme)
import React from "react";

export function RadialProgressRing({ progress = 75, size = 100, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E2E8F0" strokeWidth={strokeWidth} fill="transparent" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3B82F6"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="progress-ring-circle"
        />
      </svg>
      <span className="absolute text-sm font-bold text-slate-900">{progress}%</span>
    </div>
  );
}"""
    },
    {
        "name": "Matrix Rain Stream",
        "slug": "matrix-rain",
        "category": "data",
        "description": "Matrix binary falling rain digital code stream canvas visualization with glowing head glyphs.",
        "tags": ["matrix", "rain", "stream", "code", "binary", "canvas", "data"],
        "css": """.matrix-canvas-container {
  mask-image: linear-gradient(to bottom, white 70%, transparent 100%);
}""",
        "snippet": """// MatrixRainStream component (Luminous Light Theme)
import React, { useRef, useEffect } from "react";

export function MatrixRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const chars = "0101ANTIGRAVITY987654";
    const cols = Math.floor(canvas.width / 16);
    const drops = Array(cols).fill(1);
    let animId;
    const render = () => {
      ctx.fillStyle = "rgba(250, 249, 246, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#2563EB";
      ctx.font = "12px monospace";
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 16, drops[i] * 16);
        if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} width={600} height={300} className="matrix-canvas-container size-full" />;
}"""
    },
    {
        "name": "Speedometer Gauge Chart",
        "slug": "gauge-chart",
        "category": "data",
        "description": "Semi-circular dial speedometer gauge with rotated needle pointer representing throughput.",
        "tags": ["gauge", "speedometer", "needle", "dial", "chart", "metrics", "throughput"],
        "css": """.needle-transition {
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: 50% 100%;
}""",
        "snippet": """// SpeedometerGaugeChart component (Luminous Light Theme)
import React from "react";

export function GaugeChart({ value = 82, max = 100 }) {
  const angle = (value / max) * 180 - 90;
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative h-28 w-56 overflow-hidden">
        <div className="size-56 rounded-full border-[14px] border-slate-200 border-b-transparent border-l-transparent -rotate-45" />
        <div
          className="needle-transition absolute bottom-0 left-1/2 h-20 w-1 -translate-x-1/2 rounded-full bg-blue-600"
          style={{ transform: `rotate(${angle}deg)` }}
        />
      </div>
      <span className="mt-2 text-2xl font-black text-slate-900">{value} <span className="text-xs text-slate-400">FPS</span></span>
    </div>
  );
}"""
    },
    {
        "name": "Kanban Column Board",
        "slug": "kanban-board",
        "category": "data",
        "description": "Agile Kanban column board with draggable task item cards and column state counters.",
        "tags": ["kanban", "board", "tasks", "agile", "columns", "cards", "workflow"],
        "css": """.kanban-column-drop {
  min-height: 380px;
}""",
        "snippet": """// KanbanColumnBoard component (Luminous Light Theme)
import React from "react";

export function KanbanColumn({ title = "In Progress", count = 3, tasks = [] }) {
  return (
    <div className="kanban-column-drop w-72 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
      <div className="flex items-center justify-between pb-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{title}</h4>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200">
          {count}
        </span>
      </div>
      <div className="space-y-3">
        {tasks.map((task, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <h5 className="text-xs font-semibold text-slate-900">{task.title}</h5>
            <span className="mt-2 inline-block rounded bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
              {task.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Interactive Scatter Plot",
        "slug": "interactive-scatter",
        "category": "data",
        "description": "Interactive HTML5 canvas 2D scatter plot with hover tooltip coordinate markers.",
        "tags": ["scatter", "plot", "chart", "coordinates", "canvas", "interactive"],
        "css": """.scatter-tooltip {
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}""",
        "snippet": """// InteractiveScatterPlot component (Luminous Light Theme)
import React from "react";

export function ScatterPlotDemo({ points = [{x: 20, y: 30}, {x: 50, y: 70}, {x: 80, y: 40}] }) {
  return (
    <div className="relative h-60 w-80 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="relative size-full border-l border-b border-slate-300">
        {points.map((p, i) => (
          <div
            key={i}
            className="group absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-blue-600 shadow cursor-pointer transition hover:scale-125"
            style={{ left: `${p.x}%`, top: `${100 - p.y}%` }}
          >
            <div className="scatter-tooltip absolute bottom-full mb-1 hidden rounded bg-slate-900 px-2 py-1 text-[10px] text-white group-hover:block whitespace-nowrap">
              ({p.x}, {p.y})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}"""
    },
    {
        "name": "Activity Heatmap Grid",
        "slug": "activity-calendar",
        "category": "data",
        "description": "GitHub-style 52-week activity contribution heatmap grid with color-intensity scaling.",
        "tags": ["heatmap", "activity", "calendar", "contributions", "github", "squares"],
        "css": """.heat-0 { background-color: #F1F5F9; }
.heat-1 { background-color: #BFDBFE; }
.heat-2 { background-color: #60A5FA; }
.heat-3 { background-color: #2563EB; }
.heat-4 { background-color: #1D4ED8; }""",
        "snippet": """// ActivityHeatmapGrid component (Luminous Light Theme)
import React from "react";

export function ActivityCalendar({ weeks = 24 }) {
  return (
    <div className="flex gap-1 overflow-x-auto p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
      {Array.from({ length: weeks }).map((_, w) => (
        <div key={w} className="flex flex-col gap-1">
          {Array.from({ length: 7 }).map((_, d) => {
            const level = Math.floor(Math.random() * 5);
            return <div key={d} className={`size-3 rounded-sm heat-${level}`} />;
          })}
        </div>
      ))}
    </div>
  );
}"""
    },

    # --------------------------------------------------------------------------
    # CATEGORY 6: NAVIGATION (12 COMPONENTS)
    # --------------------------------------------------------------------------
    {
        "name": "Dock",
        "slug": "dock",
        "category": "navigation",
        "description": "macOS-inspired magnifying dynamic dock navigation bar with continuous spring magnification.",
        "tags": ["dock", "macos", "magnification", "navigation", "icons", "spring", "bar"],
        "css": """.dock-container {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
}""",
        "snippet": """// Dock component (Luminous Light Theme)
import React from "react";

export function Dock({ children, className = "" }) {
  return (
    <div className={`dock-container flex h-16 items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/80 px-4 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}"""
    },
    {
        "name": "Dock Icon",
        "slug": "dock-icon",
        "category": "navigation",
        "description": "Scalable individual dock icon item with cursor-proximity scaling and active state dot.",
        "tags": ["dock-icon", "dock", "magnify", "icon", "navigation", "button"],
        "css": """.dock-icon-spring {
  transition: transform 0.2s cubic-bezier(0.22, 1.61, 0.36, 1);
}
.dock-icon-spring:hover {
  transform: translateY(-8px) scale(1.25);
}""",
        "snippet": """// DockIcon component (Luminous Light Theme)
import React from "react";

export function DockIcon({ children, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className="dock-icon-spring relative flex size-10 items-center justify-center rounded-xl border border-slate-200/70 bg-white shadow-sm active:scale-95"
    >
      {children}
      {active && <span className="absolute -bottom-1 size-1 rounded-full bg-blue-600" />}
    </button>
  );
}"""
    },
    {
        "name": "Floating Dock",
        "slug": "floating-dock",
        "category": "navigation",
        "description": "Floating responsive bottom-centered dock navigation pinned smoothly over page contents.",
        "tags": ["floating", "dock", "bottom", "navigation", "pill", "menu"],
        "css": """.floating-dock-pinned {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
}""",
        "snippet": """// FloatingDock component (Luminous Light Theme)
import React from "react";

export function FloatingDock({ items = [] }) {
  return (
    <div className="floating-dock-pinned flex h-14 items-center gap-2 rounded-full border border-slate-200/90 bg-white/90 px-3 shadow-lg backdrop-blur-md">
      {items.map((item, idx) => (
        <a
          key={idx}
          href={item.href}
          className="flex size-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95"
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}"""
    },
    {
        "name": "Animated Sliding Tabs",
        "slug": "animated-tabs",
        "category": "navigation",
        "description": "Tab list featuring an animated sliding background indicator pill matching active tab dimensions.",
        "tags": ["tabs", "sliding", "pill", "indicator", "navigation", "switch", "spring"],
        "css": """.tab-pill-slide {
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}""",
        "snippet": """// AnimatedSlidingTabs component (Luminous Light Theme)
import React, { useState } from "react";

export function AnimatedTabs({ tabs = ["Overview", "Integrations", "Settings"] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="relative inline-flex rounded-xl border border-slate-200 bg-slate-100/80 p-1">
      {tabs.map((tab, idx) => (
        <button
          key={idx}
          onClick={() => setActive(idx)}
          className={`relative z-10 rounded-lg px-4 py-1.5 text-xs font-semibold transition ${active === idx ? "text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
        >
          {tab}
        </button>
      ))}
      <div
        className="tab-pill-slide absolute top-1 bottom-1 rounded-lg bg-white shadow-sm"
        style={{
          width: `calc(${100 / tabs.length}% - 4px)`,
          left: `calc(${(active * 100) / tabs.length}% + 2px)`,
        }}
      />
    </div>
  );
}"""
    },
    {
        "name": "Circular Speed Dial Menu",
        "slug": "circular-navigation",
        "category": "navigation",
        "description": "Floating action speed-dial radial menu blossoming outward into satellite navigation nodes.",
        "tags": ["circular", "speed-dial", "radial", "menu", "fab", "satellite"],
        "css": """.dial-satellite {
  transition: transform 0.3s cubic-bezier(0.22, 1.61, 0.36, 1), opacity 0.2s ease;
}""",
        "snippet": """// CircularSpeedDialMenu component (Luminous Light Theme)
import React, { useState } from "react";

export function CircularMenu({ actions = [] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex size-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-md active:scale-95 transition"
      >
        {open ? "✕" : "＋"}
      </button>
      {actions.map((act, i) => {
        const angle = (i / actions.length) * Math.PI;
        const x = open ? Math.cos(angle) * 60 : 0;
        const y = open ? -Math.sin(angle) * 60 : 0;
        return (
          <button
            key={i}
            style={{ transform: `translate(${x}px, ${y}px)` }}
            className={`dial-satellite absolute top-1 left-1 flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            {act.icon}
          </button>
        );
      })}
    </div>
  );
}"""
    },
    {
        "name": "Breadcrumb Trail",
        "slug": "breadcrumb-trail",
        "category": "navigation",
        "description": "Hierarchy breadcrumb trail with smart path ellipsis truncation and chevron separators.",
        "tags": ["breadcrumb", "trail", "path", "hierarchy", "navigation", "chevron"],
        "css": """.breadcrumb-item:hover {
  color: #0F172A;
}""",
        "snippet": """// BreadcrumbTrail component (Luminous Light Theme)
import React from "react";

export function BreadcrumbTrail({ items = ["Dashboard", "Pods", "Visual UI"] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
      {items.map((it, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="text-slate-300">/</span>}
          <span className={`breadcrumb-item cursor-pointer transition ${idx === items.length - 1 ? "font-semibold text-slate-900" : ""}`}>
            {it}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
}"""
    },
    {
        "name": "Process Stepper",
        "slug": "stepper",
        "category": "navigation",
        "description": "Sequential multi-step workflow progress indicator with validated step checkmarks and active pulse.",
        "tags": ["stepper", "steps", "workflow", "progress", "wizard", "navigation"],
        "css": """.stepper-line-active {
  background-color: #3B82F6;
}""",
        "snippet": """// ProcessStepper component (Luminous Light Theme)
import React from "react";

export function Stepper({ steps = ["Plan", "Dev", "Test", "Deploy"], current = 1 }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((st, i) => (
        <React.Fragment key={i}>
          {i > 0 && <div className={`h-0.5 w-8 ${i <= current ? "bg-blue-600" : "bg-slate-200"}`} />}
          <div className="flex items-center gap-1.5">
            <span className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${i < current ? "bg-emerald-600 text-white" : i === current ? "bg-blue-600 text-white ring-4 ring-blue-100" : "bg-slate-200 text-slate-600"}`}>
              {i < current ? "✓" : i + 1}
            </span>
            <span className="text-xs font-semibold text-slate-800">{st}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}"""
    },
    {
        "name": "Scroll-Spy Table of Contents",
        "slug": "scroll-spy-toc",
        "category": "navigation",
        "description": "Sticky table of contents highlighting currently active document section automatically via scroll position.",
        "tags": ["scroll-spy", "toc", "table-of-contents", "active", "reading", "navigation"],
        "css": """.toc-active-bar {
  border-left: 2px solid #3B82F6;
  color: #1E40AF;
  font-weight: 600;
}""",
        "snippet": """// ScrollSpyTOC component (Luminous Light Theme)
import React from "react";

export function ScrollSpyTOC({ headings = [{ id: "intro", text: "Introduction" }, { id: "arch", text: "Architecture" }], activeId = "arch" }) {
  return (
    <div className="w-56 space-y-2 border-l border-slate-200 pl-3 text-xs">
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={`block py-1 transition ${activeId === h.id ? "toc-active-bar -ml-[13px] pl-3" : "text-slate-500 hover:text-slate-800"}`}
        >
          {h.text}
        </a>
      ))}
    </div>
  );
}"""
    },
    {
        "name": "Navbar Mega Menu",
        "slug": "navbar-menu",
        "category": "navigation",
        "description": "Modern floating header navbar with responsive smooth animated dropdown card flyouts.",
        "tags": ["navbar", "menu", "dropdown", "flyout", "mega-menu", "header"],
        "css": """.navbar-blur-plate {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}""",
        "snippet": """// NavbarMegaMenu component (Luminous Light Theme)
import React from "react";

export function NavbarMegaMenu() {
  return (
    <header className="navbar-blur-plate fixed top-4 inset-x-4 mx-auto max-w-5xl rounded-full border border-slate-200/80 bg-white/80 px-6 py-3 shadow-sm z-50 flex items-center justify-between">
      <div className="font-bold text-slate-900 tracking-tight text-sm">✦ Antigravity</div>
      <nav className="flex items-center gap-6 text-xs font-medium text-slate-600">
        <a href="#features" className="hover:text-slate-900">Features</a>
        <a href="#solutions" className="hover:text-slate-900">Solutions</a>
        <a href="#pricing" className="hover:text-slate-900">Pricing</a>
      </nav>
      <button className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800">
        Launch App
      </button>
    </header>
  );
}"""
    },
    {
        "name": "Segmented Control Switcher",
        "slug": "segmented-control",
        "category": "navigation",
        "description": "Tactile iOS-style segmented controller with spring sliding indicator pill.",
        "tags": ["segmented", "switcher", "toggle", "ios", "pill", "tactile"],
        "css": """.segmented-thumb {
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}""",
        "snippet": """// SegmentedControlSwitcher component (Luminous Light Theme)
import React, { useState } from "react";

export function SegmentedControl({ options = ["Monthly", "Annual"] }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="relative inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => setSelected(i)}
          className={`relative z-10 px-4 py-1 text-xs font-semibold transition ${selected === i ? "text-slate-900" : "text-slate-500"}`}
        >
          {opt}
        </button>
      ))}
      <div
        className="segmented-thumb absolute top-1 bottom-1 rounded-lg bg-white shadow-sm"
        style={{
          width: `calc(${100 / options.length}% - 4px)`,
          transform: `translateX(${selected * 100}%)`,
        }}
      />
    </div>
  );
}"""
    },
    {
        "name": "Sidebar Rail Collapsible",
        "slug": "sidebar-collapsible",
        "category": "navigation",
        "description": "Compact icon rail expanding into full contextual navigation drawer with keyboard shortcut hints.",
        "tags": ["sidebar", "rail", "collapsible", "drawer", "navigation", "dashboard"],
        "css": """.sidebar-rail-transition {
  transition: width 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}""",
        "snippet": """// SidebarRailCollapsible component (Luminous Light Theme)
import React, { useState } from "react";

export function SidebarRail({ items = [] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`sidebar-rail-transition fixed left-0 top-0 bottom-0 z-40 border-r border-slate-200 bg-white p-3 ${expanded ? "w-52" : "w-16"}`}
    >
      <div className="flex flex-col gap-3">
        {items.map((it, idx) => (
          <div key={idx} className="flex items-center gap-3 rounded-xl p-2 text-slate-700 hover:bg-slate-50 cursor-pointer">
            <span className="text-lg">{it.icon}</span>
            {expanded && <span className="text-xs font-medium text-slate-900 whitespace-nowrap">{it.label}</span>}
          </div>
        ))}
      </div>
    </aside>
  );
}"""
    },
    {
        "name": "Floating Action Bar",
        "slug": "action-bar",
        "category": "navigation",
        "description": "Compact floating contextual bar containing immediate action triggers and shortcuts.",
        "tags": ["action-bar", "floating", "shortcuts", "toolbar", "bottom", "actions"],
        "css": """.action-bar-shadow {
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}""",
        "snippet": """// FloatingActionBar component (Luminous Light Theme)
import React from "react";

export function FloatingActionBar({ onFormat, onExport, onDelete }) {
  return (
    <div className="action-bar-shadow fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 z-50">
      <button onClick={onFormat} className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100">Format</button>
      <div className="h-4 w-px bg-slate-200" />
      <button onClick={onExport} className="rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50">Export</button>
      <div className="h-4 w-px bg-slate-200" />
      <button onClick={onDelete} className="rounded-lg px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50">Delete</button>
    </div>
  );
}"""
    }
]

# Total categories verification
CATEGORIES = ["ai", "cards", "backgrounds", "typography", "data", "navigation"]


# ==============================================================================
# SEARCH ALGORITHM & SCORING
# ==============================================================================
def score_component(comp, query):
    """
    Compute relevance score for a component against a search query.
    Higher score means more relevant.
    """
    q = query.lower().strip()
    if not q:
        return 0

    score = 0
    slug = comp["slug"].lower()
    name = comp["name"].lower()
    category = comp["category"].lower()
    desc = comp["description"].lower()
    tags = [t.lower() for t in comp.get("tags", [])]

    # Exact matches
    if q == slug:
        score += 150
    elif q == name:
        score += 140
    elif q == category:
        score += 80

    # Prefix / Substring matches in slug and name
    if slug.startswith(q):
        score += 70
    elif q in slug:
        score += 50

    if name.startswith(q):
        score += 60
    elif q in name:
        score += 40

    # Tag matches
    for tag in tags:
        if q == tag:
            score += 45
        elif q in tag:
            score += 20

    # Description match
    if q in desc:
        score += 15

    return score


def search_components(query=None, category=None):
    """Filter and rank components based on query and/or category."""
    results = COMPONENTS

    if category:
        cat_lower = category.lower().strip()
        results = [c for c in results if c["category"].lower() == cat_lower]

    if query:
        scored = []
        for c in results:
            s = score_component(c, query)
            if s > 0:
                scored.append((s, c))
        scored.sort(key=lambda x: x[0], reverse=True)
        results = [item[1] for item in scored]

    return results


# ==============================================================================
# CLI PRESENTATION & FORMATTING
# ==============================================================================
CATEGORY_EMOJIS = {
    "ai": "🤖",
    "cards": "🃏",
    "backgrounds": "🎨",
    "typography": "✍️",
    "data": "📊",
    "navigation": "🧭"
}

def print_banner():
    banner = """
╔══════════════════════════════════════════════════════════════════════════╗
║              ✦ MAGIC UI COMPONENT VAULT SEARCH ENGINE ✦                  ║
║            84+ Precision Components • Luminous Light Theme Ready         ║
╚══════════════════════════════════════════════════════════════════════════╝"""
    print(banner)

def print_list_all():
    print_banner()
    print(f"\n📦 TOTAL COMPONENTS: {len(COMPONENTS)} across {len(CATEGORIES)} categories.\n")
    for cat in CATEGORIES:
        cat_comps = [c for c in COMPONENTS if c["category"] == cat]
        emoji = CATEGORY_EMOJIS.get(cat, "📁")
        print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print(f"{emoji}  CATEGORY: {cat.upper()} ({len(cat_comps)} components)")
        print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        for c in cat_comps:
            tags_str = ", ".join(c["tags"][:4])
            print(f"  • {c['name']:<24} [{c['slug']:<24}]  tags: {tags_str}")
        print()

def print_search_results(results, query=None, category=None):
    print_banner()
    criteria = []
    if query:
        criteria.append(f"keyword='{query}'")
    if category:
        criteria.append(f"category='{category}'")
    criteria_str = " & ".join(criteria) if criteria else "ALL"

    print(f"\n🔍 Search Query: [{criteria_str}] — Found {len(results)} match(es):\n")
    if not results:
        print("  ❌ No components matched your criteria.")
        print("  💡 Tip: Try searching general terms like 'beam', 'card', 'grid', 'text', 'button', 'dock'")
        return

    for idx, c in enumerate(results, 1):
        emoji = CATEGORY_EMOJIS.get(c["category"], "🔹")
        print(f"[{idx}] {emoji} {c['name']} (slug: {c['slug']}) | Category: {c['category']}")
        print(f"    Description: {c['description']}")
        print(f"    Tags: {', '.join(c['tags'])}")
        print()

def print_code_snippet(comp):
    print("\n" + "=" * 76)
    print(f"  COMPONENT: {comp['name']} ({comp['slug']}) — {comp['category'].upper()}")
    print("=" * 76)
    print("\n[CSS KEYFRAMES & STYLES]")
    print(comp["css"])
    print("\n[REACT / JSX CODE SNIPPET (Luminous Light Theme)]")
    print(comp["snippet"])
    print("\n" + "=" * 76 + "\n")


# ==============================================================================
# MAIN ENTRYPOINT
# ==============================================================================
def main():
    parser = argparse.ArgumentParser(
        description="Magic UI Component Vault - Ultra-Fast Search Engine & Catalog CLI"
    )
    parser.add_argument(
        "query",
        nargs="?",
        default=None,
        help="Keyword to search across component name, slug, tags, or description"
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="List all components grouped by category with summary stats"
    )
    parser.add_argument(
        "--category",
        "-c",
        type=str,
        default=None,
        help=f"Filter components by category ({', '.join(CATEGORIES)})"
    )
    parser.add_argument(
        "--code",
        action="store_true",
        help="Display full JSX code snippet and CSS keyframes for matched component"
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output raw JSON format for automated agent ingestion and parsing"
    )

    args = parser.parse_args()

    # Case 1: --list flag
    if args.list:
        if args.json:
            print(json.dumps(COMPONENTS, indent=2, ensure_ascii=False))
        else:
            print_list_all()
        return

    # Case 2: No query and no category provided
    if not args.query and not args.category:
        print_banner()
        print("\n💡 USAGE GUIDE:")
        print("  python search_magic.py --list                    # List all 84+ components")
        print("  python search_magic.py --category ai             # Filter by category (ai, cards, backgrounds, ...)")
        print("  python search_magic.py beam                      # Search components by keyword")
        print("  python search_magic.py beam --code               # Output full JSX snippet & CSS")
        print("  python search_magic.py beam --json               # Output results as JSON for agents\n")
        print(f"📊 VAULT STATUS: 84 components indexed in 6 categories: {', '.join(CATEGORIES)}")
        return

    # Case 3: Search execution
    results = search_components(query=args.query, category=args.category)

    # Output JSON format
    if args.json:
        print(json.dumps(results, indent=2, ensure_ascii=False))
        return

    # Output Code format
    if args.code:
        if not results:
            print(f"❌ No component found matching query: '{args.query}'")
            sys.exit(1)
        # Output code for the top match
        top_match = results[0]
        print_code_snippet(top_match)
        if len(results) > 1:
            print(f"💡 Note: Found {len(results)} matches. Showing code for top match '{top_match['slug']}'.")
            print(f"   Other matches: {', '.join(r['slug'] for r in results[1:6])}")
        return

    # Standard human-readable terminal output
    print_search_results(results, query=args.query, category=args.category)


if __name__ == "__main__":
    main()
