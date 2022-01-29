import { resolver } from "blitz"
import { z } from "zod"
import client from "integrations/plaid"
import { AccountBase, AuthGetNumbers, AuthGetRequest } from "plaid"

const GetAccountInfo = z.object({
  // Using optional so it accepts undefined but will just return NotFoundError instead of ZodError
  access_token: z.string().optional(),
})

export interface GetAccountInfoQueryResponse {
  numbers: AuthGetNumbers
  accountData: AccountBase[]
}

export default resolver.pipe(
  resolver.zod(GetAccountInfo),
  resolver.authorize(),
  async ({ access_token }): Promise<GetAccountInfoQueryResponse> => {
    if (access_token == null) throw new Error("Access token is required")
    const request: AuthGetRequest = {
      access_token: access_token,
    }
    const response = await client.authGet(request)
    const accountData = response.data.accounts
    const numbers = response.data.numbers
    return {
      numbers: numbers,
      accountData: accountData,
    }
  }
)
