import type { Account, TransactionHistory, ApiError } from "@ae/types";
import { DAILY_WITHDRAWAL_LIMIT } from "../constants";
import { query } from "../utils/db";
import { getAccount } from "./accountHandler";

export const withdrawal = async (
  accountId: string,
  amount: number
): Promise<{ errors: ApiError[] } | Account> => {
  const errors: ApiError[] = [];

  if (amount % 5 !== 0) {
    errors.push({
      error: "INVALID_INCREMENT",
      message: "Amount must be divisible by 5.",
    });
  }

  if (amount > 200) {
    errors.push({
      error: "WITHDRAWAL_TOO_LARGE",
      message: "Withdrawal cannot exceed $200.",
    });
  }

  if (errors.length) {
    /**
     * Returns errors here to avoid unnecessary DB query.
     */
    return { errors };
  }

  const account = await getAccount(accountId);

  if (
    ["checking", "savings"].includes(account.type) &&
    account.amount < amount
  ) {
    errors.push({
      error: "INSUFFICIENT_FUNDS",
      message: "Insufficient funds.",
    });
  }

  if (
    account.type === "credit" &&
    account.creditLimit < Math.abs(account.amount) + amount
  ) {
    errors.push({
      error: "CREDIT_LIMIT_EXCEEDED",
      message: `Withdrawal exceeds available credit of ${
        account.creditLimit
      } by ${Math.abs(account.amount) + amount - account.creditLimit}.`,
    });
  }

  if (errors.length) {
    /**
     * Returns errors here to avoid unnecessary DB query.
     */
    return { errors };
  }

  const { errors: limitErrors } = await deriveErrorFromWithdrawalLimit({
    accountId,
    amount,
    type: account.type,
  });

  if (limitErrors.length) {
    return { errors: limitErrors };
  }

  account.amount -= amount;

  const res = await query<Account>(
    `
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountId]
  );

  /**
   * Records update to transaction history.
   */
  await updateTransactionHistory({ accountId, amount, type: "withdrawal" });

  if (res.rowCount === 0) {
    throw new Error("Transaction failed");
  }

  return account;
};

export const deposit = async (
  accountID: string,
  amount: number
): Promise<{ errors: ApiError[] } | Account> => {
  if (amount > 1000) {
    return {
      errors: [
        {
          error: "MAX_DEPOSIT_EXCEEDED",
          message: `A single deposit cannot exceed $1000.`,
        },
      ],
    };
  }
  const account = await getAccount(accountID);

  if (account.type === "credit" && account.amount + amount > 0) {
    return {
      errors: [
        {
          error: "CREDIT_DEPOSIT_EXCEEDS_ZERO",
          message: `A credit deposit cannot add a positive account balance.`,
        },
      ],
    };
  }

  account.amount += amount;

  const res = await query<Account>(
    `
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Transaction failed");
  }

  return account;
};

export const updateTransactionHistory = async (params: {
  accountId: string;
  amount: number;
  type: "withdrawal" | "deposit";
}) => {
  const res = await query<TransactionHistory>(
    `
    INSERT INTO transaction_history (account_number, transaction_date, amount, type)
      VALUES ($1, CURRENT_TIMESTAMP, $2, $3)
      RETURNING *;`,
    [params.accountId, params.amount, params.type]
  );

  if (res.rowCount === 0) {
    throw new Error("Unable to update transaction history");
  }

  return res.rows[0];
};

/**
 * @summary Queries transaction_history table to determine whether a
 * user has or is attempting to transact beyond {@link DAILY_WITHDRAWAL_LIMIT}.
 *
 * @param accountId Id of account
 *
 * @param amount Dollar amount for withdrawal attempt
 *
 */
const deriveErrorFromWithdrawalLimit = async ({
  accountId,
  amount,
  type,
}: {
  accountId: string;
  amount: number;
  type: Account["type"];
}): Promise<{ errors: ApiError[] | [] }> => {
  const res = await query<{ total_withdrawal_amount: number }>(
    `
    SELECT SUM(amount) AS total_withdrawal_amount
    FROM transaction_history
    WHERE type = 'withdrawal' 
    AND account_number = $1
    AND DATE(transaction_date) = CURRENT_DATE;`,
    [accountId]
  );

  const totalWithdrawnToday = +res.rows[0].total_withdrawal_amount || 0;

  if (totalWithdrawnToday + amount > DAILY_WITHDRAWAL_LIMIT) {
    return {
      errors: [
        {
          error: "DAILY_LIMIT_EXCEEDED",
          message: `Could not complete withdrawal of ${amount} as your account will exceed the daily withdrawal limit of ${DAILY_WITHDRAWAL_LIMIT} by ${
            totalWithdrawnToday + amount - DAILY_WITHDRAWAL_LIMIT
          }.`,
        },
      ],
    };
  }
  return {
    errors: [],
  };
};

export const getTransactionHistory = async (accountId: string) => {
  const res = await query<TransactionHistory>(
    `
    SELECT 
      id,
      transaction_date,
      amount,
      type
    FROM transaction_history
    WHERE 
      account_number = $1;`,
    [accountId]
  );

  return res.rows;
};
