/**
 * Loading skeleton components
 * Reusable loading states for different modules
 */

export function QuizLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse">
      <div className="mb-6 h-8 w-48 mx-auto bg-slate-200 rounded"></div>
      <div className="rounded-2xl bg-white p-8 shadow-sm space-y-6">
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
        <div className="space-y-3">
          <div className="h-12 bg-slate-100 rounded"></div>
          <div className="h-12 bg-slate-100 rounded"></div>
          <div className="h-12 bg-slate-100 rounded"></div>
          <div className="h-12 bg-slate-100 rounded"></div>
        </div>
        <div className="flex justify-between pt-4">
          <div className="h-10 w-24 bg-slate-200 rounded"></div>
          <div className="h-10 w-24 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function FlashcardLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse">
      <div className="mb-6 h-8 w-48 mx-auto bg-slate-200 rounded"></div>
      <div className="rounded-2xl bg-white p-8 shadow-sm aspect-[4/3] flex items-center justify-center">
        <div className="space-y-4 w-full">
          <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-slate-100 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export function GlossaryLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      <div className="mb-6 h-8 w-48 mx-auto bg-slate-200 rounded"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="h-6 bg-slate-200 rounded w-1/4 mb-3"></div>
            <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GrammarLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      <div className="mb-6 h-8 w-48 mx-auto bg-slate-200 rounded"></div>
      <div className="rounded-xl bg-white p-8 shadow-sm space-y-6">
        <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-100 rounded w-full"></div>
          <div className="h-4 bg-slate-100 rounded w-5/6"></div>
          <div className="h-4 bg-slate-100 rounded w-4/6"></div>
        </div>
        <div className="h-32 bg-slate-50 rounded"></div>
      </div>
    </div>
  );
}
