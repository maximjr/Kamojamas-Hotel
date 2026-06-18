export interface UserData {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  role?: "USER" | "ADMIN" | "SUPER_ADMIN";
  createdAt?: any;
}

export interface RoomData {
  id?: string;
  name: string;
  price: string;
  image: string;
  features: string[];
  size: string;
  offset?: number;
}

export interface ReservationData {
  id: string;
  userId: string;
  roomId: string;
  roomName: string;
  roomPrice: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  totalPrice?: number;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  guests?: number;
  specialRequests?: string;
  createdAt: any;
}
