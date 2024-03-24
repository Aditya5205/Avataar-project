import React, { useState, useEffect, useRef } from "react";
import Logo from "../../assets/Navbar/Logo.png";
import Search from "../../assets/Navbar/search.png";
import dropdown_icon from "../../assets/Navbar/chevron-down.png";
import "../../styles/Navbar.css";

const Navbar = ({ data }) => {
  const [listItems, setListItems] = useState(data);
  const [sliceInd, setSliceInd] = useState(7);
  const [drop, setDrop] = useState(false);

  const displayDropdown = () => {
    setDrop((prev) => !prev);
  };

  useEffect(() => {
    let dropdownContent = document.querySelector(".dropdown-content");
    let dropdown = document.querySelector(".dropdown");
    if (drop) {
      dropdownContent.style.display = "block";
      dropdown.classList.add("active");
    } else {
      dropdownContent.style.display = "none";
      dropdown.classList.remove("active");
    }
  }, [drop]);

  const listRef = useRef(1);

  useEffect(() => {
    function handleNavbarResize() {
      const { width } = listRef.current.getBoundingClientRect();
      setSliceInd(width / 100);
    }

    window.addEventListener("resize", handleNavbarResize);

    return () => {
      window.removeEventListener("resize", handleNavbarResize);
    };
  }, []);

  return (
    <>
      <header className="header">
        <nav className="nav">
          <img src={Logo} alt="Logo" className="logo_image" />
          <ol className="list" ref={listRef}>
            {listItems.slice(0, sliceInd).map((items, i) => (
              <li className="list-items" key={i} id={`l${i}`}>
                {items}
              </li>
            ))}
          </ol>
          <div className="dropdown-with-searchbar">
            <div className="dropdown-with-icon">
              <div className="dropdown" onClick={displayDropdown}>
                More
                <img
                  src={dropdown_icon}
                  alt="dropdown_icon"
                  className="dropdown-icon"
                />
              </div>
              <div className="dropdown-content">
                <ol className="dropdown-list">
                  {listItems.slice(sliceInd).map((items, i) => (
                    <li className="dropdown-items" key={i}>
                      {items}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="searchbar-with-icon">
              <img src={Search} alt="search_icon" />
              <input
                className="searchbar"
                type="text"
                placeholder="Search something"
              />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
