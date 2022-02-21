import React, { useContext, useRef, useState } from "react";
import CardA2 from "../ui/CardA2";
import ButtonA from "../ui/ButtonA";
import mod from "./AdoptForm.module.css";
import AuthContext from "../../context/auth-context";
import ImageUpload from "../imageUpload/ImageUpload";
import MsgModal from "../ui/MsgModal";
import { useNavigate } from "react-router-dom";

function AdoptForm() {
   const [resedinta, setResedinta] = useState("House/Apart.");
   const [selectPetType, setSelectPetType] = useState("Dog");
   const [selectTimeType, setSelectTimeType] = useState("luni");
   const [selectVaccinated, setSelectVaccinated] = useState("No");
   const [selectPassport, setSelectPassport] = useState("No");
   const [petImage, setPetImage] = useState();
   const [errorStatus, setErrorStatus] = useState(false);
   const [petAdded, setPetAdded] = useState(false);
   const [errorMsg, setErrorMsg] = useState("");

   const petAgeRef = useRef();
   const petRaceRef = useRef();
   const petNameRef = useRef();
   const navigate = useNavigate();
   const authCtx = useContext(AuthContext);

   function imageUploadHandler(imgPick) {
      setPetImage(imgPick);
   }

   async function submitHandler(e) {
      e.preventDefault();
      let petAge;
      if (petAgeRef.current.value === "1") {
         if (selectTimeType === "ani") {
            petAge = "1 year";
         } else {
            petAge = "1 month";
         }
      } else {
         petAge = petAgeRef.current.value + " " + selectTimeType;
      }

      const petRace = petRaceRef.current.value;
      const petName = petNameRef.current.value;

      if (!petImage) {
         // console.log(avatar);
         setErrorMsg("Pet Avatar is misssing");
         setErrorStatus(true);
         setTimeout(()=> {setErrorStatus(false)},4000)
         return null;
      }
      setPetAdded(true);



      const formData = new FormData();
      formData.append("image", petImage);
      formData.append("petAge", petAge);
      formData.append("petName", petName);
      formData.append("petRace", petRace);
      formData.append("petType", selectPetType);
      formData.append("petHome", resedinta);
      formData.append("petVac", selectVaccinated);
      formData.append("petPass", selectPassport);
      formData.append("petOwnerName", authCtx.user.name);
      formData.append("petOwnerId", authCtx.user._id);
      formData.append(
         "petOwnerAddress",
         `${authCtx.user.oras}, ${authCtx.user.judet}`
      );
      formData.append("petOwnerHome", authCtx.user.resedinta);
      let responseData;
      try {
         const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pets/`, {
            method: "POST",
            body: formData,
         });
         responseData = await response.json();
         if (!response.ok) {
            throw new Error(responseData.message);
         } else {
            // console.log(responseData);
            navigate("/myactivity");
         }
      } catch (error) {
         // console.log(error.message);
         setErrorMsg(error.message);
         setErrorStatus(true);
         setTimeout(()=> {setErrorStatus(false)},4000)
      }
      let responseData1;
      try {
         const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/myusers/donatepet`,
            {
               method: "PATCH",
               headers: {
                  "Content-type": "application/json",
               },
               body: JSON.stringify({
                  userID: responseData.petOwnerId,
                  donatedPetId: responseData._id,
               }),
            }
         );
         responseData1 = await response.json();
         if (!response.ok) {
            throw new Error(responseData1.message);
         } else {
            // console.log(responseData1);
         }
      } catch (error) {
         // console.log(error.message);
      }
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
         {petAdded && (
            <MsgModal
               type="info"
               msg={`${petNameRef.current.value} added`}
               onOk={() => {
                  setPetAdded(false);
               }}
            />
         )}
         <form className={mod.form} onSubmit={submitHandler}>
            <div className={mod.element}>
               <label htmlFor="petType">Pet Type:</label>
               <select
                  className={mod.select}
                  value={selectPetType}
                  id="petType"
                  onChange={(e) => setSelectPetType(e.target.value)}>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
               </select>
            </div>
            <div className={mod.element}>
               <label htmlFor="petAge">Pet Age:</label>
               <div className={mod.elementA}>
                  <input
                     type="number"
                     id="petAge"
                     min={1}
                     ref={petAgeRef}
                     required
                  />
                  <select
                     className={mod.select}
                     value={selectTimeType}
                     id="timeType"
                     onChange={(e) => setSelectTimeType(e.target.value)}>
                     <option value="luni">months</option>
                     <option value="ani">years</option>
                  </select>
               </div>
            </div>
            <div className={mod.element}>
               <label htmlFor="petRace">Pet Breed:</label>
               <input type="text" id="petRace" ref={petRaceRef} required />
            </div>

            <div className={mod.element}>
               <label htmlFor="petName">Pet Name:</label>
               <input type="text" id="petName" ref={petNameRef} required />
            </div>
            <div className={mod.elementA}>
               <div className={mod.element}>
                  <label htmlFor="vacSelect">Is Vaccinated:</label>
                  <select
                     className={mod.select}
                     value={selectVaccinated}
                     id="vacSelect"
                     onChange={(e) => setSelectVaccinated(e.target.value)}>
                     <option value="Yes">Yes</option>
                     <option value="No">No</option>
                  </select>
               </div>
               <div className={mod.element}>
                  <label htmlFor="pasSelect">Has a Passport:</label>
                  <select
                     className={mod.select}
                     value={selectPassport}
                     id="pasSelect"
                     onChange={(e) => setSelectPassport(e.target.value)}>
                     <option value="Yes">Yes</option>
                     <option value="No">No</option>
                  </select>
               </div>
            </div>

            <div className={mod.element}>
               <fieldset>
                  <legend align="center">Preferred Home Type:</legend>
                  <div className={mod.radio}>
                     <div className={mod.radioEl}>
                        <label htmlFor="casa">House</label>
                        <input
                           type="radio"
                           id="casa"
                           value="House"
                           name="resedinta"
                           checked={resedinta === "House"}
                           onChange={(e) => setResedinta(e.target.value)}
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
                           onChange={(e) => setResedinta(e.target.value)}
                        />
                     </div>

                     <div className={mod.radioEl}>
                        <label htmlFor="ambele">Both</label>
                        <input
                           type="radio"
                           id="ambele"
                           value="House/Apart."
                           name="resedinta"
                           checked={resedinta === "House/Apart."}
                           onChange={(e) => setResedinta(e.target.value)}
                        />
                     </div>
                  </div>
               </fieldset>
            </div>
            <ImageUpload
               className={mod.avatarSelect}
               id="image"
               imgPick={imageUploadHandler}
               errorText="Please provide an image."
            />
            <div className={mod.element}>
               <ButtonA type={"submit"}>Add Pet</ButtonA>
            </div>
         </form>
      </CardA2>
   );
}

export default AdoptForm;
