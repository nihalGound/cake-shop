import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./main_pages/Home";
import Login from "./Authentication/Login";
import SignUp from "./Authentication/SignUp";


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


]);

function App() {
  return (
    <h1>
      <RouterProvider router={router} />
    </h1>
  );
}

export default App;
