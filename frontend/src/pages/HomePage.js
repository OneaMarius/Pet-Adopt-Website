import React, { useEffect, useState } from "react";
import Loading from "../components/layout/Loading";
import PetHomeCard from "../components/pets/PetHomeCard";
import mod from "./HomePage.module.css";

// import mod from './HomePage.module.css'

function HomePage() {
   const [PetDB, setPetDB] = useState();
   // const [UserDB, setUserDB] = useState();
   const [loading, setLoading] = useState(true);
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

   return (
      <div className={mod.HomePage}>
         <div className={mod.PetListHome}>
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

export default HomePage;
