export interface UpdateUser {
  name?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  enabled?: boolean | null;
  idCoordinator?: string | null;
}
