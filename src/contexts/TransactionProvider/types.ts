import { ChangeEvent, Dispatch, ReactNode, SetStateAction } from 'react'

export type TransactionContextData = {
  isLoading: boolean
  currentAccount: string | null
  formData: FormDataDTO
  setFormData: Dispatch<SetStateAction<FormDataDTO>>
  onFormChange: (e: ChangeEvent<HTMLInputElement>, name: string) => void
  connectWallet: () => Promise<void>
  sendTransaction: () => Promise<void>
}

export type TransactionProviderProps = {
  children: ReactNode
}

export type FormDataDTO = {
  addressTo: string
  amount: string
}
