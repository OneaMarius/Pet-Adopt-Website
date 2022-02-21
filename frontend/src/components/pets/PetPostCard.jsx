import React from "react";
import mod from "./PetPostCard.module.css";

function PetPostCard(props) {
   
   
   return (
      <div className={props.isPetOwner ? mod.card1 : mod.card2}> 
         <div className={mod.time}>{props.postDate}</div>
         <div className={mod.avatar} style={{backgroundImage:`url(${props.userAvatar})`}}></div>
         <fieldset className={mod.post}>
            <legend align={props.isPetOwner ? 'left' : 'right'} className={mod.userName}>{`${props.userName}`}</legend>
            <div className={mod.message}>{props.userMessage}</div>
         </fieldset>
      </div>
   );
}

export default PetPostCard;
