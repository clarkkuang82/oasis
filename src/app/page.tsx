'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllWorlds } from '@/lib/db/worlds';
import type { World } from '@/lib/types/world-bible';

export default function Home() {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getAllWorlds().then((w) => {
      setWorlds(w);
      setLoaded(true);
    });
  }, []);

  return (
    <div className="crt-scanlines crt-flicker min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-2xl w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold crt-glow tracking-wider">
            OASIS
          </h1>
          <p className="text-green-600 text-sm">
            AI 驱动的文字世界 — 创造任何世界，一句话立即开玩
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 pt-8">
          <Link
            href="/world/create"
            className="border border-green-500 px-8 py-3 text-lg hover:bg-green-500/10 transition-colors crt-glow"
          >
            {'>'} 创造新世界
          </Link>
        </div>

        {/* Local worlds list */}
        {loaded && worlds.length > 0 && (
          <div className="pt-8 space-y-4">
            <h2 className="text-lg text-green-600 border-b border-green-900 pb-2">
              我的世界
            </h2>
            <ul className="space-y-2">
              {worlds.map((world) => (
                <li key={world.id}>
                  <Link
                    href={`/world/${world.id}`}
                    className="block p-3 border border-green-900 hover:border-green-500 hover:bg-green-500/5 transition-colors"
                  >
                    <div className="font-bold">{world.name}</div>
                    <div className="text-green-700 text-sm">{world.tagline}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {loaded && worlds.length === 0 && (
          <p className="text-center text-green-800 text-sm pt-4">
            还没有世界。创造你的第一个世界吧。
          </p>
        )}

        {/* Footer */}
        <div className="text-center text-green-900 text-xs pt-16">
          <span className="cursor-blink">_</span>
        </div>
      </main>
    </div>
  );
}
