export interface User {
  uid: string;
  email: string;
  displayName?: string;
  createdAt?: string; // stored as ISO string or timestamp
}
