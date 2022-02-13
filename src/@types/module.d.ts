type CustomEnvVar =
  | 'NEXT_PUBLIC_SANITY_ID'
  | 'NEXT_PUBLIC_SANITY_TOKEN'
  | 'NEXT_PUBLIC_SMART_CONTRACT_ADDRESS'

type ProcessEnvExtended = {
  [key in CustomEnvVar]: string
}

declare namespace NodeJS {
  export interface ProcessEnv extends ProcessEnvExtended {}
}
