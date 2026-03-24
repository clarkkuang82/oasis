'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getWorld } from '@/lib/db/worlds';
import type { World } from '@/lib/types/world-bible';

export default function WorldDetailPage() {
  const params = useParams();
  const router = useRouter();
  const worldId = params.worldId as string;
  const [world, setWorld] = useState<World | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorld(worldId).then((w) => {
      setWorld(w ?? null);
      setLoading(false);
    });
  }, [worldId]);

  if (loading) {
    return (
      <div className="crt-scanlines crt-flicker min-h-screen flex items-center justify-center">
        <div className="text-green-500 cursor-blink text-2xl">_</div>
      </div>
    );
  }

  if (!world) {
    return (
      <div className="crt-scanlines crt-flicker min-h-screen flex flex-col items-center justify-center p-8 space-y-4">
        <p className="text-red-500">世界不存在</p>
        <Link href="/" className="text-green-600 hover:text-green-400">返回首页</Link>
      </div>
    );
  }

  const wb = world.worldBible;

  return (
    <div className="crt-scanlines crt-flicker min-h-screen flex flex-col p-8">
      <div className="max-w-3xl w-full mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <Link href="/" className="text-green-800 text-sm hover:text-green-600">
            {'<'} 返回
          </Link>
          <h1 className="text-4xl font-bold crt-glow">{wb.meta.name}</h1>
          <p className="text-green-600">{wb.meta.tagline}</p>
        </div>

        {/* World info grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="border border-green-900 p-3">
            <span className="text-green-700">基调:</span> {wb.meta.tone}
          </div>
          <div className="border border-green-900 p-3">
            <span className="text-green-700">死亡:</span> {wb.physics.death_rule}
          </div>
          <div className="border border-green-900 p-3">
            <span className="text-green-700">魔法:</span> {wb.physics.magic_exists ? '存在' : '不存在'}
          </div>
          <div className="border border-green-900 p-3">
            <span className="text-green-700">科技:</span> {wb.physics.tech_level}
          </div>
        </div>

        {/* Factions */}
        <div className="border border-green-900 p-4 space-y-2">
          <h3 className="text-green-600 font-bold">势力</h3>
          {wb.society.factions.map((f, i) => (
            <div key={i} className="text-sm">
              <span className="crt-glow">{f.name}</span>
              <span className="text-green-800"> — {f.motivation}</span>
            </div>
          ))}
        </div>

        {/* Key locations */}
        <div className="border border-green-900 p-4 space-y-2">
          <h3 className="text-green-600 font-bold">关键地点</h3>
          {wb.generated_lore.key_locations.map((loc, i) => (
            <div key={i} className="text-sm">
              <span className="crt-glow">{loc.name}</span>
              <span className="text-green-800"> — {loc.description}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={() => router.push(`/world/${worldId}/character/create`)}
            className="border border-green-500 py-3 text-green-400 hover:bg-green-500/10 transition-colors crt-glow text-lg"
          >
            {'>'} 创建角色，进入冒险
          </button>
        </div>
      </div>
    </div>
  );
}
