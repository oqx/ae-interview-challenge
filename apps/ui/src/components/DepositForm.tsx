import { LoadingButton } from '@mui/lab'
import { Card, CardContent, TextField } from '@mui/material'
import { useMutation, useQueryClient } from 'react-query'
import { putDeposit } from '../api/transactions'
import { isApiErrorsObject } from '@ae/typeguards'
import { toast } from 'react-toastify'
import { useAtomValue } from 'jotai'
import { authAtom } from '../atoms'
import { useForm, get } from 'react-hook-form'

export const DepositForm = () => {
  const queryClient = useQueryClient()

  const token = useAtomValue(authAtom)

  const { register, handleSubmit, formState } = useForm<{ deposit: string }>()

  const { mutate: addDeposit, isLoading } = useMutation({
    mutationFn: (amount: string) => putDeposit({ accountNumber: token!, amount }),
    onSuccess(data) {
      if (isApiErrorsObject(data)) {
        toast.error(data.errors[0].message, { theme: 'colored' })
      } else {
        toast.success('Deposit added!', { theme: 'colored' })
        queryClient.setQueryData(['account', token], data)
      }
    },
    onError() {
      toast.error('There was an error while attempting a deposit.', {
        theme: 'colored'
      })
    }
  })

  const onAddDeposit = handleSubmit(({ deposit }) => {
    if (typeof deposit === 'string') {
      addDeposit(deposit)
    }
  })

  return (
    <form onSubmit={onAddDeposit}>
      <Card className="deposit-card">
        <CardContent>
          <h3>Deposit</h3>
          <div className="input">
            <TextField
              label="Deposit Amount"
              variant="outlined"
              type="number"
              sx={{
                display: 'flex',
                margin: 'auto'
              }}
              {...register('deposit', {
                required: {
                  value: true,
                  message: 'This field is required'
                },
                max: {
                  value: 1000,
                  message: 'Deposits are limited to $1000 per transaction'
                }
              })}
            />
            {!!get(formState, 'errors.deposit.message') && (
              <p className="input__error">{get(formState, 'errors.deposit.message')}</p>
            )}
          </div>
          <LoadingButton
            variant="contained"
            sx={{
              display: 'flex',
              margin: 'auto',
              marginTop: 2
            }}
            type="submit"
            loading={isLoading}
          >
            Submit
          </LoadingButton>
        </CardContent>
      </Card>
    </form>
  )
}
