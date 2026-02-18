export interface GameEvent {
  id: string;
  title: string;
  description: string;
  details: string;
  date: string;
  status: 'live' | 'upcoming' | 'ended';
  image: string;
  badge: string;
  rewards?: string[];
}
