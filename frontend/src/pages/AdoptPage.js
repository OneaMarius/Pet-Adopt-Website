import React, { useEffect, useState } from "react";
import Loading from "../components/layout/Loading";
import PetHomeCard from "../components/pets/PetHomeCard";
import ButtonA from "../components/ui/ButtonA";
import mod from "./HomePage.module.css";

function AdoptPage() {
   const [PetDB, setPetDB] = useState();
   const [PetStartingDB, setPetStartingDB] = useState([]);
   // const [UserDB, setUserDB] = useState();
   const [loading, setLoading] = useState(true);
   const [selectType, setSelectType] = useState("All");
   const [selectAvailable, setSelectAvailable] = useState("All");
   const [petName, setPetName] = useState("");

   useEffect(() => {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pets`)
         .then((response) => response.json())
         .catch((err) => err.message)
         .then((data) => {
            // console.log(data);
            setPetDB(data.PetList);
            setPetStartingDB(data.PetList);
            // setUserDB(data.UserList);
            setLoading(false);
         });
   }, []);

   function Go() {
      const petListDb = [...PetStartingDB];
      let petType = selectType;
      let available = selectAvailable;
      let newDB = petListDb.filter((pet) => {
         let petFound = false;
         if (petName !== "") {
            if (pet.petName.toLowerCase().includes(petName.toLowerCase())) {
               petFound = true;
            }
         } else {
            petFound = true;
         }
         if (petType === "All") {
            if (available === "All") {
               return petFound;
            } else if (available === "Available") {
               return pet.petWasAdopted === false && petFound;
            } else {
               return pet.petWasAdopted === true && petFound;
            }
         } else if (petType === "Cat") {
            if (available === "All") {
               return pet.petType === "Cat" && petFound;
            } else if (available === "Available") {
               return pet.petWasAdopted === false && pet.petType === "Cat" && petFound;
            } else {
               return pet.petWasAdopted === true && pet.petType === "Cat" && petFound;
            }
         } else {
            if (available === "All") {
               return pet.petType === "Dog" && petFound;
            } else if (available === "Available") {
               return pet.petWasAdopted === false && pet.petType === "Dog" && petFound;
            } else {
               return pet.petWasAdopted === true && pet.petType === "Dog" && petFound;
            }
         }
      });
      setPetDB(newDB);
   }

   return (
      <div className={mod.AdoptPage}>
         <div className={mod.AdoptPanel}>
            <input
               type="text"
               placeholder="Pet Name"
               onChange={(e) => {
                  setPetName(e.target.value);
               }}
            />
            <select
               name="type"
               id=""
               onChange={(e) => {
                  setSelectType(e.target.value);
               }}>
               <option value="All">All</option>
               <option value="Cat">Cat</option>
               <option value="Dog">Dog</option>
            </select>
            <select
               name="available"
               id=""
               onChange={(e) => setSelectAvailable(e.target.value)}>
               <option value="All">All</option>
               <option value="Available">Available</option>
               <option value="Adopted">Adopted</option>
            </select>
            <ButtonA className={mod.btn} onClick={Go}>
               Go
            </ButtonA>
         </div>
         <div className={mod.PetList}>
            {!loading &&
               PetDB.map((pet) => (
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
                  />
               ))}
            {loading && <Loading />}
         </div>
      </div>
   );
}

export default AdoptPage;
