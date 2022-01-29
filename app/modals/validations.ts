import { z } from "zod"

export const CreateOrganization = z.object({
  name: z.string().max(24).min(3),
})

export const InviteEmployee = z.object({
  email: z.string().email(),
  name: z.string().max(24).min(3),
})
