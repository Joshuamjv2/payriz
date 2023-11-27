export interface UserContextData {
  user?: {
    firstName?: string;
    lastName?: string;
    _id?: string;
    businessName?: string;
  };
  customers?: any[];
  invoices?: any[];
  isProfileLoading?: boolean;
  isInvoiceLoading?: boolean;
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
