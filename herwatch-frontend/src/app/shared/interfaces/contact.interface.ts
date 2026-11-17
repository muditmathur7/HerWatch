export interface EmergencyContact {
  id: number;
  userId: number;
  name: string;
  phone: string;
  email?: string;
  relationship?: string;
  isPrimary: boolean;
  createdAt?: string;
}

export interface ContactCreate {
  name: string;
  phone: string;
  email?: string;
  relationship?: string;
  isPrimary?: boolean;
}
