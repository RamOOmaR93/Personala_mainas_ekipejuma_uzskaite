import { useState } from "react";
import LoginPage from "./login/LoginPage";
import HomePage from "./homePage/HomePage";
import CreateShiftPage from "./createShift/CreateShiftPage";
import AddResultPage from "./addResult/AddResultPage";

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