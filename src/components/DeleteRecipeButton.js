// src/components/DeleteRecipeButton.js
import React from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const DeleteRecipeButton = ({ recipeId }) => {
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "recipes", recipeId));
      alert("Recipe deleted successfully.");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe.");
    }
  };

  return (
    <button onClick={handleDelete} style={{ backgroundColor: "#f44336", color: "#fff", border: "none", padding: "5px 10px", cursor: "pointer" }}>
      Delete
    </button>
  );
};

export default DeleteRecipeButton;
