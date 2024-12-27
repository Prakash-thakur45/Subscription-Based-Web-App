import LoginForm from "../../../components/loginForm/loginForm";
import { redirect } from "next/navigation";
import {auth} from "../../../lib/auth"
const LoginPage = async() => {

   const user =await auth();
   if(user)
   {
      return redirect('/');
   }
  return (
        <LoginForm />
  );
};

export default LoginPage;