import { query } from "../utils/db";
import type { Account } from "@ae/types";

export const getAccount = async (accountID: string) => {
  const res = await query<Account>(
    `
    SELECT account_number, name, amount, type, credit_limit 
    FROM accounts 
    WHERE account_number = $1`,
    [accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Account not found");
  }

  return res.rows[0];
};
