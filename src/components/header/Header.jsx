import React, { useRef, useState } from "react";
import { NavLink } from "./NavLink";
import '../../scss/components/header.scss'
import search from '../../assets/icons/search.svg'
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen,setIsSearchOpen]=useState(false)
  const [searchData,setSearchData]=useState('')
 const searInputref=useRef();
  return (
    <header data-component="header">
      <div className="header-container">
       <button
          aria-label="toggle-menue"
          className="header-hamburger"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "☰" : "✖"}
        </button>
        <div className="logo-container">
         <label>FlavourAnime</label>
        </div>
        <nav className="nav-container">
          {NavLink.map((item, index) => {
            return (
              <a key={index} href={item.href} className="header-links">
                {item.name}
              </a>
            );
          })}
        </nav>

        <div className="search-container">
        <img src={search} className="search-icon"/>
        <input className="search-input" 
          placeholder="anime,manga,etc.."
          value={searchData}
          onChange={(e)=>setSearchData(e.target.searchData)}
          ref={searInputref}
        />
         </div>
        {/* search Icon */}
        {/* <div className="search-container">
         {isSearchOpen && (
        <img src={search} onClick={()=>setIsSearchOpen(!isSearchOpen)}className="search-icon" alt="searchIcon"/>
       
          <input />
        )

        } */}
        {/* </div> */}
        {/* Hamburger Buttons  */}
        <div className="auth-container">
        <label>signIn</label>
        <label>/</label>
        <label>signUp</label>
        </div>
      </div>
      {isOpen && (
        <div className="header-mobile-menue">
          {NavLink.map((item, index) => {
            return (
              <a
                key={index}
                href={item.href}
                className="header-mobile-link"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Header;
