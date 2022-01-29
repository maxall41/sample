import React from "react"
import { styled } from "@stitches/react"
import Button from "app/core/components/Button"
import { Form } from "../core/components/Form"
import { LabeledTextField } from "../core/components/LabeledTextField"
import { InviteEmployee } from "./validations"
import { useMutation, useSession } from "blitz"
import {
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialog,
} from "app/core/components/AlertDialog"
import invite from "app/employees/mutations/invite"

// Your app...
const Flex = styled("div", { display: "flex" })

type EmployeeAdditionModalProps = {
  open?: boolean
  onClose?: () => void
  onSuccess?: () => void
}

const EmployeeAdditionModal = (props: EmployeeAdditionModalProps) => {
  const session = useSession()
  const [inviteMutation] = useMutation(invite)

  async function submit(values) {
    if (session.organizationId == null) return new Error("Session is null")

    await inviteMutation({
      email: values.email,
      name: values.name,
      organizationId: session.organizationId,
    })

    props.onSuccess?.()
  }

  return (
    <AlertDialog open={props.open}>
      <AlertDialogContent>
        <AlertDialogTitle>Invite Employee</AlertDialogTitle>
        <AlertDialogDescription>Invite an employee to the organization</AlertDialogDescription>
        <Form
          schema={InviteEmployee}
          initialValues={{ email: "", name: "" }}
          onSubmit={(values) => submit(values)}
        >
          <LabeledTextField name="email" label="Email" placeholder="mail@yourcompany.com" />
          <LabeledTextField name="name" label="Name" placeholder="Jerry Kasparov" />
          <Flex css={{ justifyContent: "flex-end" }}>
            <Button type="submit" variant="green">
              Invite
            </Button>
            <AlertDialogCancel asChild>
              <Button onClick={() => props.onClose?.()} variant="mauve" css={{ marginLeft: 25 }}>
                Cancel
              </Button>
            </AlertDialogCancel>
          </Flex>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default EmployeeAdditionModal
