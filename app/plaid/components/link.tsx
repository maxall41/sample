import { useCallback, useEffect } from "react"
import { usePlaidLink } from "react-plaid-link"

interface Props {
  token: string
  onSuccess?: (public_token, metadata) => void
  onClose?: (data) => void
}

const Link: React.FC<Props> = (props: Props) => {
  const onSuccess = useCallback(
    (public_token, metadata) => {
      props.onSuccess?.(public_token, metadata)
    },
    [props]
  )

  const config: Parameters<typeof usePlaidLink>[0] = {
    token: props.token,
    onSuccess: onSuccess,
    onEvent: (event, data) => {
      if (event === "HANDOFF" || event === "EXIT") {
        props.onClose?.(data)
      }
    },
  }

  const { open, ready, error } = usePlaidLink(config)

  useEffect(() => {
    if (!ready) {
      return
    }
    open()
  }, [ready, open])

  return <></>
}

Link.displayName = "Link"

export default Link
