'use client';

import { useState } from 'react';
import { Search, Loader2, CheckCircle2, XCircle, Clock, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type StatusType = 'approved' | 'pending' | 'rejected' | 'unknown' | null;

interface CaseResult {
  receiptNumber: string;
  status: string;
  details: string;
  statusType: StatusType;
}

export default function CaseStatusPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const [receiptNumber, setReceiptNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CaseResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/case-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiptNumber }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to check status');
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    approved: { icon: CheckCircle2, bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', label: 'Approved' },
    pending: { icon: Clock, bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700', label: 'Pending' },
    rejected: { icon: XCircle, bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700', label: 'Rejected' },
    unknown: { icon: AlertCircle, bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-700', label: 'Unknown' },
  } as const;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/${locale}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-fg transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      <h1 className="text-display font-bold text-fg">Case Status Check</h1>
      <p className="mt-1 text-body-lg text-muted-foreground">
        Check your USCIS case status using your receipt number.
      </p>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={receiptNumber}
            onChange={(e) => setReceiptNumber(e.target.value.toUpperCase())}
            placeholder="e.g. MSC2190000000"
            className="flex-1 rounded-2xl border-2 border-border bg-white px-5 py-3.5 text-base font-medium text-fg outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            required
            maxLength={15}
          />
          <button
            type="submit"
            disabled={loading || receiptNumber.length < 10}
            className="flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-primary px-7 text-base font-bold text-primary-fg shadow-sm transition-all hover:brightness-105 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Search size={20} />
            )}
            Check Status
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Enter your USCIS receipt number (e.g. MSC2190000000, IOE1234567890)
        </p>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-2xl border-2 border-red-500 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div>
              <p className="font-bold text-red-700">Error</p>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-6">
          <div className={`rounded-2xl border-2 ${statusConfig[result.statusType || 'unknown'].border} ${statusConfig[result.statusType || 'unknown'].bg} p-6`}>
            <div className="flex items-center gap-3">
              {(() => {
                const Icon = statusConfig[result.statusType || 'unknown'].icon;
                return <Icon className={`h-8 w-8 ${statusConfig[result.statusType || 'unknown'].text}`} />;
              })()}
              <div>
                <p className="text-caption font-bold uppercase text-muted-foreground">
                  Receipt #{result.receiptNumber}
                </p>
                <h2 className={`text-title font-bold ${statusConfig[result.statusType || 'unknown'].text}`}>
                  {result.status}
                </h2>
              </div>
            </div>
            {result.details && (
              <p className="mt-3 text-body-sm text-fg/80 leading-relaxed">
                {result.details}
              </p>
            )}
          </div>

          <div className="mt-4 rounded-2xl border-2 border-border bg-card p-5">
            <h3 className="text-body font-bold text-fg">About this service</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              This tool checks the official USCIS case status website. Results may not be real-time
              and should be verified on the{' '}
              <a
                href="https://egov.uscis.gov/casestatus/landing.do"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-primary underline underline-offset-2"
              >
                official USCIS website
              </a>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
