import { resolver } from "blitz"
import { z } from "zod"
import client from "integrations/plaid"
import { CountryCode, Products } from "plaid"

const CreateLinkToken = z.object({
  organizationId: z.string(),
})

interface linkTokenQueryResponse {
  expiration: string
  link_token: string
  request_id: string
}

export default resolver.pipe(
  resolver.zod(CreateLinkToken),
  resolver.authorize(),
  async (input): Promise<linkTokenQueryResponse> => {
    const request = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: input.organizationId,
      },
      client_name: "Wallet pay",
      products: [Products.Auth],
      language: "en",
      webhook: "https://webhook.example.com",
      country_codes: [CountryCode.Us],
    }
    const createTokenResponse = await client.linkTokenCreate(request)
    return createTokenResponse.data
  }
)
