import { Beer } from '@/types/beer';

// Sample beer data - in a real app, this would come from a database
export const sampleBeers: Beer[] = [
  {
    id: 1,
    name: 'Hoppy IPA',
    style: 'India Pale Ale',
    abv: 6.5,
    ibu: 65,
    description: 'A hoppy IPA with citrus and pine notes',
    brewDate: '2023-10-15',
    kegLevel: 85, // percentage full
  },
  {
    id: 2,
    name: 'Chocolate Stout',
    style: 'Stout',
    abv: 7.2,
    ibu: 35,
    description: 'Rich stout with chocolate and coffee flavors',
    brewDate: '2023-11-20',
    kegLevel: 92,
  },
  {
    id: 3,
    name: 'Belgian Wit',
    style: 'Witbier',
    abv: 5.0,
    ibu: 15,
    description: 'Light and refreshing with orange and coriander',
    brewDate: '2024-01-05',
    kegLevel: 45,
  },
];
