import { renderTemplate } from '@/lib/template';
import type { AutomationAction } from '@/types/automation';

export function AutomationPreview({
  keyword,
  username,
  firstName,
  actions,
}: {
  keyword: string;
  username: string;
  firstName: string;
  actions: AutomationAction[];
}) {
  const variables = { first_name: firstName, username };
  const publicReply = actions.find((action) => action.type === 'PUBLIC_REPLY');
  const privateReply = actions.find((action) => action.type === 'PRIVATE_REPLY');
  const handle = username.replace(/^@/, '') || 'commenter';

  return (
    <div className="overflow-hidden rounded-[28px] border border-line bg-ink text-white shadow-pop">
      <div className="flex items-center justify-between px-4 py-3 text-xs text-white/70">
        <span>Preview</span>
        <span>Instagram</span>
      </div>
      <div className="space-y-3 bg-[#12131a] px-4 py-4">
        <div>
          <p className="text-xs text-white/50">@{handle}</p>
          <p className="mt-1 text-sm">{keyword || 'GUIDE'}</p>
        </div>
        {publicReply ? (
          <div className="border-t border-white/10 pt-3">
            <p className="text-xs text-white/50">Your account</p>
            <p className="mt-1 text-sm">{renderTemplate(publicReply.text || '…', variables)}</p>
          </div>
        ) : null}
        {privateReply ? (
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-xs text-white/50">Private DM</p>
            <p className="mt-1 text-sm leading-6 whitespace-pre-wrap">
              {renderTemplate(privateReply.text || '…', variables)}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
