import React from "react";
import SignupForm from "../components/users/SignupForm";
import { Link } from "react-router-dom";
import mod from "./LoginSignupPages.module.css";
import CardA1 from "../components/ui/CardA1";
import ButtonA from "../components/ui/ButtonA";

function SignupPage() {
   return (
      <div className={mod.signupPage}>
         <CardA1>
            <h1>Crate New Account</h1>
            <SignupForm />
            <div className={mod.control}>
               <p>You already have an account?</p>
               <Link to="/login">
                  <ButtonA className={mod.switchBtn}>Login</ButtonA>
               </Link>
            </div>
         </CardA1>
      </div>
   );
}

export default SignupPage;
