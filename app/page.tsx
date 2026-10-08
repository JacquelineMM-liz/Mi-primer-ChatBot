// app/page.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Message, ModelConfig } from '@/types/chat';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { ConfigPanel } from '@/components/ConfigPanel';
import { Bot, Trash2 } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: '¡Hola! Soy tu asistente basado en Gemini. Puedes ajustar mi contexto, longitud de respuesta y temperatura en el panel lateral.',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<ModelConfig>({
    modelName: 'gemini-3.8-flash',
    systemInstruction: 'Eres un tutor amigable y experto en ingeniería de software y programación.',
    temperature: 0.7,
    maxOutputTokens: 1024,
    topP: 0.95,
    topK: 40,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Filtrar sólo turnos de usuario y modelo para el backend
      const payloadMessages = newMessages
        .filter((m) => m.role === 'user' || m.role === 'model')
        .map((m) => ({
          role: m.role as 'user' | 'model',
          content: m.content,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          config: config,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al comunicarse con el servidor');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: `⚠️ Error: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-slate-950 overflow-hidden font-sans">
      {/* Área Principal de Chat */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 px-6 flex items-center justify-between backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-base">Gemini Software Dev Bot</h1>
              <p className="text-xs text-slate-400">Next.js 15+ Google GenAI SDK</p>
            </div>
          </div>
          <button
            onClick={handleClearHistory}
            title="Limpiar Conversación"
            className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </header>

        {/* Lista de Mensajes */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-12 py-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isLoading && (
            <div className="flex gap-3 my-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Barra de Entrada */}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* Panel Lateral de Parámetros */}
      <ConfigPanel config={config} onChange={setConfig} />
    </div>
  );
}
