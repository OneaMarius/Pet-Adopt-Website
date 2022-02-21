import { Navigate, Route, Routes} from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdoptPage from "./pages/AdoptPage";
import DonatePage from "./pages/DonatePage";
import MyActivityPage from "./pages/MyActivityPage";
import PetInfoPage from "./pages/PetInfoPage";
import { useContext } from "react";
import AuthContext from "./context/auth-context";

function App() {
   const authCtx = useContext(AuthContext);
   const isLoggedIn = authCtx.isLoggedIn;
   
   
   return (
      <Layout>
         {isLoggedIn && (
            <Routes>
               <Route path="/login" element={<LoginPage />} exact />
               <Route path="/signup" element={<SignupPage />} exact />
               <Route path="/adopt" element={<AdoptPage />} exact />
               <Route path="/adopt/:petId" element={<PetInfoPage />} exact />
               <Route path="/donate" element={<DonatePage />} exact />
               <Route path="/myactivity" element={<MyActivityPage />} exact />
            </Routes>
         )}
         {!isLoggedIn && (
            <Routes>
               <Route path="/" element={<HomePage />} exact />
               <Route path="/login" element={<LoginPage />} exact />
               <Route path="/signup" element={<SignupPage />} exact />
               <Route path="*" element={<Navigate to="/"/>} />
            </Routes>
         )}
      </Layout>
   );
}

export default App;
