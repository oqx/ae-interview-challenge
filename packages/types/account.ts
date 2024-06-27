export type Account = {
  accountNumber: number;
  name: string;
  amount: number;
  type: 'checking' | 'savings' | 'credit';
  creditLimit: number;
}