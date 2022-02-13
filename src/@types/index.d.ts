import * as ethers from 'ethers'

declare module '*.png'

type CustomWindow = 'ethereum'

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider
  }
}
