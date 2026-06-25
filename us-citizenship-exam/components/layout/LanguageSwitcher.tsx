'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'zh', label: '中文' },
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const segments = pathname.split('/').filter(Boolean);
  const currentCode = LOCALES.some((l) => l.code === segments[0]) ? segments[0] : 'en';
  const current = LOCALES.find((l) => l.code === currentCode)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const switchLocale = (code: string) => {
    if (code === currentCode) { setOpen(false); return; }
    const newPath = code + (segments.length > 1 ? '/' + segments.slice(1).join('/') : '');
    router.replace('/' + newPath);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-xl border-2 border-border bg-white px-2.5 py-1.5 text-sm font-bold text-fg transition-colors hover:bg-bg-alt"
      >
        {current.label}
        <ChevronDown size={14} className={`text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 min-w-[100px] overflow-hidden rounded-xl border-2 border-border bg-white shadow-lg">
          {LOCALES.map((loc) => (
            <button
              key={loc.code}
              onClick={() => switchLocale(loc.code)}
              className={`flex w-full items-center px-3 py-2 text-sm font-bold transition-colors ${
                loc.code === currentCode ? 'bg-primary-bg text-primary' : 'text-fg hover:bg-bg-alt'
              }`}
            >
              {loc.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
