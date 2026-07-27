
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import Auth from "./pages/Auth";



export const ServerUrl  = "http://localhost:3000"
export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />

    </Routes>
  );
};
