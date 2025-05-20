import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in successfully!");
      }
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email already registered. Try logging in.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account with this email. Please sign up.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError("Error: " + err.message);
      }
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>{isSignup ? "Sign Up" : "Log In"}</h2>
        {error && <p style={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          {isSignup ? "Create Account" : "Log In"}
        </button>

        <p style={styles.toggleText}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button type="button" onClick={toggleMode} style={styles.toggleButton}>
            {isSignup ? "Log In" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "transparent",
  },
  form: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "300px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    color: "#2d3436",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#0984e3",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  toggleText: {
    marginTop: "10px",
    fontSize: "0.9rem",
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "#0984e3",
    marginLeft: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "0.85rem",
    marginBottom: "10px",
  },
};

export default AuthPage;
