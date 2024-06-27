import "./App.css";
import { Grid } from "@mui/material";
import { SignIn } from "./components/SignIn";
import { AccountDashboard } from "./components/AccountDashboard";
import { useAtomValue } from "jotai";
import { authAtom } from "./atoms";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const App = () => {
  const token = useAtomValue(authAtom);

  return (
    <QueryClientProvider client={client}>
      <div className="app">
        <Grid container>
          <Grid item xs={1} />
          <Grid item xs={10}>
            {token ? <AccountDashboard /> : <SignIn />}
          </Grid>
          <Grid item xs={1} />
        </Grid>
      </div>
      <ToastContainer />
    </QueryClientProvider>
  );
};
