import { Metadata } from "next"

import { listProducts } from "@lib/data/products"
import StylePortraitDirectoryTemplate from "@modules/style-portraits/templates"

type Props = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Portrait Styles | LineVibes",
    description:
      "Browse curated portrait style templates and turn one uploaded photo into a stylized portrait.",
  }
}

export default async function PortraitStylesPage(props: Props) {
  const params = await props.params
  const { response } = await listProducts({
    countryCode: params.countryCode,
    queryParams: {
      limit: 100,
    },
  })

  return (
    <StylePortraitDirectoryTemplate
      countryCode={params.countryCode}
      products={response.products}
    />
  )
}
