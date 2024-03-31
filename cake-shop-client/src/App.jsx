import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./main_pages/Home";
import Login from "./Authentication/Login";
import SignUp from "./Authentication/SignUp";
import PageNotFound from "./404";


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
    path: "*",
    element: <PageNotFound />,

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
