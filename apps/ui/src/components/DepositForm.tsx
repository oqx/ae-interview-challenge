import { LoadingButton } from "@mui/lab";
import { Card, CardContent, TextField } from "@mui/material";
import { FormEvent, useCallback } from "react";
import { useMutation, useQueryClient } from "react-query";
import { putDeposit } from "../api/transactions";
import { isApiErrorsObject } from "@ae/typeguards";
import { toast } from "react-toastify";
import { useAtomValue } from "jotai";
import { authAtom } from "../atoms";

export const DepositForm = () => {
  const queryClient = useQueryClient();

  const token = useAtomValue(authAtom);

  const { mutate: addDeposit, isLoading: isAddingDeposit } = useMutation({
    mutationFn: (amount: string) =>
      putDeposit({ accountNumber: token!, amount }),
    onSuccess(data) {
      if (isApiErrorsObject(data)) {
        toast.error(data.errors[0].message);
      } else {
        toast.success("Deposit added!");
        queryClient.setQueryData(["account", token], data);
      }
    },
    onError(data) {
      toast.error("There was an error while attempting a deposit.");
    },
  });

  const onAddDeposit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const form = new FormData(e.currentTarget);

      const value = form.get("deposit");

      console.log(form, value);

      if (typeof value === "string") {
        addDeposit(value);
      }
    },
    [addDeposit]
  );
  return (
    <form onSubmit={onAddDeposit}>
      <Card className="deposit-card">
        <CardContent>
          <h3>Deposit</h3>
          <TextField
            label="Deposit Amount"
            variant="outlined"
            type="number"
            name="deposit"
            sx={{
              display: "flex",
              margin: "auto",
            }}
          />
          <LoadingButton
            variant="contained"
            sx={{
              display: "flex",
              margin: "auto",
              marginTop: 2,
            }}
            type="submit"
            loading={isAddingDeposit}
          >
            Submit
          </LoadingButton>
        </CardContent>
      </Card>
    </form>
  );
};
