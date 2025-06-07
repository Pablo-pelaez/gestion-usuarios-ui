export interface User {
  updatedAt: string | number | Date;
  createdAt: string | number | Date;
  website: any;
  isActive: any;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    zipcode: string;
  };
  company?: {
    name: string;
    position: string;
  };
  bio?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
  user?: User;
}
