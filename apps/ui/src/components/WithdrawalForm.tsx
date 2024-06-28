import { LoadingButton } from "@mui/lab";
import { Card, CardContent, TextField } from "@mui/material";
import { putWidthdrawal } from "../api/transactions";
import { useAtomValue } from "jotai";
import { authAtom } from "../atoms";
import { useMutation, useQueryClient } from "react-query";
import { isApiErrorsObject } from "@ae/typeguards";
import { toast } from "react-toastify";
import { useForm, get } from "react-hook-form";

export const WithDrawalForm = () => {
  const token = useAtomValue(authAtom);

  const queryClient = useQueryClient();

  const { mutate: addWidthdrawal, isLoading } = useMutation({
    mutationFn: (amount: string) =>
      putWidthdrawal({ accountNumber: token!, amount }),
    onSuccess(data) {
      if (isApiErrorsObject(data)) {
        toast.error(data.errors[0].message, { theme: "colored" });
      } else {
        toast.success("Withdrawal successful!", { theme: "colored" });
        queryClient.setQueryData(["account", token], data);
      }
    },
    onError() {
      toast.error("There was an error while attempting a withdrawal.", {
        theme: "colored",
      });
    },
  });

  const { register, handleSubmit, formState } = useForm<{ withdrawal: string }>(
    {
      mode: "onBlur",
    }
  );

  const onAddWithdrawal = handleSubmit(({ withdrawal }) => {
    if (typeof withdrawal === "string") {
      addWidthdrawal(withdrawal);
    }
  });

  return (
    <form onSubmit={onAddWithdrawal}>
      <Card className="withdraw-card">
        <CardContent>
          <h3>Withdraw</h3>
          <div className="input">
            <TextField
              {...register("withdrawal", {
                required: { value: true, message: "Amount is required" },
                max: {
                  value: 200,
                  message: "A widthdrawal cannot exceed $200",
                },
                validate: (value: string) => {
                  if (+value % 5 === 0) {
                    return true;
                  }
                  return "Withdrawals must be increments of 5";
                },
              })}
              label="Withdraw Amount"
              error={get(formState, "errors.withdrawal.message")}
              variant="outlined"
              type="number"
              sx={{
                display: "flex",
                margin: "auto",
              }}
            />
            {!!get(formState, "errors.withdrawal.message") && (
              <p className="input__error">
                {get(formState, "errors.withdrawal.message")}
              </p>
            )}
          </div>
          <LoadingButton
            variant="contained"
            type="submit"
            loading={isLoading}
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
