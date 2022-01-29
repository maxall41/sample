// This is the jest 'setupFilesAfterEnv' setup file
// It's a good place to set globals, add global before/after hooks, etc

import db from "db"

export {} // so TS doesn't complain

// Resets our database after every test
beforeEach(async () => {
  await db.$reset()
})
