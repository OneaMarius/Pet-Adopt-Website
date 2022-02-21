import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/layout/Loading";
import PetPostCard from "../components/pets/PetPostCard";
import ButtonA from "../components/ui/ButtonA";
import CardC from "../components/ui/CardC";
import MsgModal from "../components/ui/MsgModal";
import AuthContext from "../context/auth-context";
import mod from "./PetInfoPage.module.css";

function PetInfoPage(props) {
   const { petId } = useParams();
   const authCtx = useContext(AuthContext);
   const msgRef = useRef();
   const [selectedPet, setSelectedPet] = useState();
   const [loading, setLoading] = useState(true);
   const [petFound, setPetFound] = useState(false);
   const [isPetOwner, setIsPetOwner] = useState(false);
   const [wasAdopted, setWasAdopted] = useState(false);
   const [emptyPost, setEmptyPost] = useState(false);
   const [activeSwitch, setActiveSwitch] = useState(false);
   const [virtualDB, setVirtualDB] = useState([]);

   function adoptHandler() {
      setWasAdopted(!wasAdopted);
      setActiveSwitch(true);
   }

   function saveAdoptUpdate() {
      updatePet();
      setSaveChanges(true);
      setTimeout(() => {
         setSaveChanges(false);
      }, 4000);
      setActiveSwitch(false);
   }

   async function adoptRequestHandler() {

      // console.log("Adoption requested", requestData);
      let responseData;
      try {
         const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/adoptrequest/new`,
            {
               method: "POST",
               headers: {
                  "Content-type": "application/json",
               },
               body: JSON.stringify({
                  sender: authCtx.user,
                  pet: selectedPet,
               }),
            }
         );
         responseData = await response.json();
         if (!response.ok) {
            throw new Error(responseData.message);
         } else {
            // console.log(responseData.adReqSender);
            authCtx.updateUser(responseData.adReqSender);
         }
      } catch (error) {
         // console.log(error.message);
      }
   }

   async function updatePet() {
      let responseData;
      try {
         const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/pets/${petId}`,
            {
               method: "PATCH",
               headers: {
                  "Content-type": "application/json",
               },
               body: JSON.stringify({
                  petWasAdopted: wasAdopted,
                  chatDB: [...virtualDB, postedMessage],
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

   useEffect(() => {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pets/${petId}`)
         .then((response) => response.json())
         .then((data) => {
            setLoading(false);
            if (!data.message) {
               // console.log(data);
               // console.log(authCtx.user);
               setSelectedPet(data);
               setPetFound(true);
               setWasAdopted(data.petWasAdopted);
               setVirtualDB(data.chatDB);
               if (authCtx.user._id === data.petOwnerId) {
                  setIsPetOwner(true);
               } else {
                  setIsPetOwner(false);
               }
            } else {
               // console.log(data.message);
               setPetFound(false);
            }
         });
   }, [petId, authCtx.user]);

   const [userSentReq, setUserSentReq] = useState(false);

   useEffect(() => {
      if (authCtx.user.adoptReqSent.find((id) => id === petId)) {
         setUserSentReq(true);
         // console.log("id found");
      }
   }, [authCtx.user, petId]);

   let postedMessage = "";
   const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
   ];
   function formSubmitHandler(e) {
      e.preventDefault();
      const today = new Date();
      const postDate = `${today.getDate()}-${months[today.getMonth()]}-${today.getFullYear()} at ${today.getHours()}:${today.getMinutes()<10?`0${today.getMinutes()}`:today.getMinutes()}`;
        
         // console.log(postDate);
      postedMessage = {
         isPetOwner: isPetOwner,
         userMessage: msgRef.current.value,
         userName: authCtx.user.name,
         userAvatar: authCtx.user.avatar,
         postDate: postDate,
      };
      if (msgRef.current.value === "") {
         setEmptyPost(true);
         setTimeout(() => {
            setEmptyPost(false);
         }, 4000);
      } else {
         setVirtualDB((prev) => [postedMessage, ...prev]);
         msgRef.current.value = "";
         updatePet();
      }
   }

   const [saveChanges, setSaveChanges] = useState(false);
   function msgHandler1() {
      // console.log("click ok");
      setEmptyPost(false);
      setSaveChanges(false);
   }
   function msgHandler2() {
      // console.log("click cancel");
   }



   return (
      <div className={mod.PetInfoPage}>
         {emptyPost && (
            <MsgModal
               type="error"
               msg="Post message is empty"
               onOk={msgHandler1}
               onCancel={msgHandler2}></MsgModal>
         )}
         {saveChanges && (
            <MsgModal 
               // className={mod.modalClass}
               type="info"
               msg="Changes saved"
               onOk={msgHandler1}
               onCancel={msgHandler2}></MsgModal>
         )}
         {!loading && petFound && (
            <CardC className={mod.card}>
               <section className={mod.sectionLeft}>
                  <div className={mod.top}>
                     <div
                        className={mod.petImg}
                        style={{
                           backgroundImage: `url(${selectedPet.petImage})`,
                        }}></div>
                     <div className={mod.petTopInfo}>
                        <div className={mod.info1}>
                           <label>Type:</label>
                           <div>{selectedPet.petType}</div>
                        </div>
                        <div className={mod.info1}>
                           <label>Breed:</label>
                           <div>{selectedPet.petRace}</div>
                        </div>
                        <div className={mod.info1}>
                           <label>Age:</label>
                           <div>{selectedPet.petAge}</div>
                        </div>
                        <div className={mod.info1}>
                           <label>Vaccinated:</label>
                           <div>{selectedPet.petVac}</div>
                        </div>
                        <div className={mod.info1}>
                           <label>Passport:</label>
                           <div>{selectedPet.petPass}</div>
                        </div>
                     </div>
                  </div>
                  <div className={mod.mid}>
                     <div className={mod.petName}>{selectedPet.petName}</div>
                     {!isPetOwner && (
                        <div className={mod.adoptReq}>
                           {!userSentReq && (
                              <ButtonA
                                 className={mod.adoptReqBtn}
                                 onClick={adoptRequestHandler}>
                                 Adopt
                              </ButtonA>
                           )}
                           {userSentReq && <div>Request Sent</div>}
                        </div>
                     )}
                     {isPetOwner && (
                        <div className={mod.adoptReq}>Pet Owner</div>
                     )}
                  </div>
                  <div className={mod.bottom}>
                     <div className={mod.petBottomInfo}>
                        <div className={mod.info2}>
                           <label>Actual Owner:</label>
                           <div>{selectedPet.petOwnerName}</div>
                        </div>
                        <div className={mod.info2}>
                           <label>Actual Loacation:</label>
                           <div>{selectedPet.petOwnerAddress}</div>
                        </div>
                        <div className={mod.info2}>
                           <label>Actual Home Type:</label>
                           <div>{selectedPet.petOwnerHome}</div>
                        </div>
                        <div className={mod.info2}>
                           <label>Wanted Home Type:</label>
                           <div>{selectedPet.petHome}</div>
                        </div>
                        <div className={wasAdopted?mod.info3:mod.info4}>
                           {wasAdopted && <label>Adopted</label>}
                           {!wasAdopted && <label>Looking for new home</label>}
                           {isPetOwner && (
                              <div className={mod.updateControl}>
                                 <ButtonA onClick={adoptHandler} className={mod.bottomBtn1}>
                                    Switch
                                 </ButtonA>
                                 {activeSwitch && (
                                    <ButtonA onClick={saveAdoptUpdate} className={mod.bottomBtn2}>
                                       Save Change
                                    </ButtonA>
                                 )}
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </section>
               <section className={mod.sectionRight}>
                  <div className={mod.chatBox}>
                     <div className={mod.chatViewBox}>
                        {virtualDB.map((post) => (
                           <PetPostCard
                              key={Math.random()}
                              isPetOwner={post.isPetOwner}
                              userAvatar={post.userAvatar}
                              userName={post.userName}
                              userMessage={post.userMessage}
                              postDate={post.postDate}
                              
                           />
                        ))}
                     </div>
                     <div className={mod.chatTypeBox}>
                        <form onSubmit={formSubmitHandler}>
                           <textarea
                              className={mod.chatNewMsg}
                              placeholder="Write your message"
                              ref={msgRef}></textarea>
                           <ButtonA className={mod.chatSendMsg} type="submit">
                              Post
                           </ButtonA>
                        </form>
                     </div>
                  </div>
               </section>
            </CardC>
         )}
         {!loading && !petFound && <CardC >No pet found</CardC>}
         {loading && <Loading/>}
      </div>
   );
}

export default PetInfoPage;
