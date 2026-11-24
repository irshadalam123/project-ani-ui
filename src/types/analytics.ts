export interface AnalyticsOverview {
  comments_received: number;
  comments_matched: number;
  automations_triggered: number;
  public_replies_sent: number;
  private_replies_sent: number;
  messages_sent: number;
  failed_messages: number;
  link_clicks: number;
  leads: number;
}

/**
 * Planned shape for a future time-series endpoint.
 * The current API only returns lifetime totals from GET /api/v1/analytics/overview.
 */
export interface AnalyticsTimeseriesPoint {
  date: string;
  comments: number;
  dms: number;
  leads: number;
}

export interface AnalyticsTimeseries {
  range: '7d' | '30d' | '90d';
  points: AnalyticsTimeseriesPoint[];
}
