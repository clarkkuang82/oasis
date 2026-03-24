'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function GamePlayPage() {
  const params = useParams();
  const worldId = params.worldId as string;

  return (
    <div className="crt-scanlines crt-flicker min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-6">
        <Link href={`/world/${worldId}`} className="text-green-800 text-sm hover:text-green-600">
          {'<'} 返回世界
        </Link>
        <h1 className="text-3xl font-bold crt-glow">游戏终端</h1>
        <p className="text-green-600 text-sm">Phase 5 即将实现 CRT 游戏终端...</p>
      </div>
    </div>
  );
}
