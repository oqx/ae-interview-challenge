import { Account } from "@ae/types";

export const fetchAccount = async (
  accountNumber: string,
  signal?: AbortSignal
): Promise<Account> => {
  const res = await fetch(`http://localhost:3000/accounts/${accountNumber}`, {
    signal,
  });

  return res.json();
};
