import React from "react";
import LoginForm from "../components/users/LoginForm";
import { Link } from "react-router-dom";
import mod from "./LoginSignupPages.module.css";
import CardA1 from "../components/ui/CardA1";
import ButtonA from "../components/ui/ButtonA";


function LoginPage() {


   return (
      <div className={mod.loginPage}>
         <CardA1>
            <h1>Login</h1>
            <LoginForm />
            <div className={mod.control}>
               <p>You don't have an account yet?</p>
               <Link to="/signup">
                  <ButtonA className={mod.switchBtn}>
                     Create new account
                  </ButtonA>
               </Link>
            </div>
         </CardA1>
      </div>
   );
}

export default LoginPage;
