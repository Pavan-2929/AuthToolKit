import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setToken } from "../redux/auth/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { user } from "../redux/auth/authSlice";
import GoogleAuth from "../components/GoogleAuth";
import { useSnackbar } from "notistack";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormdata] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const isAuthenticated = useSelector((state) => state.isLoggedIn);

  const handleChange = (e) => {
    setFormdata({ ...formData, [e.target.id]: e.target.value });
  };

  const loadUserData = async () => {
    try {
      if (isAuthenticated) {
        const response = await axios.get(
          "https://authtoolkit-backend-29.onrender.com/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://authtoolkit-backend-29.onrender.com/api/auth/register",
        formData
      );
      const token = response.data.token;

      if (response.status === 201) {
        enqueueSnackbar("Login Successfully", { variant: "success" });
        dispatch(setToken(token));
        navigate("/");
        setFormdata({});
      }
    } catch (error) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
      console.log(error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto bg-[#272727] mb-10 rounded-md mt-28 text-black">
      <h1 className="text-3xl text-blue-500 text-center font-semibold my-7">
        Register
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Register
        </button>
        <GoogleAuth />
      </form>
      <div className="flex gap-2 mt-5 text-white">
        <p>Have an account?</p>
        <Link to="/login">
          <span className="underline">Login</span>
        </Link>
      </div>
    </div>
  );
};

export default Register;
