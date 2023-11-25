export interface UserContextData {
  user?: {
    firstName?: string;
    lastName?: string;
    _id?: string;
  };
  customers?: any[];
  isProfileLoading?: boolean;
}

// export interface CustomerInfo {
//   address: string;
//   created?: string;
//   email: string;
//   id: string;
//   name: string;
//   owner: string;
//   phone: string;
// }
