import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { logout } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";
import { FaRegUser } from "react-icons/fa6";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    // if (user) {
    //   console.log(user?.profile_image_url);
    // }
    if (!showMenu) return;
    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu, user]);

  const handleLogout = (e) => {
    e.preventDefault();
    setShowMenu(false);
    dispatch(logout());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <button
        className={`icon-button ${user ? "logged-in" : ""}`}
        onClick={openMenu}
        style={{ cursor: "pointer" }}
      >
        {user?.profile_image_url ? (
          <img
            src={user?.profile_image_url}
            alt={`${user?.username}'s profile`}
            className="profile-image-icon"
          />
        ) : (
          <FaRegUser className="profile-image-icon" />
        )}
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>Hello, {user?.username}</li>
            <li>{user?.email}</li>
            <hr />
            <NavLink to="/products/manage" style={{ cursor: "pointer" }}>
              Manage Products
            </NavLink>
            <hr />
            <NavLink to="/favorite" style={{ cursor: "pointer" }}>
              Your Favorites
            </NavLink>
            <hr />
            <NavLink to="/reviews" style={{ cursor: "pointer" }}>
              Your Reviews
            </NavLink>
            <hr />
            <li>
              <NavLink to="/history" style={{ cursor: "pointer" }}>
                Order History
              </NavLink>
            </li>
            <hr />
            <li>
              <button
                className="logout-button"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </li>
          </>
        ) : (
          <>
          <div className="login-logout">
          <div className="profile-login-button">
            <OpenModalButton
              buttonText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            </div>
            <div className="profile-signup-button">
            <OpenModalButton
              buttonText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
            </div>
            </div>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
