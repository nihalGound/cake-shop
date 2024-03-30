// import React from "react";
// import LOGO from "../visuals/imgs/LOGO.png";

// import { Link } from "react-router-dom";
// import '../css/main.css'
// import { IoSearch } from "react-icons/io5";
// import { FaCartArrowDown } from "react-icons/fa";
// import { CgProfile } from "react-icons/cg";

// const NavBar = () => {
//   return (
//     <div className="flex justify-between   px10  h-20 w-full mr-7  " >
//       <div className="flex justify-evenly gap-6 items-center inter text-base font-medium text-gray-green "  >
//         <div>
//           <img className="h-10 w-84px" src={LOGO} alt="LOGO" />
//         </div>
//         <div>
//           <Link>Home</Link>
//         </div>
//         <div>
//           <Link>Products</Link>
//         </div>
//         <div>
//           <Link>Cakes</Link>
//         </div>
//       </div>
//       <div className=" flex items-center athiti-semibold text-3xl text-gray-green  ">
//         <Link>99ManagementQuota</Link>
//       </div>

//       <div className="flex justify-evenly gap-6  items-center mr-7 " >
//         <div className="flex items-center gap-2 border-b-2 pb-1 border-gray-green  ">
//             <div><IoSearch /></div>
//             <input type="text" placeholder="serach here for cakes" className="placeholder:text-gray-green placeholder:inter outline-none"/>
//         </div>
//         <div>
//         <FaCartArrowDown className="h-8 w-6"  />
//         </div>
//         <div>
//         <CgProfile className="h-8 w-6"   />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NavBar;
import React from "react";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { FaCartArrowDown } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import LOGO from "../visuals/imgs/LOGO.png";
import "../css/main.css";

const NavBar = () => {
  return (
    <div className="flex justify-between items-center px-10 h-20 w-full mr-7">
      <div className="flex items-center gap-6 text-base font-medium text-gray-green">
        <Link to="/">
          <img className="h-10 w-auto" src={LOGO} alt="LOGO" />
        </Link>
        <div className="hidden md:flex gap-4">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/cakes">Cakes</NavLink>
        </div>
      </div>

      <div className="flex items-center font-semibold text-3xl text-gray-green">
        <Link to="/">99ManagementQuota</Link>
      </div>

      {/* Right side  */}
      <div className="flex items-center gap-6 mr-7">
        <div className="flex items-center border-b-2 border-transparent hover:border-gray-500 focus-within:border-gray-500 transition-colors duration-200 ease-in-out">
          <IoSearch className="h-6 w-6 text-gray-500" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search here for cakes"
            className="flex-1 outline-none placeholder-gray-500 bg-transparent py-2 px-4"
            aria-label="Search"
          />
        </div>

        <NavLink to="/cart" icon={<FaCartArrowDown className="h-6 w-6" />} />
        <NavLink to="/profile" icon={<CgProfile className="h-6 w-6" />} />
      </div>
    </div>
  );
};

const NavLink = ({ to, children, icon }) => (
  <Link
    to={to}
    className="flex items-center gap-1 font-medium text-gray-green transition duration-300 hover:text-indigo-600"
  >
    {icon}
    {children}
  </Link>
);

export default NavBar;
