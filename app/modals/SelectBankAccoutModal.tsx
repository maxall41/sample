import React, { useState } from "react"
import { styled } from "@stitches/react"
import Button from "app/core/components/Button"
import { useSession } from "blitz"
import {
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialog,
} from "app/core/components/AlertDialog"
import {
  RadioGroupIndicator,
  RadioGroup,
  RadioGroupRadio,
  RadioGroupLabel,
} from "app/core/components/RadioGroup"
import { AccountBase, AuthGetNumbers } from "plaid"

// Your app...
const Flex = styled("div", { display: "flex" })

interface GetAccountInfoQueryResponse {
  numbers: AuthGetNumbers
  accountData: AccountBase[]
}

type SelectBankAccountModalProps = {
  open?: boolean
  accountInfo: GetAccountInfoQueryResponse | null
  onClose?: () => void
  onSuccess?: (selectedAccount) => void
}

const SelectBankAccountModal = (props: SelectBankAccountModalProps) => {
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const session = useSession()
  if (props.accountInfo != null) {
    const labels = props.accountInfo.accountData.map((account) => {
      return (
        <Flex key={account.account_id} css={{ margin: "10px 0", alignItems: "center" }}>
          <RadioGroupRadio
            value={account.account_id}
            onClick={() => setSelectedAccount(account.account_id)}
          >
            <RadioGroupIndicator />
          </RadioGroupRadio>
          <RadioGroupLabel>{`${account.name} - $${account.balances.current} USD`}</RadioGroupLabel>
        </Flex>
      )
    })

    return (
      <AlertDialog open={props.open}>
        <AlertDialogContent>
          <AlertDialogTitle>Select a bank account</AlertDialogTitle>
          <AlertDialogDescription>
            Select which bank account you want to use to deposit your earnings into.
          </AlertDialogDescription>
          <RadioGroup defaultValue="default" aria-label="Select a bank account">
            {labels}
          </RadioGroup>
          <Flex css={{ justifyContent: "flex-end" }}>
            <Button type="submit" onClick={() => props.onSuccess?.(selectedAccount)}>
              Select
            </Button>
            <AlertDialogCancel asChild>
              <Button variant="mauve" onClick={() => props.onClose?.()} css={{ marginLeft: 25 }}>
                Cancel
              </Button>
            </AlertDialogCancel>
          </Flex>
        </AlertDialogContent>
      </AlertDialog>
    )
  } else {
    return <span>No bank data</span>
  }
}

export default SelectBankAccountModal
