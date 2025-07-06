import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";
import LoginForm from "./components/pages/Auth/LoginForm";
import SignUpForm from "./components/pages/Auth/SignUpForm";
import UserProvider from "./components/context/UserContext";

import { Toaster } from "react-hot-toast";


const App = () => {
  return (
    <div>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" exact element={<LoginForm />} />
            <Route path="/signUp" exact element={<SignUpForm />} />
            {/* <Route path="/dashboard" exact element={<Home />} />
            <Route path="/income" exact element={<Income />} />
            <Route path="/expense" exact element={<Expense />} /> */}
          </Routes>
        </Router>

        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize:'13px'
            },
          }}
        />
        
      </UserProvider>
    </div>
  );
};

// Define the Root component to handle the initial redirect
const Root = () => {
  // Check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  // Redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};

export default App;
