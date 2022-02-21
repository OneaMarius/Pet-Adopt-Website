import React, { useContext, useEffect, useState } from "react";
import CardB from "../ui/CardB";
import ButtonA from "../ui/ButtonA";
import mod from "./AdoptRequest.module.css";
import AuthContext from "../../context/auth-context";

function AdoptRequestReceived({
   petName,
   petAvatar,
   senderAvatar,
   senderHome,
   senderName,
   senderLocation,
   senderContact,
   adReqStatus,
   adoptReqId,
   adReqDate,
}) {
   const [reqAccepted, setReqAccepted] = useState(false);
   const [reqDenied, setReqDenied] = useState(false);
   const [showContactInfo, setShowContactInfo] = useState(false);
   const [closeWindow, setCloseWindow] = useState('');
   
   const authCtx = useContext(AuthContext);


   let reqAnswered = false;
   if (adReqStatus !== "Waiting") {
    reqAnswered = true;}
 

   function reqHandlerAccept() {
      setReqAccepted(true);
      // console.log("Request accepted");
      updateReqStatus("Accepted");
      setShowContactInfo(true);
      // send req to change adReqStatus
   }
   function reqHandlerDeny() {
      setReqDenied(true);
      // console.log("Request denied");
      updateReqStatus("Denied");
      // send req to change adReqStatus
   }

   useEffect(() => {
      
         if (adReqStatus === "Accepted") {
          setShowContactInfo(true);
         }
      
   }, [showContactInfo, adReqStatus]);

   async function updateReqStatus(reqNewStatus) {
      let responseData;
      try {
         const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/adoptrequest/update`,
            {
               method: "PATCH",
               headers: {
                  "Content-type": "application/json",
               },
               body: JSON.stringify({
                  reqID: adoptReqId,
                  reqStatus: reqNewStatus,
               }),
            }
         );
         responseData = await response.json();
         if (!response.ok) {
            throw new Error(responseData.message);
         } else {
            // console.log(responseData);

         }
      } catch (error) {
         // console.log(error.message);
      }
   }

   async function updateUserAdoptReqClosed() {
      let responseData;
      try {
         const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/myusers/closeadoptrequest`,
            {
               method: "PATCH",
               headers: {
                  "Content-type": "application/json",
               },
               body: JSON.stringify({
                  
                  userID: authCtx.user._id,
                  adoptReqId: adoptReqId,
               }),
            }
         );
         responseData = await response.json();
         if (!response.ok) {
            throw new Error(responseData.message);
         } else {
            // console.log(responseData);
            authCtx.updateUser(responseData.user);  
         }
      } catch (error) {
         // console.log(error.message);
      }
   }

   
   
   function closeHandler() {
      // console.log('clicked');
      setCloseWindow('none');
      updateUserAdoptReqClosed();
   }

   return (
      <CardB style={{display: closeWindow}} className={mod.cardB}>
         <div className={mod.time}>{adReqDate}</div>
         {reqAnswered && <div className={mod.closeIcon} onClick={closeHandler} ><i className="fa-regular fa-circle-xmark"></i></div>}
         <div className={mod.AdoptRequest}>
            <div className={mod.data}>
               <div className={mod.infoSection}>
                  <div className={mod.info}>
                     <div className={mod.infoLabel}>Pet:</div>
                     <div className={mod.infoData}>{petName}</div>
                  </div>
                  <div className={mod.info}>
                     <div className={mod.infoLabel}>From:</div>
                     <div className={mod.infoData}>{senderName}</div>
                  </div>
                  <div className={mod.info}>
                     <div className={mod.infoLabel}>Home:</div>
                     <div className={mod.infoData}>{senderHome}</div>
                  </div>
                  <div className={mod.info}>
                     <div className={mod.infoLabel}>Location:</div>
                     <div className={mod.infoData}>{senderLocation}</div>
                  </div>
                  {showContactInfo && (
                     <div>
                        <div className={mod.info}>
                           <div className={mod.infoLabel}>Email:</div>
                           <div className={mod.infoData}>
                              {senderContact.email}
                           </div>
                        </div>
                        <div className={mod.info}>
                           <div className={mod.infoLabel}>Phone:</div>
                           <div className={mod.infoData}>
                              {senderContact.tel}
                           </div>
                        </div>
                     </div>
                  )}
               </div>
               <div className={mod.avatarSection}>
                  <div
                     className={mod.avatar}
                     style={{ backgroundImage: `url(${petAvatar})` }}></div>
                  <div
                     className={mod.avatar}
                     style={{ backgroundImage: `url(${senderAvatar})` }}></div>
               </div>
            </div>
            {}
            {!reqAnswered && (
               <div>
                  {!reqDenied && !reqAccepted && (
                     <div className={mod.control}>
                        <ButtonA onClick={reqHandlerAccept} className={mod.ctrlBtn}>Accept</ButtonA>
                        <ButtonA onClick={reqHandlerDeny} className={mod.ctrlBtn}>Deny</ButtonA>
                     </div>
                  )}

                  {reqDenied && (
                     <div className={mod.status}>Status: Denied</div>
                  )}
                  {reqAccepted && (
                     <div className={mod.status}>Status: Accepted</div>
                  )}
               </div>
            )}

            {reqAnswered && (
               <div className={mod.status}>Status: {adReqStatus}</div>
            )}
         </div>
      </CardB>
   );
}

export default AdoptRequestReceived;
