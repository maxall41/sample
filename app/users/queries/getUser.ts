import db from "db"

export default async function getCurrentUser({ userId }) {
  const user = await db.user.findFirst({
    where: { id: userId },
  })

  return user
}
