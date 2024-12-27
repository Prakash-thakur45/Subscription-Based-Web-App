"use client"
import { IoLogoGithub } from "react-icons/io5";

import { Button } from "../ui/button";
import {Input} from "../ui/input"
import {Label} from "../ui/label"
import { handleGithubLogin } from "../../lib/action";
import { login } from "../../lib/action";
import { useFormState } from "react-dom";
import Link from 'next/link';




 const LoginForm=()=> {

  const [state, formAction] = useFormState(login, undefined);

  return (

    <main className="bg-[#26313c] h-screen flex items-center justify-center p-10">
        <div className="bg-[#16202a] text-white w-96 h-full rounded-lg flex items-center justify-center flex-col">
          <div className="my-4">
            <h1 className="text-3xl font-semibold ">Login</h1>
          </div>
          <form action={handleGithubLogin} className=''>
          <Button
              className="flex items-center w-full gap-4 px-12 mb-4 bg-transparent rounded-full"
              variant="outline"
            >
              {' '}
              <IoLogoGithub size="25" />
              Sign In With Github
            </Button>
          </form>
          <form action={formAction}>
            <Label htmlFor="email">Email*</Label>
            <Input
              className="mt-2 mb-4 bg-transparent rounded-full"
              type="email"
              id="email"
              placeholder="Email"
              name="email"
            />
            <Label htmlFor="password">Password*</Label>
            <Input
              className="mt-2 bg-transparent rounded-full"
              type="password"
              id="password"
              placeholder="password"
              name="password"

            />

            <Button
              type="submit"
              className="w-full mt-6 mb-6 bg-indigo-600 rounded-full hover:bg-indigo-700"
            >
              Login
            </Button>
            <Link href="/register" className='ml-12 mb-16'>
             {"Don't have an account?"} <b>Register</b>
            </Link>
          </form>
          <h3 className='mt-5'>{state?.error}</h3>
          {/* <p className="mt-14 text-xs text-slate-200">
            @2024 All rights reserved
          </p> */}
        </div>
    </main>
  );
}

export default LoginForm;