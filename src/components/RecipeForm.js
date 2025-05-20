import React, { useState } from "react";
import { db } from "../firebase"; // Importing Firebase configuration
import { collection, addDoc, Timestamp } from "firebase/firestore"; // Importing Firestore methods

const RecipeForm = () => {
  const [username, setUsername] = useState(""); // State for username
  const [title, setTitle] = useState(""); // State for title
  const [ingredients, setIngredients] = useState(""); // State for ingredients
  const [instructions, setInstructions] = useState(""); // State for instructions
  const [error, setError] = useState(""); // State for error message

  // Handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    setError(""); // Clear any previous error

    // Creating the recipe object to be added to Firestore
    const newRecipe = {
      username,
      title,
      ingredients,
      instructions,
      created: Timestamp.now(),
    };

    try {
      // Adding the recipe to the Firestore "recipes" collection
      await addDoc(collection(db, "recipes"), newRecipe);
      
      // Clearing the form after successful submission
      setUsername("");
      setTitle("");
      setIngredients("");
      setInstructions("");
    } catch (error) {
      console.error("Error adding recipe: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-xl mb-4 font-bold">Add Recipe</h2>

      {/* Username input */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message */}
      </div>

      {/* Title input */}
      <input
        type="text"
        placeholder="Recipe Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 p-2 border"
        required
      />

      {/* Ingredients input */}
      <textarea
        placeholder="Ingredients (comma separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        className="w-full mb-2 p-2 border"
        required
      />

      {/* Instructions input */}
      <textarea
        placeholder="Instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        className="w-full mb-2 p-2 border"
        required
      />

      {/* Submit button */}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Submit Recipe</button>
    </form>
  );
};

export default RecipeForm;
