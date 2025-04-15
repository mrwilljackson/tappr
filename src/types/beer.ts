export interface Beer {
  id: number;
  name: string;
  style: string;
  abv: number;
  ibu?: number; // IBU can have decimal values
  description?: string;
  brewDate?: string;
  kegLevel?: number;
  brewUuid?: string;
  // Snake case versions from the database
  brew_date?: string;
  keg_level?: number;
  brew_uuid?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BeerCreateInput {
  name: string;
  style: string;
  abv: number;
  ibu?: number; // IBU can have decimal values
  description?: string;
  brewDate?: string;
  kegLevel?: number;
  brewUuid?: string;
}
