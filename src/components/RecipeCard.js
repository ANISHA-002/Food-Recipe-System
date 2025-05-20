import React from "react";

const RecipeCard = ({ recipe, onDelete }) => {
  return (
    <div className="p-4 shadow-lg border rounded-lg mb-6 bg-white hover:shadow-xl transition-transform duration-300 transform hover:scale-105">
      {/* Recipe Title */}
      <h3 className="font-semibold text-xl text-gray-800 mb-3">{recipe.title}</h3>

      {/* Ingredients */}
      <div className="mb-4">
        <p className="text-gray-700 font-medium">Ingredients:</p>
        <ul className="list-disc pl-6 text-gray-600">
          {recipe.ingredients.split(",").map((ingredient, index) => (
            <li key={index} className="text-sm">{ingredient.trim()}</li>
          ))}
        </ul>
      </div>

      {/* Instructions */}
      <div>
        <p className="text-gray-700 font-medium">Instructions:</p>
        <p className="text-gray-600">{recipe.instructions}</p>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(recipe.id)} // Assuming recipe.id is used for identification
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
      >
        Delete
      </button>

      {/* Username Display */}
      <p className="text-gray-600 text-sm mt-2">BY <span className="font-semibold">{recipe.username}</span></p>
    </div>
  );
};

export default RecipeCard;
