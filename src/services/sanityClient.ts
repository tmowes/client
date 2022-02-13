import sanity from '@sanity/client'

export const sanityClient = sanity({
  projectId: process.env.NEXT_PUBLIC_SANITY_ID,
  dataset: 'production',
  apiVersion: 'v1',
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  useCdn: false,
})
