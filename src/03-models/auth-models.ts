export type UserModel = {
  id: number;
  email: string;
  full_name: string;
  created_at: Date;
  updated_at: Date;
};

export type AuthTokenPayload = {
  userId: number;
  email: string;
};
