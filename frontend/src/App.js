import "./App.css";
import { useEffect, useState } from "react";
import LoginPage from "./login/LoginPage";
import HomePage from "./homePage/HomePage";
import CreateShiftPage from "./createShift/CreateShiftPage";
import AddResultPage from "./addResult/AddResultPage";
import ManagerHomePage from "./managerHomePage/ManagerHomePage";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);// Stores currently logged-in user
  const [currentPage, setCurrentPage] = useState("login");// Controls which page is currently shown
  const [currentShift, setCurrentShift] = useState(null);// Stores currently selected or created shift

  // After successful login, store user data and redirect based on user role
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

  // On app load, check if user session already exists and restore login state
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



  // Render the correct page based on login status and current page state
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
        <ManagerHomePage 
            user={loggedInUser}
            onLogout={handleLogout} 
            setCurrentPage={setCurrentPage}/>
      ) : currentPage === "createShift" ? (
        <CreateShiftPage
          user={loggedInUser}
          onShiftCreated={handleShiftCreated}
        />
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