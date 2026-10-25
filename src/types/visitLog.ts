export interface VisitLog {
  id?: string;

  visitor_id: string;

  visitor_name: string;

  flat_number: string;

  image_url?: string;

  emotion: string;

  estimated_age: number;

  entry_time?: string;
}
