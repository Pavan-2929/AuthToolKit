import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { removeToken } from "../redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state) => state.isLoggedIn)
  const currentUser = useSelector((state) => state.currentUser)

  // console.log(currentUser);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
      // console.log("Logging out...");
    dispatch(removeToken())
    setIsMenuOpen(false)
  }

  return (
    <nav className={`${isMenuOpen ? "bg-[#414141]" : ""} p-4 font-semibold`}>
      <div className="md:flex justify-around items-center">
        <div className="text-[2rem] flex justify-around items-center relative">
          <span className="text-blue-500 animate-fire">AuthToolKit</span>
          <div onClick={toggleMenu} className="md:hidden cursor-pointer">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>

        <div>
          <ul
            className={`text-[1.3rem] md:flex ${
              isMenuOpen ? "block" : "hidden"
            } space-y-8 md:space-y-0 items-center flex flex-col md:flex-row justify-center `}
          >
            <li className="md:ml-5 xl:mx-5 md:mt-0 mt-10 hover:text-blue-700">
              <NavLink to="/" onClick={closeMenu}>
                Home
              </NavLink>
            </li>
            {isAuthenticated ? (
              <>
                <li className="md:ml-5 xl:mx-5 hover:text-blue-700">
                  <NavLink to="/login" onClick={handleLogout}>
                    Logout
                  </NavLink>
                </li>
                {currentUser && currentUser.profilePicture && (
                  <li className="md:ml-5 xl:mx-5 hover:text-blue-700">
                    <NavLink to="/profile" onClick={closeMenu}>
                      <img
                        src={currentUser.profilePicture}
                        alt="Profile"
                        className="rounded-full h-12 w-12" // Set your preferred size
                      />
                    </NavLink>
                  </li>
                )}
              </>
            ) : (
              <>
                <li className="md:ml-5 xl:mx-5 hover:text-blue-700">
                  <NavLink to="/register" onClick={closeMenu}>
                    Register
                  </NavLink>
                </li>
                <li className="md:ml-5 xl:mx-5 hover:text-blue-700">
                  <NavLink to="/login" onClick={closeMenu}>
                    Login
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
