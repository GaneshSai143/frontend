export interface School {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
} 