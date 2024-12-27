"use client"

import {Button} from "../../components/ui/button"
import {Input} from "../../components/ui/input"
import {Label} from "../../components/ui/label"

import Link from 'next/link';
import {register} from "../../lib/action"
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";



 const RegisterForm=()=> {

  const [state, formAction] = useFormState(register, undefined);

  const router = useRouter();

  useEffect(() => {
    state?.success && router.push("/login");
  }, [state?.success, router]);
  return (
    <main className="bg-[#26313c] h-screen flex items-center justify-center p-10">
        <div className="bg-[#16202a] text-white w-96 h-full rounded-lg flex items-center justify-center flex-col">
          <div className="my-4">
            <h1 className="text-3xl font-semibold ">Register</h1>
          </div>
          <form action={formAction}>
          <Label htmlFor="username">Username*</Label>
            <Input
              className="mt-2 mb-4 bg-transparent rounded-full"
              type="text"
              id="username"
              placeholder="Username"
              name="username"
            />
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
              className="mt-2 mb-4 bg-transparent rounded-full"
              type="password"
              id="password"
              placeholder="password"
              name="password"

            />
            <Label htmlFor="password">Confirm Password*</Label>
            <Input
              className="mt-2 bg-transparent rounded-full"
              type="password"
              id="passwordRepeat"
              placeholder="password again"
              name="passwordRepeat"

            />
            <Button
              type="submit"
              className="w-full mt-6 mb-5 bg-indigo-600 rounded-full hover:bg-indigo-700"
            >
              Register
            </Button>
            <Link href="/login" className="ml-16 mt-20">
             Have an account? <b>Login</b>
            </Link>
          </form>
          <h7 className='mt-3 mr-7 '>{state?.error}</h7>
          </div>
    </main>
  );
}

export default RegisterForm;