import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Sign In | LineVibes",
  description: "Sign in to your LineVibes account.",
}

export default function Login() {
  return <LoginTemplate />
}
