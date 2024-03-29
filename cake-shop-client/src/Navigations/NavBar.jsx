import React from "react";
import LOGO from "../visuals/imgs/LOGO.png";

import { Link } from "react-router-dom";
import '../css/main.css'
import { IoSearch } from "react-icons/io5";
import { FaCartArrowDown } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

const NavBar = () => {
  return (
    <div className="flex justify-between   px10  h-20 w-full mr-7  " >
      <div className="flex justify-evenly gap-6 items-center inter text-base font-medium text-gray-green "  >
        <div>
          <img className="h-10 w-84px" src={LOGO} alt="LOGO" />
        </div>
        <div>
          <Link>Home</Link>
        </div>
        <div>
          <Link>Products</Link>
        </div>
        <div>
          <Link>Cakes</Link>
        </div>
      </div>
      <div className=" flex items-center athiti-semibold text-3xl text-gray-green  ">
        <Link>99ManagementQuota</Link>
      </div>

      <div className="flex justify-evenly gap-6  items-center mr-7 " >
        <div className="flex items-center gap-2 border-b-2 pb-1 border-gray-green  ">
            <div><IoSearch /></div>
            <input type="text" placeholder="serach here for cakes" className="placeholder:text-gray-green placeholder:inter outline-none"/>
        </div>
        <div>
        <FaCartArrowDown className="h-8 w-6"  />
        </div>
        <div>
        <CgProfile className="h-8 w-6"   />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
