interface UserInterface {
  id?: number;
  name?: string | null;
  mobile_number?: string | null;
  email?: string | null;
  password?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  invalidate_token_before?: Date | null;
}

export { UserInterface };
