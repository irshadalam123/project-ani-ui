import { LogoMark } from '@/components/brand/Logo';
import { appName } from '@/config';

export function AuthShowcase() {
  return (
    <section className="relative hidden overflow-hidden bg-[#16142a] text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(129,140,248,0.45),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(109,40,217,0.35),transparent_36%)]" />
      <div className="relative flex items-center gap-3">
        <LogoMark />
        <div>
          <p className="text-sm font-semibold">{appName}</p>
          <p className="text-xs text-white/60">Comment to DM</p>
        </div>
      </div>
      <div className="relative max-w-md">
        <p className="text-4xl leading-tight font-semibold tracking-tight">
          Turn comments into conversations.
        </p>
        <p className="mt-4 text-sm leading-6 text-white/70">
          Connect an Instagram professional account, match a keyword, and send a public reply plus a private DM.
        </p>
      </div>
      <p className="relative text-xs text-white/50">Built for creators, businesses, and agencies.</p>
    </section>
  );
}
