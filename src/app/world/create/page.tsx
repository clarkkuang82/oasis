'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';
import { saveWorld } from '@/lib/db/worlds';
import type { World, WorldBible, HiddenSettings } from '@/lib/types/world-bible';

type Phase = 'input' | 'generating' | 'reveal' | 'customize';

export default function WorldCreatePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('input');
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [narrative, setNarrative] = useState('');
  const [displayedNarrative, setDisplayedNarrative] = useState('');
  const [worldData, setWorldData] = useState<{
    worldBible: WorldBible;
    hiddenSettings: HiddenSettings;
    openingNarrative: string;
    worldSummary: string;
  } | null>(null);
  const [worldId, setWorldId] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);

  // Auto-focus input
  useEffect(() => {
    if (phase === 'input') inputRef.current?.focus();
  }, [phase]);

  // Typewriter effect for narrative
  useEffect(() => {
    if (!narrative || phase !== 'reveal') return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < narrative.length) {
        setDisplayedNarrative(narrative.slice(0, i + 1));
        i++;
        // Auto-scroll
        if (narrativeRef.current) {
          narrativeRef.current.scrollTop = narrativeRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [narrative, phase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setPhase('generating');
    setError('');

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate-world', prompt: prompt.trim() }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || '生成失败');
      }

      setWorldData(json.data);
      setNarrative(json.data.openingNarrative);

      // Save to IndexedDB
      const id = uuid();
      setWorldId(id);
      const world: World = {
        id,
        name: json.data.worldBible.meta.name,
        tagline: json.data.worldBible.meta.tagline,
        worldBible: json.data.worldBible,
        hiddenSettings: json.data.hiddenSettings,
        openingNarrative: json.data.openingNarrative,
        worldSummary: json.data.worldSummary,
        createdBy: 'local',
        isPublic: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await saveWorld(world);

      setPhase('reveal');
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
      setPhase('input');
    }
  }

  // Phase: Input
  if (phase === 'input') {
    return (
      <div className="crt-scanlines crt-flicker min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold crt-glow">世界锻造台</h1>
            <p className="text-green-600 text-sm">
              用一句话描述你想要的世界。AI 会填补所有细节。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center border border-green-500 p-4">
              <span className="text-green-500 mr-2 crt-glow">{'>'}</span>
              <input
                ref={inputRef}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="赛博朋克东京，武士与黑客并存"
                className="bg-transparent flex-1 outline-none text-green-400 placeholder-green-800"
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              className="w-full border border-green-700 py-2 text-green-500 hover:bg-green-500/10 transition-colors"
            >
              锻造世界
            </button>
          </form>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <div className="text-center">
            <button
              onClick={() => router.push('/')}
              className="text-green-800 text-sm hover:text-green-600"
            >
              返回
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Phase: Generating
  if (phase === 'generating') {
    return (
      <div className="crt-scanlines crt-flicker min-h-screen flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="text-2xl crt-glow">锻造中...</div>
          <p className="text-green-700 text-sm">
            AI 正在基于「{prompt}」构建世界
          </p>
          <div className="text-green-500 cursor-blink text-2xl">_</div>
        </div>
      </div>
    );
  }

  // Phase: Reveal
  if (phase === 'reveal' && worldData) {
    const wb = worldData.worldBible;
    const isTyping = displayedNarrative.length < narrative.length;

    return (
      <div className="crt-scanlines crt-flicker min-h-screen flex flex-col p-8">
        <div className="max-w-3xl w-full mx-auto space-y-8">
          {/* World name */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold crt-glow">{wb.meta.name}</h1>
            <p className="text-green-600 text-sm">{wb.meta.tagline}</p>
          </div>

          {/* Opening narrative with typewriter */}
          <div
            ref={narrativeRef}
            className="border border-green-900 p-6 max-h-[40vh] overflow-y-auto leading-relaxed"
          >
            <p className="whitespace-pre-wrap">{displayedNarrative}</p>
            {isTyping && <span className="cursor-blink">_</span>}
          </div>

          {/* World summary card */}
          {!isTyping && (
            <div className="space-y-6 animate-in fade-in duration-700">
              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="border border-green-900 p-3">
                  <span className="text-green-700">基调:</span>{' '}
                  <span className="crt-glow">{wb.meta.tone}</span>
                </div>
                <div className="border border-green-900 p-3">
                  <span className="text-green-700">死亡规则:</span>{' '}
                  <span className="crt-glow">{wb.physics.death_rule}</span>
                </div>
                <div className="border border-green-900 p-3">
                  <span className="text-green-700">科技水平:</span>{' '}
                  <span className="crt-glow">{wb.physics.tech_level}</span>
                </div>
                <div className="border border-green-900 p-3">
                  <span className="text-green-700">权力货币:</span>{' '}
                  <span className="crt-glow">{wb.society.power_currency}</span>
                </div>
              </div>

              {/* Factions */}
              <div className="border border-green-900 p-4 space-y-2">
                <h3 className="text-green-600 font-bold">势力</h3>
                {wb.society.factions.map((f, i) => (
                  <div key={i} className="text-sm">
                    <span className="crt-glow">{f.name}</span>
                    <span className="text-green-800"> — {f.motivation}</span>
                    <span className={`ml-2 text-xs ${
                      f.attitude_to_player === '友好' ? 'text-green-400' :
                      f.attitude_to_player === '敌对' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      [{f.attitude_to_player}]
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setPhase('customize')}
                  className="border border-green-500 py-3 text-green-400 hover:bg-green-500/10 transition-colors crt-glow"
                >
                  {'>'} 想深入定制吗？
                </button>
                <button
                  onClick={() => router.push(`/world/${worldId}`)}
                  className="border border-green-700 py-3 text-green-600 hover:bg-green-500/10 transition-colors"
                >
                  {'>'} 直接进入世界
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Phase: Customize (Layer 1 placeholder)
  if (phase === 'customize') {
    return (
      <div className="crt-scanlines crt-flicker min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full space-y-6">
          <h1 className="text-3xl font-bold crt-glow">深度定制</h1>
          <p className="text-green-600 text-sm">Phase 3 即将实现 Layer 1 对话流定制...</p>
          <button
            onClick={() => router.push(`/world/${worldId}`)}
            className="border border-green-700 py-3 px-8 text-green-600 hover:bg-green-500/10 transition-colors"
          >
            先进入世界
          </button>
        </div>
      </div>
    );
  }

  return null;
}
