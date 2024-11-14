import {Authenticator, AuthorizationError} from "remix-auth"
import {sessionStorage} from "./session.server"
import {FormStrategy} from "remix-auth-form"
import { prisma } from './prisma.server'
import bcrypt from "bcryptjs"

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const authenticator = new Authenticator<any>(sessionStorage)

const formStrategy = new FormStrategy(async ({form}) => {
  const name = form.get("name") as string
  const password = form.get("password") as string
  console.log(name,password,'in auth server')
  const user = await prisma.user.findFirst({
    where: { name },
  });
  

  if (!user) {
    console.log("you entered a wrong email")
    throw new AuthorizationError()
  }

  const passwordsMatch = await bcrypt.compare(
    password,
    user.password as string,
  )

  if (!passwordsMatch) {
    throw new AuthorizationError()
  }

  return user
})

authenticator.use(formStrategy, "form")

export {authenticator}