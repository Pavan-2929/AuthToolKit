import React, { useEffect } from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { user } from "../redux/auth/authSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setToken } from "../redux/auth/authSlice";
import { useSnackbar } from "notistack";

const GoogleAuth = () => {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const isAuthenticated = useSelector((state) => state.isLoggedIn);

  const loadUserData = async () => {
    try {
      if (isAuthenticated) {
        const response = await axios.get("http://localhost:3000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(user);
        dispatch(user(response.data));
        // console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [token]);

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      // console.log(result);

      const response = await axios.post(
        "http://localhost:3000/api/auth/google",
        {
          username: result.user.displayName,
          email: result.user.email,
          profilePicture: result.user.photoURL,
        }
      );
      const token = response.data.token;

      console.log(response);
      if (response.status === 201) {
        dispatch(setToken(token));
        enqueueSnackbar("Login Successfully", { variant: "success" });
        navigate("/");
      }
      dispatch(user(response.data));
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
    >
      Continue with google
    </button>
  );
};

export default GoogleAuth;
