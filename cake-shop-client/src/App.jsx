import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./main_pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
