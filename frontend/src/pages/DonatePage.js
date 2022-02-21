import React from "react";
import AdoptForm from "../components/pets/AdoptForm";
import CardA1 from "../components/ui/CardA1";
import mod from './HomePage.module.css'

// import mod from './HomePage.module.css'

function DonatePage() {
   return (
      <div className={mod.donatePage}>
         <CardA1 className={mod.cardA1}>
            <h1>Add PET for Adoption</h1>
            <AdoptForm />
         </CardA1>
      </div>
   );
}

export default DonatePage;
