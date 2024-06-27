import { FormEvent, useCallback, useState } from "react";
import { Paper, Grid, TextField, Button } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { fetchAccount } from "../api/account";
import { toast } from "react-toastify";
import { useSetAtom } from "jotai";
import { authAtom } from "../atoms";

export const SignIn = () => {
  const [accountNumberError, setAccountNumberError] = useState(false);

  const setToken = useSetAtom(authAtom);

  const queryClient = useQueryClient();

  const { mutate: onSignIn } = useMutation({
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
      toast.error("Account not found");
      setAccountNumberError(true);
    },
  });

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const form = new FormData(e.currentTarget);

      const accountNumber = form.get("accountNumber");
      if (typeof accountNumber === "string") {
        onSignIn(accountNumber);
      }
    },
    [onSignIn]
  );

  return (
    <Paper sx={{ border: 20, borderBottom: 30, borderColor: "white" }}>
      <h1 className="app-title">Please Sign in with your Account Number:</h1>
      <form onSubmit={onSubmit}>
        <Grid container>
          <Grid item xs={2} />
          <Grid item xs={8}>
            <TextField
              type="number"
              variant="outlined"
              label="Account Number"
              name="accountNumber"
              sx={{ display: "flex", margin: "auto" }}
              error={accountNumberError}
            />
          </Grid>
          <Grid item xs={2} />
        </Grid>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            display: "block",
            margin: "auto",
            marginTop: 2,
          }}
        >
          Sign In
        </Button>
      </form>
    </Paper>
  );
};
