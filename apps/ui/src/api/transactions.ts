export const putDeposit = async ({
  amount,
  accountNumber,
}: {
  amount: string;
  accountNumber: string | number;
}) => {
  const data = await fetch(
    `http://localhost:3000/transactions/${accountNumber}/deposit`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    }
  );

  return data.json();
};

export const putWidthdrawal = async ({
  amount,
  accountNumber,
}: {
  amount: string;
  accountNumber: string | number;
}) => {
  const data = await fetch(
    `http://localhost:3000/transactions/${accountNumber}/withdraw`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    }
  );

  return data.json();
};
