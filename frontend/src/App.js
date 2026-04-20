import "./App.css";
import { useState } from "react";
import LoginPage from "./login/LoginPage";
import HomePage from "./homePage/HomePage";
import CreateShiftPage from "./createShift/CreateShiftPage";
import AddResultPage from "./addResult/AddResultPage";
import ManagerHomePage from "./managerHomePage/ManagerHomePage";

function App() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [currentPage, setCurrentPage] = useState("login");
  const [currentShift, setCurrentShift] = useState(null);

  const handleLogin = (username) => {
    setLoggedInUser(username);
    setCurrentPage("home");
  };

  const goToCreateShift = () => {
    setCurrentPage("createShift");
  };

  const handleShiftCreated = (shift) => {
    setCurrentShift(shift);
    setCurrentPage("addResult");
  };

  const handleOpenShift = (shift) => {
    setCurrentShift(shift);
    setCurrentPage("addResult");
  };

  /*return (
    <div>
      <ManagerHomePage />
    </div>
  );*/



  return (
    <div>
      {!loggedInUser ? (
        <LoginPage onLogin={handleLogin} />
      ) : currentPage === "home" ? (
        <HomePage
          username={loggedInUser}
          onStartShift={goToCreateShift}
          onOpenShift={handleOpenShift}
        />
      ) : currentPage === "createShift" ? (
        <CreateShiftPage onShiftCreated={handleShiftCreated} />
      ) : (
        <AddResultPage
          shift={currentShift}
          onBackToHome={() => setCurrentPage("home")}
        />
      )}
    </div>
  );
}

export default App;