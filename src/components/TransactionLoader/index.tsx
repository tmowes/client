import { MoonLoader } from 'react-spinners'

import { cssOverride, styles } from './styles'

export default function TransactionLoader() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Transaction in progress...</div>
      <MoonLoader color="#fff" loading css={cssOverride} size={50} />
    </div>
  )
}
