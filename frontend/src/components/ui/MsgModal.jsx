import React, { useState } from "react";
import ButtonA from "./ButtonA";
import mod from "./MsgModal.module.css";

function MsgModal({ type, msg, onOk, onCancel }) {
   let info = false;
   let error = false;
   let ask = false;
   const MsgModalType = type;

   switch (MsgModalType) {
      case "info":
         info = true;
         break;
      case "error":
         error = true;
         break;
      case "ask":
         ask = true;
         break;

      default:
         info = true;
         break;
   }

   function okHandler() {
      onOk();
   }
   const [modHand, setModHand] = useState(false)
   function cancelHandler() {
      onCancel();
      setModHand(true);
   }
   //    console.log('info',info,'error', error,'ask', ask);

   return (
      <div className={ ask ? `${mod.MsgModal} ${modHand?mod.MsgModalClose:''}` : mod.MsgModalInfo}>
         <div className={mod.MsgCard}>
            <div className={mod.info}>
               {error && <div className={mod.titleError}>Error</div>}        
               {info && <div className={mod.titleInfo}>Info</div>}
               {ask && <div className={mod.titleAsk}>Ask</div>}
               <div className={mod.message}>{msg}</div>
            </div>

            <div className={mod.controls}>
            {ask && <div><ButtonA onClick={okHandler} className={mod.btn}>Ok</ButtonA>
                <ButtonA onClick={cancelHandler} className={mod.btn}>Cancel</ButtonA></div>}
            </div>
         </div>
      </div>
   );
}

export default MsgModal;
