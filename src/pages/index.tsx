import Header from 'components/Header'
import Main from 'components/Main'
import TransactionsHistory from 'components/TransactionsHistory'

export default function Home() {
  return (
    <div className="h-min-screen flex h-screen max-h-screen w-screen select-none flex-col justify-between bg-[#1F2128] text-white">
      <Header />
      <Main />
      <TransactionsHistory />
    </div>
  )
}
