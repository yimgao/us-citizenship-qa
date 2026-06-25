'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Send } from 'lucide-react';

export default function FeedbackForm({ locale }: { locale: string }) {
  const t = useTranslations('feedback');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim()) return;
      // In a real app, this would send to an API
      setSubmitted(true);
    },
    [message]
  );

  if (submitted) {
    return (
      <section className="rounded-2xl border-2 border-border bg-card p-6 text-center shadow-sm sm:p-8">
        <p className="text-body font-bold text-primary">✅ Thanks for your feedback!</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border-2 border-border bg-card p-6 shadow-sm sm:p-8">
      <h2 className="mb-1 text-title font-bold text-fg">{t('title')}</h2>
      <p className="mb-4 text-body-sm text-muted-foreground">{t('subtitle')}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('email')}
          className="w-full rounded-xl border-2 border-border bg-bg p-3 text-body text-fg outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('message')}
          rows={3}
          required
          className="w-full rounded-xl border-2 border-border bg-bg p-3 text-body text-fg outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="flex items-center justify-center gap-2 self-start rounded-xl bg-primary px-5 py-2.5 text-body font-bold text-primary-fg transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={16} />
          {t('submit')}
        </button>
      </form>
    </section>
  );
}
