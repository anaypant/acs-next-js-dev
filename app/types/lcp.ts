// Types for Lead Conversion Pipeline (LCP)
// Easily extensible for future attributes

export interface Thread {
  conversation_id: string;
  associated_account: string;
  lcp_enabled: boolean;
  read: boolean;
  source: string;
  source_name: string;
  lcp_flag_threshold: number;
  ai_summary: string;
  budget_range: string;
  preferred_property_types: string;
  timeline: string;
  phone?: string;
  location?: string;
  busy?: boolean; // true if LCP is busy, false otherwise
  flag_for_review?: boolean; // true if conversation is flagged for review
  flag_review_override?: string; // 'true' if review check is disabled, undefined or 'false' if enabled
  // [key: string]: any; // Uncomment to allow arbitrary extension
}

export interface Message {
  conversation_id: string;
  response_id: string;
  associated_account: string;
  body: string;
  ev_score: number;
  in_reply_to: string | null;
  is_first_email: boolean;
  receiver: string;
  sender: string;
  subject: string;
  timestamp: string;
  type: string;
} 