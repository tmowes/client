/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { FiArrowUpRight } from 'react-icons/fi'
import { AiOutlineDown } from 'react-icons/ai'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import ethLogo from 'assets/eth.png'
import uniswapLogo from 'assets/uniswap.png'
import { useTransaction } from 'contexts/TransactionProvider'

import { styles } from './styles'

export default function Header() {
  const [selectedNav, setSelectedNav] = useState('swap')
  const [userName, setUserName] = useState('')
  const { connectWallet, currentAccount } = useTransaction()

  useEffect(() => {
    if (currentAccount) {
      setUserName(`${currentAccount.slice(0, 5)}...${currentAccount.slice(35, 42)}`)
    }
  }, [currentAccount])

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerLogo}>
        <Image src={uniswapLogo} alt="uniswap" height={40} width={40} />
      </div>
      <div className={styles.nav}>
        <div className={styles.navItemsContainer}>
          <div
            onClick={() => setSelectedNav('swap')}
            className={`${styles.navItem} ${selectedNav === 'swap' && styles.activeNavItem}`}
          >
            Swap
          </div>
          <div
            onClick={() => setSelectedNav('pool')}
            className={`${styles.navItem} ${selectedNav === 'pool' && styles.activeNavItem}`}
          >
            Pool
          </div>
          <div
            onClick={() => setSelectedNav('vote')}
            className={`${styles.navItem} ${selectedNav === 'vote' && styles.activeNavItem}`}
          >
            Vote
          </div>
          <a href="https://info.uniswap.org/#/" target="_blank" rel="noreferrer">
            <div className={styles.navItem}>
              Charts <FiArrowUpRight />
            </div>
          </a>
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        <div className={`${styles.button} ${styles.buttonPadding}`}>
          <div className={styles.buttonIconContainer}>
            <Image src={ethLogo} alt="eth logo" height={20} width={20} />
          </div>
          <p>Ethereum</p>
          <div className={styles.buttonIconContainer}>
            <AiOutlineDown />
          </div>
        </div>
        {currentAccount ? (
          <div className={`${styles.button} ${styles.buttonPadding}`}>
            <div className={styles.buttonTextContainer}>{userName}</div>
          </div>
        ) : (
          <div
            className={`${styles.button} ${styles.buttonPadding}`}
            onClick={() => connectWallet()}
          >
            <div className={`${styles.buttonAccent} ${styles.buttonPadding}`}>
              Connect Wallet
            </div>
          </div>
        )}
        <div className={`${styles.button} ${styles.buttonPadding}`}>
          <div className={`${styles.buttonIconContainer} mx-2`}>
            <HiOutlineDotsVertical />
          </div>
        </div>
      </div>
    </div>
  )
}
