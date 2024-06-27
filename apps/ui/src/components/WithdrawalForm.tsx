import { LoadingButton } from "@mui/lab";
import { Card, CardContent, TextField } from "@mui/material";
import { putWidthdrawal } from "../api/transactions";
import { useAtomValue } from "jotai";
import { authAtom } from "../atoms";
import { useMutation, useQueryClient } from "react-query";
import { isApiErrorsObject } from "@ae/typeguards";
import { toast } from "react-toastify";
import { type FormEvent, useCallback } from "react";

export const WithDrawalForm = () => {
  const token = useAtomValue(authAtom);

  const queryClient = useQueryClient();

  const { mutate: addWidthdrawal, isLoading: isAddingWithdrawal } = useMutation(
    {
      mutationFn: (amount: string) =>
        putWidthdrawal({ accountNumber: token!, amount }),
      onSuccess(data) {
        if (isApiErrorsObject(data)) {
          toast.error(data.errors[0].message);
        } else {
          toast.success("Withdrawal successful!");
          queryClient.setQueryData(["account", token], data);
        }
      },
      onError(data) {
        toast.error("There was an error while attempting a withdrawal.");
      },
    }
  );

  const onAddWithdrawal = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const form = new FormData(e.currentTarget);

      const value = form.get("withdrawal");

      if (typeof value === "string") {
        addWidthdrawal(value);
      }
    },
    [addWidthdrawal]
  );

  return (
    <form onSubmit={onAddWithdrawal}>
      <Card className="withdraw-card">
        <CardContent>
          <h3>Withdraw</h3>
          <TextField
            label="Withdraw Amount"
            variant="outlined"
            type="number"
            name="withdrawal"
            sx={{
              display: "flex",
              margin: "auto",
            }}
          />
          <LoadingButton
            variant="contained"
            type="submit"
            loading={isAddingWithdrawal}
            sx={{
              display: "flex",
              margin: "auto",
              marginTop: 2,
            }}
          >
            Submit
          </LoadingButton>
        </CardContent>
      </Card>
    </form>
  );
};
