import { Route, Routes } from "react-router-dom";
import CreatePage from "./pages/CreatePage";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route />
        </Routes>
      </div>
    </>
  );
}

export default App;
