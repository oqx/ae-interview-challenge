export type TransactionHistory = {
    id: string;
    account_number: number;
    transaction_date: string;
    amount: number;
    type: 'withdrawal' | 'deposit'
}