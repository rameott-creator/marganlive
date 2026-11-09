import type { Author } from '../data/forum';

interface AvatarProps {
  author: Pick<Author, 'name' | 'hue'>;
  size?: number;
  className?: string;
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({ author, size = 36, className = '' }: AvatarProps) {
  const h = author.hue;
  return (
    <span
      className={`avatar ${className}`}
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        fontSize: Math.max(10, Math.round(size * 0.36)),
        background: `linear-gradient(140deg, hsl(${h} 45% 44%) 0%, hsl(${(h + 42) % 360} 48% 26%) 100%)`,
        boxShadow: `inset 0 0 0 1px hsl(${h} 60% 75% / 0.35)`,
      }}
    >
      {initials(author.name)}
    </span>
  );
}
