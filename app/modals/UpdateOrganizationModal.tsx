import React, { useState } from "react"
import { styled } from "@stitches/react"
import Button from "app/core/components/Button"
import { Form } from "../core/components/Form"
import { LabeledTextField } from "../core/components/LabeledTextField"
import { CreateOrganization } from "./validations"
import LogoDropzone from "app/core/components/LogoDropzone"
import { useMutation, useQuery, useSession } from "blitz"

import {
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialog,
} from "app/core/components/AlertDialog"
import getOrganization from "app/organizations/queries/getOrganization"
import updateOrganization from "app/organizations/mutations/updateOrganization"

// Your app...
const Flex = styled("div", { display: "flex" })

type OrganizationUpdateModalProps = {
  open?: boolean
  onClose?: () => void
  onSuccess?: () => void
}

const OrganizationUpdateModal = (props: OrganizationUpdateModalProps) => {
  const [logo, setLogo] = useState({})
  const [updateOrganizationMutation] = useMutation(updateOrganization)
  const session = useSession()
  const [organization] = useQuery(getOrganization, {
    id: session.organizationId,
  })

  async function submit(values) {
    if (session.organizationId == null) return new Error("Session orgId is null")
    await updateOrganizationMutation({
      name: values.name,
      id: session.organizationId,
    })
    props.onSuccess?.()
  }

  return (
    <AlertDialog open={props.open}>
      <AlertDialogContent>
        <AlertDialogTitle>Update {organization?.name}</AlertDialogTitle>
        <AlertDialogDescription>
          Update your organization with a new name or logo.
        </AlertDialogDescription>
        <Form
          schema={CreateOrganization}
          initialValues={{ name: organization?.name }}
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
              Update
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

export default OrganizationUpdateModal
