import "./App.css";
import { useState } from "react";
import { firebaseConfig } from "./config/Config";
import { initializeApp } from "firebase/app";
//component
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
//page
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { Signout } from "./pages/Signout";
import { Detail } from "./pages/Detail";
import { Contact } from "./pages/Contact";
//firebase
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
//context
import { NavContext } from "./contexts/NavContexts";
import { FBAuthContext } from "./contexts/FBAuthContext";
import { FBDBContext } from "./contexts/FBDBContext";
import { FBStorageContext } from "./contexts/FBStorageContext";

const FirebaseApp = initializeApp(firebaseConfig);
const FirebaseAuth = getAuth(FirebaseApp);
const FirebaseDB = getFirestore(FirebaseApp);
const FirebaseStorage = getStorage(FirebaseApp);

const NavRoutes = [
  { name: "Home", goto: "/" },
  { name: "About", goto: "/about" },
  { name: "Contact", goto: "/contact" },
  { name: "Sign in", goto: "/signin" },
  { name: "Sign up", goto: "/signup" },
];

const AuthNavRoutes = [
  { name: "Home", goto: "/" },
  { name: "About", goto: "/about" },
  { name: "Contact", goto: "/contact" },
  { name: "Sign out", goto: "/signout" },
];

function App() {
  const [navItems, setNavItems] = useState(NavRoutes);
  const [auth, setAuth] = useState(null);

  onAuthStateChanged(FirebaseAuth, (user) => {
    if (user) {
      setAuth(user);
      setNavItems(AuthNavRoutes);
    } else {
      setAuth(null);
      setNavItems(NavRoutes);
    }
  });

  return (
    <div className="App">
      <NavContext.Provider value={navItems}>
        <Header />
      </NavContext.Provider>
      <FBAuthContext.Provider value={FirebaseAuth}>
        <FBDBContext.Provider value={FirebaseDB}>
          <FBStorageContext.Provider value={FirebaseStorage}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signout" element={<Signout />} />
              <Route path="/detail/:movieId" element={<Detail />} />
            </Routes>
          </FBStorageContext.Provider>
        </FBDBContext.Provider>
      </FBAuthContext.Provider>
    </div>
  );
}

export default App;
