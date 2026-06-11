export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(2,132,199,0.15)_0%,_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(16,185,129,0.12)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/6 w-72 h-72 rounded-full bg-sky-500/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/6 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
