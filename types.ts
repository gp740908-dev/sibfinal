export interface Villa {
  id: string;
  name: string;
  description: string;
  pricePerNight: number; // Stored as plain number, e.g., 3500000
  bedrooms: number;
  guests: number;
  imageUrl: string; // Keep for backward compatibility/thumbnail
  images?: string[]; // New array for gallery
  features: string[];
  // New Specs
  land_area: number;
  building_area: number;
  levels: number;
  bathrooms: number;
  pantry: number;
  pool_area?: number;
  // Location
  latitude: number;
  longitude: number;
  
  // New Rich Content (Optional as they might be empty in old records)
  amenities_detail?: Record<string, string[]>;
  house_rules?: {
    check_in: string;
    check_out: string;
    quiet_hours: string;
    parties: boolean;
    smoking: boolean;
    pets: boolean;
    max_guests: number;
  };
  proximity_list?: Array<{ name: string; distance: string }>;
  sleeping_arrangements?: Array<{ room: string; bed: string; view: string }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ConciergeState {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string; // Full content for detail page
  category: string;
  imageUrl: string;
  publishedAt: string;
  slug: string;
  author: string;
}