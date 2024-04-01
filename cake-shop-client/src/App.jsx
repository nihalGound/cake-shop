// import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import Home from "./main_pages/Home";
// import Login from "./Authentication/Login";
// import SignUp from "./Authentication/SignUp";
// import PageNotFound from "./404";
// import AuthUserContextProvider from "./Contexts/AuthUserContext.jsx";


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Home />,
//   },
//   {
//     path: "/login",
//     element: <Login />,

//   },
//   {
//     path: "/signup",
//     element: <SignUp />,

//   },
//   {
//     path: "*",
//     element: <PageNotFound />,

//   },

// ]);

// function App() {
//   return (
//     <h1>
//       <AuthUserContextProvider>
//       <RouterProvider router={router} />


//       </AuthUserContextProvider>

//     </h1>
//   );
// }

// export default App;
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./main_pages/Home";
import Login from "./Authentication/Login.jsx";
import SignUp from "./Authentication/SignUp.jsx";
import PageNotFound from "./404";
import { AuthUserContextProvider } from "./Contexts/AuthUserContext";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "*", element: <PageNotFound /> },
]);

function App() {
  return (
    <AuthUserContextProvider>
      <RouterProvider router={router} />
    </AuthUserContextProvider>
  );
}

export default App;
