import React from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const isAuthenticated = useSelector((state) => state.isLoggedIn);

  return (
    <div className="flex flex-col items-center justify-center mt-[30vh]">
      <h1 className="text-4xl font-bold mb-4">This is Home page</h1>
      {isAuthenticated ? (
        <h2 className="text-2xl text-green-600">{`Welcome, ${currentUser.username}`}</h2>
      ) : (
        <h2 className="text-2xl text-red-600">You need to Login</h2>
      )}
    </div>
  );
};

export default Home;
