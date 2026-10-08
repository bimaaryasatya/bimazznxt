import Link from "next/link";
import { Train, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 text-cyan-400">
        <Train className="w-7 h-7" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-white mb-3 font-jakarta">
        404 — Signal Lost
      </h1>
      <p className="text-zinc-400 text-sm max-w-md mb-8">
        The railway archive page or track segment you are looking for does not exist or has been relocated.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 text-sm font-medium transition-all shadow-md"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Mainline Archive
      </Link>
    </div>
  );
}
