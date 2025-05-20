import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import RecipeList from "./components/RecipeList";
import AddRecipe from "./components/AddRecipe";
import AuthPage from "./components/AuthPage"; // ✅ Combined login/signup
import Profile from "./components/Profile";
import FavoritesList from "./components/FavoritesList";

function App() {
  const backgroundStyle = {
    minHeight: "100vh",
    backgroundImage: "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
    color: "#fff",
    backdropFilter: "blur(4px)",
  };

  const overlayStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "1000px",
    margin: "0 auto",
  };

  const linkStyle = {
    margin: "0 15px",
    color: "#ffeaa7",
    textDecoration: "none",
    fontWeight: "bold",
  };

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle}>
        <Router>
          <h1
            style={{
              textAlign: "center",
              fontSize: "2.5rem",
              marginBottom: "10px",
              color: "#ffeaa7",
            }}
          >
            🍛 Food Recipe App
          </h1>

          <nav style={{ textAlign: "center", marginBottom: "20px" }}>
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/add" style={linkStyle}>Add Recipe</Link>
            <Link to="/favorites" style={linkStyle}>Favorites</Link>
            <Link to="/auth" style={linkStyle}>Login / SignUp</Link>
            <Link to="/profile" style={linkStyle}>Profile</Link>
          </nav>

          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/add" element={<AddRecipe />} />
            <Route path="/favorites" element={<FavoritesList />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
