import Button from "app/core/components/Button"
import createLinkToken from "app/plaid/mutations/createLinkToken"
import { AccountType, NumbersACH } from "plaid"
import Link from "app/plaid/components/link"
import exchangePublicToken from "app/plaid/mutations/exchangePublicToken"
import getAccountInfo, { GetAccountInfoQueryResponse } from "app/plaid/queries/getAccountInfo"
import SelectBankAccountModal from "app/modals/SelectBankAccoutModal"
import updateBankingInfo from "app/organizations/mutations/updateBankingInfo"
import getOrganization from "app/organizations/queries/getOrganization"
import { useSession, useMutation, useQuery, invoke, invalidateQuery } from "blitz"
import { useState } from "react"
import getOrganizations from "app/organizations/queries/getOrganizations"

const BankingInfo = () => {
  const noAccountLinkedText = "No account linked"
  const [token, setToken] = useState<string | null>(null)
  const [accountInfo, setAccountInfo] = useState<GetAccountInfoQueryResponse | null>(null)
  const [openSelectBankAccount, setOpenSelectBankAccount] = useState<boolean>(false)
  const [createLinkTokenMutation] = useMutation(createLinkToken)
  const [exchangePublicTokenMutation] = useMutation(exchangePublicToken)
  const [updateBankingInfoMutation] = useMutation(updateBankingInfo)
  const [selectedBankAccount, setSelectedBankAccount] = useState<NumbersACH | null>(null)
  const session = useSession()
  const [getOrganizationQuery] = useQuery(getOrganization, {
    id: session.organizationId,
  })

  async function open() {
    if (session.organizationId == null) throw new Error("organizationId is undefined on session")
    const link = await createLinkTokenMutation({
      organizationId: session.organizationId,
    })
    setToken(link.link_token)
  }

  async function bankAccountLinked(public_token, metadata) {
    const access_token = await exchangePublicTokenMutation({
      publicToken: public_token,
    })
    let accountInfo = await invoke(getAccountInfo, {
      access_token: access_token,
    })
    accountInfo.accountData = accountInfo.accountData.filter(
      (account) => account.type == AccountType.Depository
    )
    setAccountInfo(accountInfo)
  }

  async function bankAccountSelected(selectedAccount) {
    if (accountInfo == null) throw new Error("accountInfo is null")
    setOpenSelectBankAccount(false)
    const account = accountInfo.numbers.ach.filter(
      (account) => account.account_id === selectedAccount
    )[0]
    if (account == null) throw new Error("account is null")
    setSelectedBankAccount(account)
    if (session.organizationId == null) throw new Error("OrgId is null on session")
    updateBankingInfoMutation({
      routingNumber: account.routing,
      accountNumber: account.account,
      id: session.organizationId,
    })
    invalidateQuery(getOrganization)
    invalidateQuery(getOrganizations)
  }

  return (
    <>
      {openSelectBankAccount == true && (
        <SelectBankAccountModal
          onSuccess={(selectedAccount) => bankAccountSelected(selectedAccount)}
          onClose={() => setOpenSelectBankAccount(false)}
          accountInfo={accountInfo}
          open={true}
        />
      )}
      <h1 style={{ fontSize: 28 }}>Banking Info:</h1>
      <h2>
        Routing number:{" "}
        {selectedBankAccount == null
          ? getOrganizationQuery?.routingNumber || noAccountLinkedText
          : selectedBankAccount.routing}
      </h2>
      <h2>
        Account number:{" "}
        {selectedBankAccount == null
          ? getOrganizationQuery?.accountNumber || noAccountLinkedText
          : selectedBankAccount.account}
      </h2>

      <Button onClick={() => open()}>Update my banking info</Button>
      {token != null && (
        <Link
          onSuccess={(public_token, metadata) => bankAccountLinked(public_token, metadata)}
          onClose={() => setOpenSelectBankAccount(true)}
          token={token}
        />
      )}
    </>
  )
}

export default BankingInfo
