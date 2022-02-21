import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth-context";
import MsgModal from "../ui/MsgModal";
import mod from "./MainNavigation.module.css";

function MainNavigation(props) {
   const authCtx = useContext(AuthContext);
   const isLoggedIn = authCtx.isLoggedIn;
   const activePage = authCtx.activePage;
   const userAvatar = authCtx.user.avatar;
   const [checkLogout, setCheckLogout] = useState(false);


   function logoutHandler() {
      setCheckLogout(false);
      authCtx.logout();
      authCtx.pageHandler("home");
   }

   function pageChangeHandler(e) {
      // console.log(e.target.href.slice(33));
      let page = e.target.href.slice(33);
      if (page === "") {
         page = "home";
      }
      authCtx.pageHandler(page);
   }

   function closeModal() {
      setTimeout(()=>{setCheckLogout(false)},1000)
      
   }

   return (
      <header className={mod.header}>
      {checkLogout && <MsgModal type='ask' msg='Do you want to logout?' onOk={logoutHandler} onCancel={closeModal}/>}   
         <nav className={mod.nav}>
            {isLoggedIn && (
               <ul className={mod.ul_login}>
                  <li>
                     <Link
                        to="/adopt"
                        className={activePage === "adopt" ? mod.active : ""}
                        onClick={pageChangeHandler}>
                        Adopt
                     </Link>
                  </li>
                  <li>
                     <Link
                        to="/donate"
                        className={activePage === "donate" ? mod.active : ""}
                        onClick={pageChangeHandler}>
                        Donate
                     </Link>
                  </li>
                  <div className={mod.logoUser}><img src={`${userAvatar}`} alt="" /></div>
                  <li>
                     <Link
                        to="/myactivity"
                        className={
                           activePage === "myactivity" ? mod.active : ""
                        }
                        onClick={pageChangeHandler}>
                        My Activity
                     </Link>
                  </li>
                  <li>
                     <Link
                        to="#"
                        onClick={()=>{setCheckLogout(true)}}
                        className={activePage === "home" ? mod.active : ""}
                        >
                        Logout
                     </Link>
                  </li>
               </ul>
            )}
            {!isLoggedIn && (
               <ul className={mod.ul_logout}>
                   
                  <li>
                     <Link
                        to="/"
                        className={activePage === "home" ? mod.active : ""}
                        onClick={pageChangeHandler}>
                        Home
                     </Link>
                  </li>
                  <div className={mod.logo}><img src={require("../../images/logo.png")} alt="" /></div>
                  <li>
                     <Link
                        to="/login"
                        className={activePage === "login" ? mod.active : ""}
                        onClick={pageChangeHandler}>
                        Login
                     </Link>
                  </li>
               </ul>
            )}
         </nav>
      </header>
   );
}

export default MainNavigation;
