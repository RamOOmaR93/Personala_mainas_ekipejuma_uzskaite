import "./App.css";
import { useEffect, useState } from "react";
import LoginPage from "./login/LoginPage";
import HomePage from "./homePage/HomePage";
import CreateShiftPage from "./createShift/CreateShiftPage";
import AddResultPage from "./addResult/AddResultPage";
import ManagerHomePage from "./managerHomePage/ManagerHomePage";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("login");
  const [currentShift, setCurrentShift] = useState(null);

  const handleLogin = (userData) => {
    setLoggedInUser(userData);

    if (userData.role === "DARBINIEKS") {
      setCurrentPage("home");
    } else if (userData.role === "PRIEKSNIEKS" || userData.role === "VIETNIEKS") {
      setCurrentPage("manager");
    } else {
      setCurrentPage("home");
    }
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

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (e) {
      console.error(e);
    }

    setLoggedInUser(null);
    setCurrentPage("login");
    setCurrentShift(null);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/me", {
          credentials: "include"
        });

        if (!response.ok) return;

        const data = await response.json();
        handleLogin(data);

      } catch (e) {
        console.error(e);
      }
    };

    checkSession();
  }, []);

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
          user={loggedInUser}
          onStartShift={goToCreateShift}
          onOpenShift={handleOpenShift}
          onLogout={handleLogout}
        />
      ) : currentPage === "manager" ? (
        <ManagerHomePage onLogout={handleLogout} />
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