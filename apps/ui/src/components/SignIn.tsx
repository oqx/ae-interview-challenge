import { Paper, Grid, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { fetchAccount } from "../api/account";
import { toast } from "react-toastify";
import { useSetAtom } from "jotai";
import { authAtom } from "../atoms";
import { useForm, get } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";

export const SignIn = () => {
  const setToken = useSetAtom(authAtom);

  const queryClient = useQueryClient();

  const { register, handleSubmit, formState } = useForm<{
    accountNumber: string;
  }>({ mode: "onBlur" });

  const { mutate: onSignIn, isLoading } = useMutation({
    mutationFn: (accountNumber: string) => fetchAccount(accountNumber),
    onSuccess(data) {
      queryClient.setQueryData(
        ["account", data.account_number.toString()],
        data
      );
      if (data.account_number) {
        setToken(data.account_number.toString());
      }
    },
    onError() {
      toast.error("Account not found", { theme: "colored" });
    },
  });

  const onSubmit = handleSubmit(async ({ accountNumber }) => {
    if (typeof accountNumber === "string") {
      onSignIn(accountNumber);
    }
  });

  return (
    <Paper sx={{ border: 20, borderBottom: 30, borderColor: "white" }}>
      <h1 className="app-title">Please Sign in with your Account Number:</h1>
      <form onSubmit={onSubmit}>
        <Grid container>
          <Grid item xs={2} />
          <Grid item xs={8}>
            <div className="input">
              <TextField
                type="number"
                variant="outlined"
                label="Account Number"
                sx={{ display: "flex", margin: "auto" }}
                error={get(formState, "errors.accountNumber.message")}
                {...register("accountNumber", {
                  required: {
                    value: true,
                    message: "Account number is required",
                  },
                })}
              />
              {!!get(formState, "errors.accountNumber.message") && (
                <p className="input__error">
                  {get(formState, "errors.accountNumber.message")}
                </p>
              )}
            </div>
          </Grid>
          <Grid item xs={2} />
        </Grid>
        <LoadingButton
          variant="contained"
          loading={isLoading}
          color="primary"
          type="submit"
          sx={{
            display: "block",
            margin: "auto",
            marginTop: 2,
          }}
        >
          Sign In
        </LoadingButton>
      </form>
    </Paper>
  );
};
