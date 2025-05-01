
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "manager" | "employee";
  isAuthenticated?: boolean;
  username?: string;
}
