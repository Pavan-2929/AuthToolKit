import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { user, removeToken } from "../redux/auth/authSlice";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const Profile = () => {
  const { enqueueSnackbar } = useSnackbar();

  const fileRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(undefined);
  const [imageError, setImageError] = useState(false);
  const [imagePercentage, setImagePercentage] = useState(0);

  const token = useSelector((state) => state.token);
  const currentUser = useSelector((state) => state.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:3000/api/profile/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        enqueueSnackbar("User updated Successfully", { variant: "success" });
        dispatch(user(response.data));
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercentage(Math.round(progress));
      },
      (error) => {
        setImageError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleLogout = () => {
    dispatch(removeToken());
    navigate("/");
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault()
    try {
      const deltedUser = await axios.delete(
        "http://localhost:3000/api/profile/delete",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log(deltedUser);
      dispatch(removeToken())
      navigate('/')
    } catch (error) {
      console.log(error);
    }   
  }

  return (
    <div>
      <div className="p-3 max-w-lg mx-auto bg-[#272727] mb-10 rounded-md mt-10 text-black">
        <h1 className="text-3xl text-blue-500 font-semibold text-center my-7">
          Your Profile
        </h1>
        <form className="flex flex-col gap-4" onSubmit={updateProfileHandler}>
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <img
            src={formData.profilePicture || currentUser.profilePicture}
            alt="profile"
            className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
            onClick={() => fileRef.current.click()}
          />
          <p className="font-semibold">
            {imageError ? (
              <span className="text-red-700">
                Error Uploading Image (Image should be less than 2 MB)
              </span>
            ) : imagePercentage > 0 && imagePercentage < 100 ? (
              <span className="text-yellow-500">{`Uploading ${imagePercentage}%`}</span>
            ) : imagePercentage === 100 ? (
              <span className="text-green-500">Image uploaded</span>
            ) : (
              ""
            )}
          </p>
          <input
            type="text"
            id="username"
            placeholder="Username"
            className="bg-slate-100 rounded-lg p-3"
            defaultValue={currentUser.username}
            onChange={handleChange}
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="bg-slate-100 rounded-lg p-3"
            defaultValue={currentUser.email}
            onChange={handleChange}
          />
          <input
            type="text"
            id="password"
            placeholder="Password"
            className="bg-slate-100 rounded-lg p-3"
            onChange={handleChange}
          />
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            update
          </button>
        </form>
        <div className="flex justify-between mt-5 font-semibold">
          <span className="text-red-700 cursor-pointer" onClick={handleDeleteUser}>Delete Account</span>
          <span className="text-red-700 cursor-pointer" onClick={handleLogout}>
            Sign out
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
