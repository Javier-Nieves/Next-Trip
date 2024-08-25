export interface Session {
  user?: {
    name?: string;
    email?: string;
    image?: string;
    id?: string;
  };
  expires: string;
}

export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  photo: string;
  friends: string[];
  friendRequests: string[];
  role: string;
  active: string;
}

export interface TripDocument {
  _id: string;
  travelers: string[];
  locations: string[];
  description: string;
  highlight: string;
  date: Date;
  createdAt: Date;
  private: boolean;
  createdBy: string;
  duration: number;
  coverImage: string;
}
