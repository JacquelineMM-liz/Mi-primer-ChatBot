// components/ConfigPanel.tsx
'use client';

import React from 'react';
import { ModelConfig } from '@/types/chat';
import { Settings, Sliders, Sparkles, BookOpen } from 'lucide-react';

interface ConfigPanelProps {
  config: ModelConfig;
  onChange: (newConfig: ModelConfig) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange }) => {
  const handleChange = (key: keyof ModelConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <aside className="w-full lg:w-80 bg-slate-900 border-l border-slate-800 p-5 flex flex-col gap-6 text-slate-200 overflow-y-auto h-full">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <Settings className="w-5 h-5 text-indigo-400" />
        <h2 className="font-semibold text-lg text-white">Parámetros del Modelo</h2>
      </div>

      {/* Selector de Modelo */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium flex items-center gap-1.5 text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-400" /> Modelo
        </label>
        <select
          value={config.modelName}
          onChange={(e) => handleChange('modelName', e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="gemini-3.8-flash">Gemini 3.8 Flash (Rápido & Equilibrado)</option>
          <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash-Lite</option>
          <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Mayor Razonamiento)</option>
        </select>
      </div>

      {/* Contexto / System Instruction */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-400" /> System Prompt (Contexto)
          </span>
        </label>
        <p className="text-xs text-slate-400">
          Define el rol, tono y restricciones del asistente.
        </p>
        <textarea
          rows={4}
          value={config.systemInstruction}
          onChange={(e) => handleChange('systemInstruction', e.target.value)}
          placeholder="Ej: Eres un tutor universitario de desarrollo de software especializado en TypeScript..."
          className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {/* Temperatura */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm">
          <label className="font-medium text-slate-300">Temperatura (Creatividad)</label>
          <span className="font-mono text-xs bg-slate-800 px-2 py-0.5 rounded text-indigo-300">
            {config.temperature}
          </span>
        </div>
        <input
          type="range"
          min="0.0"
          max="2.0"
          step="0.1"
          value={config.temperature}
          onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
          className="accent-indigo-500 w-full cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>0.0 (Preciso/Lógico)</span>
          <span>1.0 (Balanceado)</span>
          <span>2.0 (Creativo)</span>
        </div>
      </div>

      {/* Max Tokens de Salida */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm">
          <label className="font-medium text-slate-300">Límite de Tokens (Salida)</label>
          <span className="font-mono text-xs bg-slate-800 px-2 py-0.5 rounded text-indigo-300">
            {config.maxOutputTokens}
          </span>
        </div>
        <input
          type="range"
          min="64"
          max="4096"
          step="64"
          value={config.maxOutputTokens}
          onChange={(e) => handleChange('maxOutputTokens', parseInt(e.target.value, 10))}
          className="accent-indigo-500 w-full cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>64 (Corto)</span>
          <span>2048 (Medio)</span>
          <span>4096 (Extenso)</span>
        </div>
      </div>

      {/* Top-P */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm">
          <label className="font-medium text-slate-300">Top-P (Nucleus Sampling)</label>
          <span className="font-mono text-xs bg-slate-800 px-2 py-0.5 rounded text-indigo-300">
            {config.topP}
          </span>
        </div>
        <input
          type="range"
          min="0.0"
          max="1.0"
          step="0.05"
          value={config.topP}
          onChange={(e) => handleChange('topP', parseFloat(e.target.value))}
          className="accent-indigo-500 w-full cursor-pointer"
        />
      </div>
    </aside>
  );
};
