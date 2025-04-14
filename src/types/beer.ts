export interface Beer {
  id: number;
  name: string;
  style: string;
  abv: number;
  ibu?: number;
  description?: string;
  brewDate: string;
  kegLevel: number;
}

export interface BeerCreateInput {
  name: string;
  style: string;
  abv: number;
  ibu?: number;
  description?: string;
  brewDate?: string;
  kegLevel?: number;
}
