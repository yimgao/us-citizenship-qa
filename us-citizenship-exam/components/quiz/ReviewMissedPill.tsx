'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

const MISSED_QUESTIONS_KEY = 'missed-questions';

export default function ReviewMissedPill({
  activeMode,
  activeCategory,
}: {
  activeMode: string;
  activeCategory: string;
}) {
  const t = useTranslations('quiz');
  const [hasMissed, setHasMissed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(MISSED_QUESTIONS_KEY);
      if (raw) {
        const ids = JSON.parse(raw) as unknown[];
        setHasMissed(Array.isArray(ids) && ids.length > 0);
      }
    } catch {
      setHasMissed(false);
    }
  }, []);

  if (!hasMissed) return null;

  return (
    <Link
      href={`/quiz?mode=${activeMode}&category=${activeCategory}&review=true`}
      className="rounded-xl bg-warning px-5 py-2.5 text-body-sm font-bold text-white transition-colors hover:brightness-110 inline-flex items-center gap-2"
    >
      <RotateCcw className="h-4 w-4" />
      {t('reviewMissedPill')}
    </Link>
  );
}
