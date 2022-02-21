import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth-context";
import ButtonA from "../ui/ButtonA";
import CardA2 from "../ui/CardA2";
import MsgModal from "../ui/MsgModal";
import mod from "./LoginSignupForm.module.css";

function LoginForm() {
   const emailRef = useRef();
   const passwordRef = useRef();
   const navigate = useNavigate();
   const authCtx = useContext(AuthContext);
   const [errorStatus, setErrorStatus] = useState(false);
   const [errorMsg, setErrorMsg] = useState('');

   async function submitHandler(e) {
      e.preventDefault();
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const selectedUser = {
         email,
         password
      };
      // console.log(selectedUser);
   
      try {
        const response = await fetch(
           `${process.env.REACT_APP_BACKEND_URL}/api/myusers/login`,
           {
              method: "POST",
              headers: {
                 "Content-type": "application/json",
              },
              body: JSON.stringify(selectedUser),
           }
        );
        const responseData = await response.json();
        if (!response.ok) {
           throw new Error(responseData.message);
        } else {
            // console.log(responseData);
            if (responseData.login === true) {
                
                authCtx.login(responseData.user);
                authCtx.pageHandler("adopt");
                navigate('/adopt');
            };
        }
     } catch (error) {
      //   console.log(error.message);
        setErrorMsg(error.message)
        setErrorStatus(true)
        setTimeout(() => {
         setErrorStatus(false);
      }, 4000);
     }
   }

   return (
      <CardA2> 
         {errorStatus && <MsgModal type='error' msg={errorMsg} onOk={()=>{setErrorStatus(false)}}/>}  
         <form  className={mod.form}  onSubmit={submitHandler}>
            <div className={mod.element}>
               <label htmlFor="email">Email:</label>
               <input type="text" id="email" ref={emailRef} required placeholder="email"/>
            </div>
            <div className={mod.element}>
               <label htmlFor="password">Password:</label>
               <input
                  type="password"
                  id="password"
                  ref={passwordRef}
                  required
                  placeholder="password"
               />
            </div>
            <div className={mod.element}>
               <ButtonA type='submit'>Login</ButtonA>
            </div>
         </form>
      </CardA2>
   );
}

export default LoginForm;
