import React from 'react'

interface PaginationProps {
    page: number;
    totalPages: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}
function Pagination({ page, totalPages, setPage }: PaginationProps) {
  const beforePages: number[] = []
  const afterPages: number[] = []

  if (totalPages <= 10) {
    for (let i = 2; i < page; i++) beforePages.push(i)
    for (let i = page + 1; i < totalPages; i++) afterPages.push(i)
  } else {
    for (let i = 1; i <= 3; i++) beforePages.push(page - i)
    for (let i = 1; i <= 3; i++) afterPages.push(page + i)
  }

  const baseBtn =
    'min-w-[36px] h-9 px-3 rounded-md text-sm font-medium transition-colors'

  const normalBtn =
    'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'

  const activeBtn =
    'bg-blue-600 text-white border border-blue-600 cursor-default'

  const disabledBtn =
    'opacity-50 cursor-not-allowed'

  return (
    <div className="flex items-center gap-1 select-none">
      {/* Prev */}
      <button
        className={`${baseBtn} ${normalBtn} ${page === 1 && disabledBtn}`}
        disabled={page === 1}
        onClick={() => setPage(p => Math.max(1, p - 1))}
      >
        Prev
      </button>

      {/* First page */}
      {page !== 1 && (
        <button
          className={`${baseBtn} ${normalBtn}`}
          onClick={() => setPage(1)}
        >
          1
        </button>
      )}

      {/* Left ellipsis */}
      {beforePages.length > 0 && beforePages[0] > 2 && (
        <span className="px-2 text-zinc-400">…</span>
      )}

      {/* Before pages */}
      {beforePages.map(p => (
        <button
          key={p}
          className={`${baseBtn} ${normalBtn}`}
          onClick={() => setPage(p)}
        >
          {p}
        </button>
      ))}

      {/* Current */}
      <button
        className={`${baseBtn} ${activeBtn}`}
        disabled
        aria-current="page"
      >
        {page}
      </button>

      {/* After pages */}
      {afterPages.map(p => (
        <button
          key={p}
          className={`${baseBtn} ${normalBtn}`}
          onClick={() => setPage(p)}
        >
          {p}
        </button>
      ))}

      {/* Right ellipsis */}
      {afterPages.length > 0 &&
        afterPages[afterPages.length - 1] < totalPages - 1 && (
          <span className="px-2 text-zinc-400">…</span>
        )}

      {/* Last page */}
      {totalPages !== page && (
        <button
          className={`${baseBtn} ${normalBtn}`}
          onClick={() => setPage(totalPages)}
        >
          {totalPages}
        </button>
      )}

      {/* Next */}
      <button
        className={`${baseBtn} ${normalBtn} ${
          page === totalPages && disabledBtn
        }`}
        disabled={page === totalPages}
        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination