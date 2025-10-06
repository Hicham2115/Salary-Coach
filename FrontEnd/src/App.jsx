import AddTransaction from "./AddTransaction";
import EditTransaction from "./EditTransaction";
import Dashboard from "./Pages/Dashboard";
import Dashboard2 from "./Pages/Dashboard2";
import LandingPage from "./Pages/LandingPage";
import LandingPage2 from "./Pages/LandingPage2";
import Registre from "./Pages/Registre";
import SignUp from "./Pages/SignUp";

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <LandingPage />
              <LandingPage2 />
            </>
          }
        ></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/SignUp" element={<SignUp />}></Route>
        <Route path="/Registre" element={<Registre />}></Route>
        <Route path="/dashboard2" element={<Dashboard2 />} />
        <Route path="/addtransaction/:userId" element={<AddTransaction />} />
        <Route
          path="/edit-transaction/:transactionId"
          element={<EditTransaction />}
        />
      </Routes>
    </>
  );
}

export default App;
