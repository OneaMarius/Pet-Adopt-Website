import { createContext, useCallback, useState } from "react";
import React from "react";

const AuthContext = createContext({
   isLoggedIn: false,
   activePage: 'home',
   updateUser: () => {},
   login: () => {},
   logout: () => {},
   pageHandler: ()=> {}
});

export const AuthContextProvider = (props) => {
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [loggedUser, setLoggedUser] = useState('No user is logged in');
   const [activePage, setActivePage] = useState('home');


  const pageHandler = useCallback((page) => {
    setActivePage(page);
 }, []);


   const login = useCallback((user) => {
      setIsLoggedIn(true);
      setLoggedUser(user);
   }, []);

   const updateUser = (user) => {
      setLoggedUser(user);
      // console.log(user);
   }

   const logout = useCallback(() => {
      
      setIsLoggedIn(false);
      setLoggedUser('No user is logged in');
   }, []);
   
   
   const contextValue = {
       isLoggedIn: isLoggedIn,
       activePage: activePage,
       user: loggedUser,
       updateUser,
       login: login,
       logout: logout,
       pageHandler: pageHandler
   }

   return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;