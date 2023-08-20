
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {  FaLinkedin, FaFacebook, FaBagShopping, FaGithub  } from 'react-icons/fa6';
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import logo from "../../images/playbox-high-resolution-logo-black-on-transparent-background.png";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="nav-container">
    <div className="logo-and-menu">
      <NavLink exact to="/">
        <img className="logo" src={logo} alt="Home" />
      </NavLink>
      <div className="menu-links">
        <NavLink to="/about">About</NavLink>
        <NavLink to="/sell">Sell</NavLink>
        <NavLink to="/products">Shop</NavLink>
        <NavLink to="/press">Press</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </div>
      </div>
      {isLoaded && (
        <div className="profile-section">
          <div className="social-icons">
            {/* <a href="https://www.instagram.com/your_username/" target="_blank" rel="noopener noreferrer">
              <FaInstagram  style={{ color: 'gold'  }} />
            </a> */}
            <a href="https://www.linkedin.com/in/makoto-doi/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="nav-linkedin" style={{ color: 'gold'  }} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=100004164127853" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="nav-facebook" style={{ color: 'gold'  }} />
            </a>
            <a href="https://github.com/londelidess" target="_blank" rel="noopener noreferrer">
            <FaGithub className="nav-github" style={{ color: 'gold'  }} />
            </a>
          </div>
          {sessionUser && (
        <div className="shopping-cart-icon-container">
            <NavLink to="/shoppingcarts">
                <FaBagShopping style={{ color: 'gold' }} />
            </NavLink>
        </div>
        )}
          <div className="profile-button-container">
            <ProfileButton user={sessionUser} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Navigation;
