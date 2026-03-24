import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock db
vi.mock('@/lib/db/worlds', () => ({
  getAllWorlds: vi.fn().mockResolvedValue([]),
}));

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the title "OASIS"', async () => {
    render(<Home />);
    expect(screen.getByText('OASIS')).toBeInTheDocument();
  });

  it('should render the create world button', () => {
    render(<Home />);
    expect(screen.getByText('> 创造新世界')).toBeInTheDocument();
  });

  it('should have a link to world creation', () => {
    render(<Home />);
    const link = screen.getByText('> 创造新世界');
    expect(link.closest('a')).toHaveAttribute('href', '/world/create');
  });

  it('should show empty state when no worlds', async () => {
    render(<Home />);
    // Wait for async world loading
    const emptyMsg = await screen.findByText('还没有世界。创造你的第一个世界吧。');
    expect(emptyMsg).toBeInTheDocument();
  });

  it('should show worlds list when worlds exist', async () => {
    const { getAllWorlds } = await import('@/lib/db/worlds');
    (getAllWorlds as ReturnType<typeof vi.fn>).mockResolvedValue([
      {
        id: 'w1',
        name: '赛博东京',
        tagline: '霓虹与阴影',
        worldBible: { meta: { name: '赛博东京', tagline: '霓虹与阴影', tone: '黑暗' } },
        createdAt: Date.now(),
      },
    ]);

    render(<Home />);
    const worldName = await screen.findByText('赛博东京');
    expect(worldName).toBeInTheDocument();
  });
});
