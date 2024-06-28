import express, { Request, Response } from 'express'
import Joi, { Schema } from 'joi'
import { deposit, withdrawal } from '../handlers/transactionHandler'
import { isApiErrorsObject } from '@ae/typeguards'

const router = express.Router()

const transactionSchema: Schema = Joi.object({
  amount: Joi.number().required()
})

router.put('/:accountID/withdraw', async (request: Request, response: Response) => {
  const { error } = transactionSchema.validate(request.body)

  if (error) {
    return response.status(400).send(error.details[0].message)
  }

  try {
    const updatedAccount = await withdrawal(request.params.accountID, +request.body.amount)

    if (isApiErrorsObject(updatedAccount)) {
      return response.status(400).send(updatedAccount)
    }

    return response.status(200).send(updatedAccount)
  } catch (err) {
    if (err instanceof Error) {
      return response.status(500).send({ errors: [{ message: err.message, error: 'INTERNAL_ERROR' }] })
    }
  }
})

router.put('/:accountID/deposit', async (request: Request, response: Response) => {
  const { error } = transactionSchema.validate(request.body)

  if (error) {
    return response.status(400).send(error.details[0].message)
  }

  try {
    const updatedAccount = await deposit(request.params.accountID, +request.body.amount)

    if (isApiErrorsObject(updatedAccount)) {
      return response.status(400).send(updatedAccount)
    }

    return response.status(200).send(updatedAccount)
  } catch (err) {
    if (err instanceof Error) {
      return response.status(400).send({ errors: [{ message: err.message, error: 'INTERNAL_ERROR' }] })
    }
  }
})

export default router
