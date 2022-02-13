/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import Image from 'next/image'
import { FormEvent } from 'react'
import { useRouter } from 'next/router'

import { RiSettings3Fill } from 'react-icons/ri'
import { AiOutlineDown } from 'react-icons/ai'
import Modal from 'react-modal'
import ethLogo from 'assets/eth.png'
import { useTransaction } from 'contexts/TransactionProvider'
import TransactionLoader from 'components/TransactionLoader'

import { customStyles, styles } from './styles'

Modal.setAppElement('#__next')

export default function Main() {
  const router = useRouter()
  const { formData, onFormChange, isLoading, sendTransaction } = useTransaction()
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const { addressTo, amount } = formData

    if (!addressTo || !amount) return

    sendTransaction()
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.formHeader}>
          <div>Swap</div>
          <div>
            <RiSettings3Fill />
          </div>
        </div>
        <div className={styles.transferPropContainer}>
          <input
            type="text"
            className={styles.transferPropInput}
            placeholder="0.0"
            pattern="^[0-9]*[.,]?[0-9]*$"
            onChange={(e) => onFormChange(e, 'amount')}
          />
          <div className={styles.currencySelector}>
            <div className={styles.currencySelectorContent}>
              <div className={styles.currencySelectorIcon}>
                <Image src={ethLogo} alt="eth logo" height={20} width={20} />
              </div>
              <div className={styles.currencySelectorTicker}>ETH</div>
              <AiOutlineDown className={styles.currencySelectorArrow} />
            </div>
          </div>
        </div>
        <div className={styles.transferPropContainer}>
          <input
            type="text"
            className={styles.transferPropInput}
            placeholder="0x..."
            onChange={(e) => onFormChange(e, 'addressTo')}
          />
          <div className={styles.currencySelector} />
        </div>
        <button
          type="submit"
          onClick={(e) => handleSubmit(e)}
          // disabled={isLoading}
          className={styles.confirmButton}
        >
          Confirm
        </button>
      </div>

      <Modal isOpen={!!router.query.loading} style={customStyles}>
        <TransactionLoader />
      </Modal>
    </div>
  )
}
