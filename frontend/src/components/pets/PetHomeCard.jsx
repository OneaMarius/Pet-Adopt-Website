import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth-context";
import ButtonA from "../ui/ButtonA";
import CardC from "../ui/CardC";
import mod from "./PetHomeCard.module.css";

function PetHomeCard(props) {
   const authCtx = useContext(AuthContext);
   const isLoggedIn = authCtx.isLoggedIn;
   const [adoptedStatus, setAdoptedStatus] = useState();
   const [FC, setFC] = useState(props.followersCount);
   const navigate = useNavigate();

   const wasAdopted = props.adoptedStatus;
   const followers = props.followers;

   let initialFollow;
   if (followers.find((user) => user === authCtx.user._id)) {
      initialFollow = true;
   } else {
      initialFollow = false;
   }
   const [followed, setFollowed] = useState(initialFollow);
   const [click, setClick] = useState(false);

   useEffect(() => {
      if (wasAdopted) {
         setAdoptedStatus("Adopted");
      } else {
         setAdoptedStatus("Available");
      }
   }, [wasAdopted]);

   function followHandler() {
      setClick(false);
      setTimeout(() => {
         setClick(true);
      }, 100);
      updatePetFollowers();
      updateUserFollow();
   }

   let petData;
   async function updatePetFollowers() {
      try {
         const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/pets/followers`,
            {
               method: "PATCH",
               headers: {
                  "Content-type": "application/json",
               },
               body: JSON.stringify({
                  petID: props.petId,
                  userID: authCtx.user._id,
               }),
            }
         );
         petData = await response.json();
         if (!response.ok) {
            throw new Error(petData.message);
         } else {
            // console.log(petData);
            // console.log("check1");
         }
      } catch (error) {
         // console.log(error.message);
      }
      // console.log(props.page);
      if (!props.page) {
         setTimeout(() => {
            if (!followed) {
               setFC((prev) => +prev + 1);
            } else {
               setFC((prev) => +prev - 1);
            }
         }, 500);
      }
   }

   let userData;
   async function updateUserFollow() {
      try {
         const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/myusers/follow`,
            {
               method: "PATCH",
               headers: {
                  "Content-type": "application/json",
               },
               body: JSON.stringify({
                  petID: props.petId,
                  userID: authCtx.user._id,
               }),
            }
         );
         userData = await response.json();
         if (!response.ok) {
            throw new Error(userData.message);
         } else {
            // console.log(userData);
            setFollowed(userData.checkFollow);
            authCtx.updateUser(userData.user);
         }
      } catch (error) {
         // console.log(error.message);
      }
   }

   return (
      <CardC className={props.className}>
         <div className={mod.top}>
            <div className={mod.date}>{props.date}</div>
            <div className={mod.name}>{props.petName}</div>
         </div>
         <div className={mod.main}>
            <div
               className={mod.petImg}
               style={{ backgroundImage: `url(${props.petImg})` }}></div>
            <div className={mod.petStatus}>
               <label>{adoptedStatus}</label>
               <div
                  className={mod.statusImg}
                  style={{
                     backgroundColor: wasAdopted
                        ? "rgb(95, 192, 252)"
                        : "green",
                  }}></div>
            </div>
            <div className={mod.petFollowers}>
               <label>Followers</label>
               <div
                  className={
                     click ? mod.followersCountDinamic : mod.followersCount
                  }>
                  {FC}
               </div>
            </div>
         </div>

         {isLoggedIn && (
            <div className={mod.bottom}>
               <ButtonA
                  className={mod.btn1}
                  onClick={() => {
                     navigate(`/adopt/${props.petId}`);
                  }}>
                  View
               </ButtonA>

               <ButtonA
                  className={mod.btn2}
                  style={{ display: `${props.display}` }}
                  onClick={followHandler}>
                  {followed ? "Unfollow" : "Follow"}
               </ButtonA>
            </div>
         )}
         {!isLoggedIn && (
            <div className={mod.bottom}>
              <ButtonA
                  className={mod.btn1}
                  onClick={() => {
                     navigate(`/login`);
                  }}>
                  View
               </ButtonA>

               <ButtonA
                  className={mod.btn2}
                  onClick={() => {
                     navigate(`/login`);
                  }}>Follow
               </ButtonA>
            </div>
         )}
      </CardC>
   );
}

export default PetHomeCard;
