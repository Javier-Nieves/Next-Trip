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
  friends: string[] | UserDocument[];
  friendRequests: string[] | UserDocument[];
  role: string;
  active: string;
}

export interface TripDocument {
  _id: string;
  name: string;
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

export interface UserInfo {
  user: UserDocument | null;
  name?: string;
  photo?: string;
  isMe: boolean;
  myId?: string;
  isFriend: boolean;
  isFriendRequest: boolean;
  friends: string[];
}

export interface BasicUserInfo {
  id: string;
  name: string;
  photo?: string;
}

export interface TripInfo {
  trip: TripDocument | null;
  travelersArray: { name: string; photo?: string; id: string }[];
  isMyTrip: boolean;
}

export interface NewLocationData {
  name: string;
  address: string;
  description: string;
}

export interface FullLocationData {
  name: string;
  address: string;
  description: string;
  coordinates: string[];
  isHike: boolean;
  images: File[];
}
