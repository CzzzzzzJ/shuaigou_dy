export interface DbUser {
  id: string;
  email: string;
  name: string;
  clerk_id: string;
  avatar_url?: string;
  membership_type: string;
  daily_extractions: number;
  last_extraction_date?: string;
} 