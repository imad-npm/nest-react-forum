import { Link } from 'react-router-dom';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4">
      <div className="max-w-md w-full text-center">
        {/* Status code */}
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          403 — Forbidden
        </p>

        {/* Title */}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Access denied
        </h1>

        {/* Description */}
        <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
          You don’t have permission to view this page.
          If you believe this is a mistake, contact a community moderator or administrator.
        </p>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md
              bg-zinc-900 text-white px-4 py-2 text-sm font-medium
              hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400
              dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Go home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-md
              border border-zinc-300 dark:border-zinc-700
              px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300
              hover:bg-zinc-100 dark:hover:bg-zinc-800
              focus:outline-none focus:ring-2 focus:ring-zinc-400"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
