import React, { useContext, useEffect, useState } from "react";
import AdoptRequestReceived from "../components/adoptRequest/AdoptRequestReceived";
import AdoptRequestSent from "../components/adoptRequest/AdoptRequestSent";
import Loading from "../components/layout/Loading";
import PetHomeCard from "../components/pets/PetHomeCard";
import ButtonA from "../components/ui/ButtonA";
import AuthContext from "../context/auth-context";
import mod from "./MyActivityPage.module.css";

function MyActivityPage() {
   const authCtx = useContext(AuthContext);
   const activeUser = authCtx.user;

   const [PetDB, setPetDB] = useState();
   const [loading, setLoading] = useState(true);
   const [activePage, setActivePage] = useState(true);

   useEffect(() => {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pets`)
         .then((response) => response.json())
         .catch((err) => err.message)
         .then((data) => {
            // console.log(data);
            setPetDB(data.PetList);
            // setUserDB(data.UserList);
            setLoading(false);
         });
   }, []);

   const [AdoptReqDB, setAdoptReqDB] = useState([]);
   const [loading1, setLoading1] = useState(true);

   useEffect(() => {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/adoptrequest`)
         .then((response) => response.json())
         .catch((err) => err.message)
         .then((data) => {
            // console.log(data);
            if (data.adoptReqList) {
               setAdoptReqDB(data.adoptReqList.reverse());
            }
            setLoading1(false);
         });
   }, [activePage]);

   return (
      <div className={mod.MyActivityPage}>
         <div className={mod.activityHandler}>
            <div className={mod.handlerSection}><ButtonA
               className={mod.topBtn}
               style={{
                  backgroundColor: activePage ? "black" : "white",
                  color: activePage ? "white" : "black",
               }}
               onClick={() => {
                  setActivePage(true);
               }}>
               My Pets
            </ButtonA></div>
            <div className={mod.handlerSection}><ButtonA
               className={mod.topBtn}
               style={{
                  backgroundColor: !activePage ? "black" : "white",
                  color: !activePage ? "white" : "black",
               }}
               onClick={() => {
                  setActivePage(false);
               }}>
               My Adopt Requests
            </ButtonA></div>
            
            
         </div>
         {activePage && (
            <div className={mod.activityPanel}>
               <div className={mod.panelLeft}>
                  <div className={mod.panelName}>Donated Pet</div>
                  <div className={mod.panelOption}>
                     {!loading &&
                        PetDB.map((pet) => {
                           if (pet.petOwnerId !== activeUser._id) {
                              return null;
                           }
                           return (
                              <PetHomeCard
                                 display="none"
                                 className={mod.petCard}
                                 key={pet.id}
                                 followersCount={pet.followers.length}
                                 followers={pet.followers}
                                 adoptedStatus={pet.petWasAdopted}
                                 petId={pet.id}
                                 date={pet.petAddedDate}
                                 petName={pet.petName}
                                 petImg={pet.petImage}
                              />
                           );
                        })}
                     {loading && <Loading />}
                  </div>
               </div>
               <div className={mod.panelRight}>
                  <div className={mod.panelName}>Followed Pet</div>
                  <div className={mod.panelOption}>
                     {!loading &&
                        PetDB.map((pet) => {
                           if (!activeUser.follow.includes(pet.id)) {
                              return null;
                           }
                           return (
                              <PetHomeCard
                                 className={mod.petCard}
                                 key={pet.id}
                                 followersCount={pet.followers.length}
                                 followers={pet.followers}
                                 adoptedStatus={pet.petWasAdopted}
                                 petId={pet.id}
                                 date={pet.petAddedDate}
                                 petName={pet.petName}
                                 petImg={pet.petImage}
                                 page={true}
                              />
                           );
                        })}
                     {loading && <Loading />}
                  </div>
               </div>
            </div>
         )}
         {!activePage && (
            <div className={mod.activityPanel}>
               <div className={mod.panelLeft}>
                  <div className={mod.panelName}>Adopt Request Sent</div>
                  <div className={mod.panelOption}>
                     {!loading1 &&
                        AdoptReqDB.map((adoptReq) => {
                           if (adoptReq.adReqSender._id !== activeUser._id) {
                              return null;
                           }
                           return (
                              <AdoptRequestSent
                                 petName={adoptReq.petName}
                                 petOwnerName={adoptReq.petOwnerName}
                                 petOwnerContact={adoptReq.petOwnerContact}
                                 petOwnerAvatar={adoptReq.petOwnerAvatar}
                                 petAvatar={adoptReq.petAvatar}
                                 adReqStatus={adoptReq.adReqStatus}
                                 adoptReqId={adoptReq.id}
                                 adReqDate={adoptReq.adReqDate}
                                 key={adoptReq.id}
                              />
                           );
                        })}
                     {loading1 && <Loading />}
                  </div>
               </div>
               <div className={mod.panelRight}>
                  <div className={mod.panelName}>Adopt Request Received</div>
                  <div className={mod.panelOption}>
                     {!loading1 &&
                        AdoptReqDB.map((adoptReq) => {
                           if (
                              adoptReq.adReqPet.petOwnerId !== activeUser._id
                           ) {
                              return null;
                           }
                           if (
                              activeUser.adoptReqClosed.includes(adoptReq.id)
                           ) {
                              // console.log("This ", adoptReq.id, " was closed");
                              return null;
                           }

                           return (
                              <AdoptRequestReceived
                                 petName={adoptReq.petName}
                                 senderName={adoptReq.senderName}
                                 senderHome={adoptReq.senderHome}
                                 senderLocation={adoptReq.senderLocation}
                                 senderContact={adoptReq.senderContact}
                                 senderAvatar={adoptReq.senderAvatar}
                                 petAvatar={adoptReq.petAvatar}
                                 adReqStatus={adoptReq.adReqStatus}
                                 adoptReqId={adoptReq.id}
                                 adReqDate={adoptReq.adReqDate}
                                 key={adoptReq.id}
                              />
                           );
                        })}
                     {loading1 && <Loading />}
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

export default MyActivityPage;
