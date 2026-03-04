import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import MyPortraitsTemplate from "@modules/account/components/my-portraits"

export const metadata: Metadata = {
  title: "My Portraits | LineVibes",
  description: "View all your AI-generated line portraits.",
}

export default async function MyPortraitsPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  return <MyPortraitsTemplate />
}
