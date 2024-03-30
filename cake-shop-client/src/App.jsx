import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./main_pages/Home";
import Login from "./Authentication/Login";
import SignUp from "./Authentication/SignUp";
import Phone_verification from "./Authentication/Phone_verification";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,

  },
  {
    path: "/signup",
    element: <SignUp />,

  },
  {
    path: "/verify-phone",
    element: <Phone_verification />,

  },

]);

function App() {
  return (
    <h1>
      <RouterProvider router={router} />
    </h1>
  );
}

export default App;
