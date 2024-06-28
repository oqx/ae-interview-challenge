export type Account = {
  account_number: number;
  name: string;
  amount: number;
  type: "checking" | "savings" | "credit";
  credit_limit: number;
};
