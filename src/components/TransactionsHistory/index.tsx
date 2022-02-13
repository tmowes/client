/* eslint-disable react/no-array-index-key */
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { FiArrowUpRight } from 'react-icons/fi'
import ethLogo from 'assets/ethCurrency.png'
import { useTransaction } from 'contexts/TransactionProvider'
import { sanityClient } from 'services/sanityClient'

import { styles } from './styles'
import { TransactionHistory } from './types'

export default function TransactionsHistory() {
  const { isLoading, currentAccount } = useTransaction()
  const [transactionHistory, setTransactionHistory] = useState<TransactionHistory[]>([])

  useEffect(() => {
    // eslint-disable-next-line prettier/prettier
    (async () => {
      if (!isLoading && currentAccount) {
        const query = `
          *[_type=="users" && _id == "${currentAccount}"] {
            "transactionList": transactions[]->{amount, toAddress, timestamp, txHash}|order(timestamp desc)[0..4]
          }
        `
        const clientRes = await sanityClient.fetch(query)
        setTransactionHistory(clientRes[0].transactionList)
      }
    })()
  }, [isLoading, currentAccount])

  return (
    <div className={styles.wrapper}>
      <div>
        {transactionHistory &&
          transactionHistory?.map((transaction, index) => (
            <div className={styles.txHistoryItem} key={index}>
              <div className={styles.txDetails}>
                <Image src={ethLogo} height={20} width={15} alt="eth" />
                {transaction.amount} Ξ sent to{' '}
                <span className={styles.toAddress}>
                  {transaction.toAddress.substring(0, 6)}...
                </span>
              </div>{' '}
              on{' '}
              <div className={styles.txTimestamp}>
                {new Date(transaction.timestamp).toLocaleString('en-US', {
                  timeZone: 'PST',
                  hour12: true,
                  timeStyle: 'short',
                  dateStyle: 'long',
                })}
              </div>
              <div className={styles.etherscanLink}>
                <a
                  href={`https://rinkeby.etherscan.io/tx/${transaction.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.etherscanLink}
                >
                  View on Etherscan
                  <FiArrowUpRight />
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
