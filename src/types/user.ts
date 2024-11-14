export interface DbUser {
  id: string;
  clerk_id: string;
  email: string;
  name: string;
  avatar_url?: string;
  membership_type: 'free' | 'pro' | 'enterprise';
  daily_extractions: number;
  last_extraction_date: string | null;
  points: number;
  points_reset_date: string;
} 