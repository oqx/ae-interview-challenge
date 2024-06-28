import { useCallback } from 'react'
import Paper from '@mui/material/Paper/Paper'
import { Button, Grid, CircularProgress } from '@mui/material'
import { useQuery } from 'react-query'
import { useAtom } from 'jotai'
import { authAtom } from '../atoms'
import { fetchAccount } from '../api/account'
import { DepositForm } from './DepositForm'
import { WithDrawalForm } from './WithdrawalForm'

export const AccountDashboard = () => {
  const [token, setToken] = useAtom(authAtom)

  const {
    data: account,
    isLoading: isLoadingAccount,
    isError
  } = useQuery({
    queryKey: ['account', token],
    queryFn: ({ signal }) => fetchAccount(token!, signal),
    enabled: !!token,
    cacheTime: 100000,
    staleTime: 100000
  })

  const onSignout = useCallback(() => setToken(undefined), [setToken])

  if (isLoadingAccount || !account) {
    return (
      <Paper className="account-dashboard loading-container">
        <CircularProgress />
      </Paper>
    )
  }

  if (isError) {
    return (
      <Paper className="account-dashboard loading-container">
        <p>There was an issue retrieving your account. Please try again.</p>
      </Paper>
    )
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
          <DepositForm />
        </Grid>
        <Grid item xs={6}>
          <WithDrawalForm />
        </Grid>
      </Grid>
    </Paper>
  )
}
