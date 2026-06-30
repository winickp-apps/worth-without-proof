import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col flex-1 px-6 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-stone-800">Worth Without Proof</h1>
        <p className="text-stone-500 text-sm mt-1">Your worth is not a verdict others give.</p>
      </div>

      <div className="space-y-4 flex-1">
        <Link href="/trigger" className="block">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 active:bg-stone-100">
            <div className="text-lg font-medium text-stone-800 mb-1">Log a Trigger</div>
            <div className="text-sm text-stone-500">
              Something activated your system. Trace it.
            </div>
          </div>
        </Link>

        <Link href="/evidence" className="block">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 active:bg-stone-100">
            <div className="text-lg font-medium text-stone-800 mb-1">Worth Evidence</div>
            <div className="text-sm text-stone-500">
              One moment today where your worth came from you.
            </div>
          </div>
        </Link>

        <Link href="/history" className="block">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 active:bg-stone-100">
            <div className="text-lg font-medium text-stone-800 mb-1">History</div>
            <div className="text-sm text-stone-500">
              Review your past entries.
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
