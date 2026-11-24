import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';

const articles = [
  {
    title: 'Connect Instagram',
    body: 'Open Instagram and choose Connect. The app requests an authorization URL from the API and sends the browser to Meta. Access tokens are stored by the API and are never returned to this app.',
  },
  {
    title: 'Keyword matching',
    body: 'Contains matches a whole keyword, ignoring case. "guide" matches "AI GUIDE" and does not match "guidance". Exact, starts with, and regular expressions are also available. Any comment matches every top-level comment.',
  },
  {
    title: 'Replies',
    body: 'A public reply is posted under the comment. A private reply is the DM. Templates can include {{first_name}} and {{username}}. Unknown placeholders are left unchanged.',
  },
  {
    title: 'What is still pending',
    body: 'The API does not yet provide billing, team invites, message sending from the inbox, post targeting, automation tests, or analytics time series. Those screens say so instead of inventing data.',
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-4">
      <PageHeader description="How comment-to-DM automations work in this workspace." />
      {articles.map((article) => (
        <Card key={article.title}>
          <CardHeader title={article.title} />
          <p className="px-5 py-4 text-sm leading-6 text-muted">{article.body}</p>
        </Card>
      ))}
    </div>
  );
}
