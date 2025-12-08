"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const locales = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'zh', label: '中文' }
];

export default function LanguageSwitcher({ currentLocale }: { currentLocale: 'en'|'es'|'zh' }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  const onSelect = (code: string) => {
    if (!pathname) return;
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) {
      router.push(`/${code}`);
      return;
    }
    parts[0] = code;
    router.push('/' + parts.join('/'));
    setOpen(false);
  };

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right
      });
    }
  }, [open]);

  const current = locales.find(l => l.code === currentLocale) ?? locales[0];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 min-h-[44px] rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-foreground/70 hover:bg-slate-50 hover:text-primary active:bg-slate-100 touch-action-manipulation smooth-hover transition-all"
      >
        <span>{current.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <ul
            role="listbox"
            className="fixed w-40 overflow-hidden rounded-xl border border-slate-200 bg-white modern-shadow z-[110] animate-scale-in"
            style={{
              top: `${position.top}px`,
              right: `${position.right}px`
            }}
          >
            {locales.map((l) => (
              <li key={l.code}>
                <button
                  role="option"
                  aria-selected={l.code === currentLocale}
                  className={`min-h-[44px] w-full px-3 py-2.5 text-left text-sm font-medium touch-action-manipulation smooth-hover transition-all ${
                    l.code === currentLocale 
                      ? 'bg-blue-50 text-primary font-semibold' 
                      : 'text-foreground/70 hover:bg-slate-50 hover:text-primary active:bg-slate-100'
                  }`}
                  onClick={() => onSelect(l.code)}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}


