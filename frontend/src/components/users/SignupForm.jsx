import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth-context";
import ImageUpload from "../imageUpload/ImageUpload";
import ButtonA from "../ui/ButtonA";
import CardA2 from "../ui/CardA2";
import MsgModal from "../ui/MsgModal";
import mod from "./LoginSignupForm.module.css";

function SignupForm() {
   const navigate = useNavigate();
   const emailRef = useRef();
   const passwordRef = useRef();
   const nameRef = useRef();
   const orasRef = useRef();
   const judetRef = useRef();
   const telRef = useRef();
   const [resedinta, setResedinta] = useState("House");
   const [avatar, setAvatar] = useState();
   const [errorStatus, setErrorStatus] = useState(false);
   const [errorMsg, setErrorMsg] = useState("");
   const authCtx = useContext(AuthContext);

   async function submitHandler(e) {
      e.preventDefault();

      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const name = nameRef.current.value;
      const oras = orasRef.current.value;
      const judet = judetRef.current.value;
      const tel = telRef.current.value;
      // console.log(avatar);
      if (!avatar) {
         // console.log(avatar);
         setErrorMsg("Avatar is misssing");
         setErrorStatus(true);
         setTimeout(() => {
            setErrorStatus(false);
         }, 4000);
         return null;
      }

      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("name", name);
      formData.append("oras", oras);
      formData.append("judet", judet);
      formData.append("resedinta", resedinta);
      formData.append("tel", tel);
      formData.append("image", avatar);

      let responseData;
      try {
         const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/myusers/signup`,
            {
               method: "POST",
               body: formData,
            }
         );
         responseData = await response.json();
         if (!response.ok) {
            throw new Error(responseData.message);
         } else {
            // console.log(responseData);
            authCtx.login(responseData.user);
            authCtx.pageHandler("myactivity");
            navigate("/myactivity");
         }
      } catch (error) {
         // console.log(error.message);
         setErrorMsg(error.message);
         setErrorStatus(true);
         setTimeout(() => {
            setErrorStatus(false);
         }, 4000);
      }
   }

   function imageUploadHandler(imgPick) {
      setAvatar(imgPick);
   }
   function changeCasaHandle() {
      setResedinta("House");
   }
   function changeBlocHandle() {
      setResedinta("Apartment");
   }

   return (
      <CardA2>
         {errorStatus && (
            <MsgModal
               type="error"
               msg={errorMsg}
               onOk={() => {
                  setErrorStatus(false);
               }}
            />
         )}
         <form className={mod.form} onSubmit={submitHandler}>
            <div className={mod.element}>
               <label htmlFor="email">Email:</label>
               <input type="text" id="email" ref={emailRef} required />
            </div>
            <div className={mod.element}>
               <label htmlFor="password">Password:</label>
               <input
                  type="password"
                  id="password"
                  ref={passwordRef}
                  required
               />
            </div>
            <div className={mod.element}>
               <label htmlFor="name">Name:</label>
               <input type="text" id="name" ref={nameRef} required />
            </div>
            <div className={mod.element}>
               <label htmlFor="tel">Mobile:</label>
               <input
                  type="text"
                  pattern="\d*"
                  id="tel"
                  ref={telRef}
                  required
                  minLength={10}
                  maxLength={10}
               />
            </div>

            <div className={mod.element}>
               <label htmlFor="oras">Town:</label>
               <input type="text" id="oras" ref={orasRef} required />
            </div>
            <div className={mod.element}>
               <label htmlFor="judet">County:</label>
               <input type="text" id="judet" ref={judetRef} required />
            </div>
            <div className={mod.element}>
               <fieldset>
                  <legend align="center">Home Type:</legend>
                  <div className={mod.radio}>
                     <div className={mod.radioEl}>
                        <label htmlFor="casa">House</label>
                        <input
                           type="radio"
                           id="casa"
                           value="House"
                           name="resedinta"
                           checked={resedinta === "House"}
                           onChange={changeCasaHandle}
                        />
                     </div>

                     <div className={mod.radioEl}>
                        <label htmlFor="bloc">Apartment</label>
                        <input
                           type="radio"
                           id="bloc"
                           value="Apartment"
                           name="resedinta"
                           checked={resedinta === "Apartment"}
                           onChange={changeBlocHandle}
                        />
                     </div>
                  </div>
               </fieldset>
            </div>
            <ImageUpload
               id="image"
               imgPick={imageUploadHandler}
               errorText="Please provide an image."
            />
            <div className={mod.element}>
               <ButtonA type="submit">Create Account</ButtonA>
            </div>
         </form>
      </CardA2>
   );
}

export default SignupForm;
