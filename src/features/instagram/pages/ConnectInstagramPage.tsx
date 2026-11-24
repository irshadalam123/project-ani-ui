import { MessageCircle, Send, Target, ChartColumn } from 'lucide-react';
import { useLazyGetInstagramConnectLinkQuery } from '@/api/instagramApi';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/toast-context';
import { parseApiError } from '@/lib/errors';

const features = [
  { title: 'Automate comments', description: 'Match keywords on incoming comments.', icon: MessageCircle },
  { title: 'Send personalized DMs', description: 'Use first name and username in the reply.', icon: Send },
  { title: 'Capture leads', description: 'Contacts are stored when a conversation starts.', icon: Target },
  { title: 'Track performance', description: 'See comments, replies, and failures in analytics.', icon: ChartColumn },
];

export default function ConnectInstagramPage() {
  const [connect, state] = useLazyGetInstagramConnectLinkQuery();
  const toast = useToast();

  async function start() {
    try {
      const link = await connect().unwrap();
      window.location.assign(link.authorization_url);
    } catch (error) {
      toast.error(parseApiError(error));
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-brand to-violet px-6 py-10 text-white sm:px-10">
          <p className="text-sm font-medium text-white/80">Instagram</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Connect your Instagram account</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/80">
            Connect your Instagram Professional account to automate comments and DMs.
          </p>
        </div>
        <div className="grid gap-3 p-6 sm:grid-cols-2 sm:p-8">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-line p-4">
              <feature.icon className="size-4 text-brand" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-semibold">{feature.title}</h3>
              <p className="mt-1 text-sm text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 border-t border-line px-6 py-5 sm:px-8">
          <Button className="sm:w-fit" loading={state.isFetching} onClick={() => void start()}>
            Connect Instagram
          </Button>
          <p className="text-xs text-faint">
            This opens the authorization URL returned by GET /api/v1/instagram/connect. Meta then returns to the API callback. The current API responds with JSON there instead of redirecting back to this app.
          </p>
        </div>
      </Card>
    </div>
  );
}
