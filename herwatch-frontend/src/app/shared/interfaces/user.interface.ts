export interface UserProfile {
  id?: number;
  firstName: string;
  lastName?: string;
  name?: string;
  email: string;
  phone: string;
  age?: number | null;
  gender?: string;
  username: string;
  createdAt?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  phone: string;
  age: number | null;
  gender: string;
  email: string;
  password: string;
  username: string;
  pin: string;
}
