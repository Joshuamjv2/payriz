export interface UserContextData {
  user?: {
    firstName?: string;
    lastName?: string;
    _id?: string;
  };
  customers?: any[];
  isProfileLoading?: boolean;
}
