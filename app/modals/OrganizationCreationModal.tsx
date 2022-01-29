import React, { useState } from "react"
import { styled } from "@stitches/react"
import Button from "app/core/components/Button"
import { Form } from "../core/components/Form"
import { LabeledTextField } from "../core/components/LabeledTextField"
import { CreateOrganization } from "./validations"
import LogoDropzone from "app/core/components/LogoDropzone"
import { useMutation, useSession } from "blitz"
import setCurrentOrganization from "../organizations/mutations/setCurrentOrganization"
import createOrganization from "../organizations/mutations/createOrganization"
import {
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialog,
} from "app/core/components/AlertDialog"

// Your app...
const Flex = styled("div", { display: "flex" })

type OrganizationCreationModalProps = {
  open?: boolean
  onClose?: () => void
  onSuccess?: () => void
}

const OrganizationCreationModal = (props: OrganizationCreationModalProps) => {
  const [logo, setLogo] = useState({})
  const [setCurrentOrganizationMutation] = useMutation(setCurrentOrganization)
  const [createOrganizationMutation] = useMutation(createOrganization)
  const session = useSession()

  async function submit(values) {
    if (session.userId == null) return new Error("Session is null")
    const organization = await createOrganizationMutation({
      name: values.name,
      userId: session.userId,
    })
    if (!organization) return new Error("Organization is null")
    setCurrentOrganizationMutation({ organizationId: organization?.id })
    props.onSuccess?.()
  }

  return (
    <AlertDialog open={props.open}>
      <AlertDialogContent>
        <AlertDialogTitle>Create an organization</AlertDialogTitle>
        <AlertDialogDescription>
          Once you create an organization you can add products and set prices for your store.
        </AlertDialogDescription>
        <Form
          schema={CreateOrganization}
          initialValues={{ name: "" }}
          onSubmit={(values) => submit(values)}
        >
          <LogoDropzone onUpdate={(files) => setLogo(files[0])} />
          <LabeledTextField
            name="name"
            label="Name your organization:"
            placeholder="Jerry's Diner"
          />
          <Flex css={{ justifyContent: "flex-end" }}>
            <Button type="submit" variant="green">
              Create
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

export default OrganizationCreationModal
