import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
  preset: "blitz",
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 90,
      lines: 80,
      statements: -10,
    },
  },
}

export default config
