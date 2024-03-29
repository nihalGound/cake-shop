import React from "react";
import LOGO from "../visuals/imgs/LOGO.png";

import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { FaCartArrowDown } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

const NavBar = () => {
  return (
    <div className="flex justify-between   px10 bg-slate-500 h-20 w-full " >
      <div className="flex justify-evenly gap-6 items-center "  >
        <div>
          <img className="h-20 w-84px" src={LOGO} alt="LOGO" />
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
      <div className=" flex items-center ">
        <Link>ThakurCake</Link>
      </div>

      <div className="flex justify-evenly gap-6  items-center " >
        <div className="flex items-center gap-2">
            <div><IoSearch /></div>
            <input type="text" placeholder="serach here for cakes"/>
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
