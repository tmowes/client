/* eslint-disable consistent-return */
import {
  ChangeEvent,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useRouter } from 'next/router'

import { ethers } from 'ethers'
import { contractAddress, contractABI } from 'constants/contract'
import { sanityClient } from 'services/sanityClient'

import { TransactionContextData, TransactionProviderProps } from './types'

export const TransactionContext = createContext({} as TransactionContextData)

let metamask: ethers.providers.ExternalProvider

if (typeof window !== 'undefined') {
  metamask = window.ethereum
}

const getEthereumContract = () => {
  if (!metamask) return alert('Please install metamask!!')
  const provider = new ethers.providers.Web3Provider(metamask)
  const signer = provider.getSigner()
  return new ethers.Contract(contractAddress, contractABI, signer)
}

export const TransactionProvider = (props: TransactionProviderProps) => {
  const { children } = props
  const router = useRouter()
  const [currentAccount, setCurrentAccount] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ addressTo: '', amount: '' })

  const onFormChange = (e: ChangeEvent<HTMLInputElement>, name: string) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }))
  }

  const connectWallet = async () => {
    try {
      if (!metamask) return alert('Please install metamask')
      const accounts = await metamask.request!({ method: 'eth_requestAccounts' })
      if (accounts) {
        setCurrentAccount(accounts[0])
      }
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object.')
    }
  }

  const saveTransaction = useCallback(
    async (txHash: string, amount: string, toAddress: string) => {
      const txDoc = {
        _type: 'transactions',
        _id: txHash,
        fromAddress: currentAccount!,
        toAddress,
        timestamp: new Date(Date.now()).toISOString(),
        txHash,
        amount: parseFloat(amount),
      }

      await sanityClient.createIfNotExists(txDoc)

      await sanityClient
        .patch(currentAccount!)
        .setIfMissing({ transactions: [] })
        .insert('after', 'transactions[-1]', [
          {
            _key: txHash,
            _ref: txHash,
            _type: 'reference',
          },
        ])
        .commit()
    },
    [currentAccount],
  )

  const sendTransaction = useCallback(async () => {
    try {
      if (!metamask) return alert('Please install metamask!')
      const { addressTo, amount } = formData
      console.log({ addressTo, amount })
      const transactionContract = getEthereumContract()

      const parsedAmount = ethers.utils.parseEther(amount)

      await metamask.request!({
        method: 'eth_sendTransaction',
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: '0x7EF40', // 520000 Gwei
            value: parsedAmount._hex,
          },
        ],
      })

      const transactionHash = await transactionContract?.publishTransaction(
        addressTo,
        parsedAmount,
        `Transferring ETH ${parsedAmount} to ${addressTo}`,
        'TRANSFER',
      )

      setIsLoading(true)

      await transactionHash.wait()

      await saveTransaction(transactionHash.hash, amount, addressTo)

      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }, [currentAccount, formData, saveTransaction])

  const checkIfWalletIsConnected = async () => {
    try {
      if (!metamask) return alert('Please install metamask ')
      const accounts = await metamask?.request!({ method: 'eth_accounts' })
      if (accounts?.length) {
        setCurrentAccount(accounts[0])
      }
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object.')
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  useEffect(() => {
    if (!currentAccount) return
    // eslint-disable-next-line prettier/prettier
    (async () => {
      const userDoc = {
        _type: 'users',
        _id: currentAccount,
        userName: 'Unnamed',
        address: currentAccount,
      }

      await sanityClient.createIfNotExists(userDoc)
    })()
  }, [currentAccount])

  useEffect(() => {
    if (isLoading) {
      router.push(`/?loading=${currentAccount}`)
    } else {
      router.push(`/`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount, isLoading])

  const providerValues = useMemo(
    () => ({
      connectWallet,
      currentAccount,
      formData,
      setFormData,
      onFormChange,
      sendTransaction,
      isLoading,
    }),
    [currentAccount, formData, isLoading, sendTransaction],
  )

  return (
    <TransactionContext.Provider value={providerValues}>{children}</TransactionContext.Provider>
  )
}

export function useTransaction(): TransactionContextData {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider')
  }
  return context
}
