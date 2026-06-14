export interface LoginPayload {
  userId: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
    };
  };
}