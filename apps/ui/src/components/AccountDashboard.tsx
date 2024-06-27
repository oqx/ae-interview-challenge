import { useState, useCallback, FormEvent } from "react";
import Paper from "@mui/material/Paper/Paper";
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAtom } from "jotai";
import { authAtom } from "../atoms";
import { fetchAccount } from "../api/account";
import { putDeposit, putWidthdrawal } from "../api/transactions";
import { toast } from "react-toastify";
import { isApiErrorsObject } from "@ae/typeguards";

export const AccountDashboard = () => {
  const [token, setToken] = useAtom(authAtom);

  const queryClient = useQueryClient();

  const { data: account, isLoading: isLoadingAccount } = useQuery({
    queryKey: ["account", token],
    queryFn: ({ signal }) => fetchAccount(token!, signal),
    enabled: !!token,
    cacheTime: 100000,
  });

  const { mutate: addDeposit, isLoading: isAddingDeposit } = useMutation({
    mutationFn: (amount: string) =>
      putDeposit({ accountNumber: account?.accountNumber!, amount }),
    onSuccess(data) {
      if (isApiErrorsObject(data)) {
        toast.error(data.errors[0].message);
      } else {
        toast.success("Deposit added!");
        queryClient.setQueryData(["account", token], data);
      }
    },
    onError(data) {
      console.log(data);
    },
  });

  const { mutate: addWidthdrawal, isLoading: isAddingWithdrawal } = useMutation(
    {
      mutationFn: (amount: string) =>
        putWidthdrawal({ accountNumber: account?.accountNumber!, amount }),
      onSuccess(data) {
        if (isApiErrorsObject(data)) {
          toast.error(data.errors[0].message);
        } else {
          toast.success("Withdrawal successful!");
          queryClient.setQueryData(["account", token], data);
        }
      },
      onError(data) {
        console.log(data);
      },
    }
  );

  const onAddDeposit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      const form = new FormData(e.currentTarget);

      const value = form.get("deposit");
      if (typeof value === "string") {
        addDeposit(value);
      }
    },
    [addDeposit]
  );

  const onAddWithdrawal = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      const form = new FormData(e.currentTarget);

      const value = form.get("withdrawal");

      if (typeof value === "string") {
        addWidthdrawal(value);
      }
    },
    [addWidthdrawal]
  );

  const onSignout = useCallback(() => setToken(undefined), [setToken]);

  if (isLoadingAccount || !account) {
    return (
      <Paper className="account-dashboard">
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper className="account-dashboard">
      <div className="dashboard-header">
        <h1>Hello, {account.name}!</h1>
        <Button variant="contained" onClick={onSignout}>
          Sign Out
        </Button>
      </div>
      <h2>Balance: ${account.amount}</h2>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={6}>
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
                  loading={isAddingDeposit}
                >
                  Submit
                </LoadingButton>
              </CardContent>
            </Card>
          </form>
        </Grid>
        <Grid item xs={6}>
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
        </Grid>
      </Grid>
    </Paper>
  );
};
