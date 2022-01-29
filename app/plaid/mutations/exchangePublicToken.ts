import { resolver } from "blitz"
import { z } from "zod"
import client from "integrations/plaid"

const ExchangePublicToken = z.object({
  publicToken: z.string(),
})

export default resolver.pipe(
  resolver.zod(ExchangePublicToken),
  resolver.authorize(),
  async (input) => {
    const response = await client.itemPublicTokenExchange({
      public_token: input.publicToken,
    })
    const accessToken = response.data.access_token
    return accessToken
  }
)
