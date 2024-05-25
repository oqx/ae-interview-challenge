import { useState } from 'react';
import './App.css';
import { Grid } from '@mui/material';
import { SignIn } from './components/SignIn';
import { AccountDashboard } from './components/AccountDashboard';
import { account } from './Types/Account';



export const App = () => {
  const [accountNumberError, setAccountNumberError] = useState(false);
  const [account, setAccount] = useState<account | undefined>(undefined);

  const signIn = async (accountNumber: number) => {
    const response = await fetch(`http://localhost:3000/accounts/${accountNumber}`);

    if(response.status !== 200) {
      alert('Account not found');
      setAccountNumberError(true);
      setAccount(undefined);
      return;
    }
      
    setAccountNumberError(false);
    setAccount(await response.json());
  }
  const signOut = async () => {
    setAccount(undefined);
  }

  const Page = () => {
    if(account) {
      return <AccountDashboard account={account} signOut={signOut}/>
    } else {
      return <SignIn 
        signIn={signIn}
        accountNumberError={accountNumberError}
      />
    }
  }

  return (
    <div className="app">
      <Grid container>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Page />
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </div>
  );
}