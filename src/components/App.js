import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import fbase from "fbase";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObject, setUserObject] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) =>  {
      if(user){
        if(user.displayName === null){
          const name = user.email.split('@')[0];
          user.updateProfile( {displayName: name});
        }
        setUserObject({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args)
        });
      } else {
        setUserObject(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObject({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args)
    });
  }
  return( 
  <>
    {init ? <AppRouter refreshUser = {refreshUser}isLoggedIn={userObject} userObject= {userObject}/> : "Initializing..."}
    {/* <footer>&copy; {new Date().getFullYear()} Nwitter </footer> */}
  </>
  )
}

export default App;
