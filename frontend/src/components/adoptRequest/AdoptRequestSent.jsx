import React, { useState } from "react";
import CardB from "../ui/CardB";
import mod from "./AdoptRequest.module.css";

function AdoptRequestSent({
   petName,
   petOwnerName,
   petOwnerContact,
   petOwnerAvatar,
   petAvatar,
   adReqStatus,
   adoptReqId,
   adReqDate,
}) {

   const [closeWindow, setCloseWindow] = useState('');
   let showContactInfo = false;
   if (adReqStatus === "Accepted") {
      showContactInfo = true;
   }

   async function updateReqDelete() {
      let responseData;
      try {
         const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/adoptrequest/delete`,
            {
               method: "DELETE",
               headers: {
                  "Content-type": "application/json",
               },
               body: JSON.stringify({
                  adoptReqId: adoptReqId,
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
   
   
   
   function closeHandler() {
      // console.log('clicked');
      setCloseWindow('none');
      updateReqDelete();

   }

   return (
      <CardB style={{display: closeWindow}} className={mod.cardB}>
         <div className={mod.time}>{adReqDate}</div>
         <div className={mod.closeIcon} onClick={closeHandler} >
            <i className="fa-regular fa-circle-xmark"></i>
         </div>
         <div className={mod.AdoptRequest}>
            <div className={mod.data}>
               <div className={mod.infoSection}>
                  <div className={mod.info}>
                     <div className={mod.infoLabel}>Pet:</div>
                     <div className={mod.infoData}>{petName}</div>
                  </div>
                  <div className={mod.info}>
                     <div className={mod.infoLabel}>To:</div>
                     <div className={mod.infoData}>{petOwnerName}</div>
                  </div>
                  {showContactInfo && (
                     <div>
                        <div className={mod.info}>
                           <div className={mod.infoLabel}>Email:</div>
                           <div className={mod.infoData}>
                              {petOwnerContact.email}
                           </div>
                        </div>
                        <div className={mod.info}>
                           <div className={mod.infoLabel}>Phone:</div>
                           <div className={mod.infoData}>
                              {petOwnerContact.tel}
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
                     style={{
                        backgroundImage: `url(${petOwnerAvatar})`,
                     }}></div>
               </div>
            </div>
            <div className={mod.status}>Status: {adReqStatus}</div>
         </div>
      </CardB>
   );
}

export default AdoptRequestSent;
