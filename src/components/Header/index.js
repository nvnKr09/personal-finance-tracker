import React, { useEffect } from "react";
import "./styles.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import userImg from "../../Assets/user.svg";

const Header = () => {
  const [user, loading] = useAuthState(auth);
  // console.log("userData",user);

  const Navigate = useNavigate();

  useEffect(() => {
    if (user) {
      Navigate("/dashboard");
    } else{
      Navigate("/");
    }
  }, [user, loading]);

  function logoutFn() {
    try {
      signOut(auth)
        .then(() => {
          // sign-out Successful.
          toast.success("Logged out successfully");
          Navigate("/");
        })
        .catch((error) => {
          // an error occurred.
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="navbar">
      <p className="logo">Financely.</p>
      {user && (
        <div className="userPic-logout-wrapper" >
          <img src={user.photoURL ? user.photoURL : userImg} />
          <p className="logo link" onClick={logoutFn}>Logout</p>
        </div>
      )}
    </div>
  );
};

export default Header;
