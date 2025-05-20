import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import FavoriteButton from "./FavoriteButton";

const FavoriteList = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const favoriteIds = userSnap.data()?.favorites || [];

        const recipePromises = favoriteIds.map(async (id) => {
          const recipeRef = doc(db, "recipes", id);
          const recipeSnap = await getDoc(recipeRef);
          return recipeSnap.exists() ? { id: recipeSnap.id, ...recipeSnap.data() } : null;
        });

        const recipes = await Promise.all(recipePromises);
        setFavoriteRecipes(recipes.filter(Boolean));
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", fontSize: "1.5rem", color: "#ffeaa7", marginBottom: "20px" }}>
        ❤️ Your Favorite Recipes
      </h2>
      {favoriteRecipes.length > 0 ? (
        favoriteRecipes.map((recipe) => (
          <div
            key={recipe.id}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "15px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "10px",
              marginBottom: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
              fontSize: "13px",
              color: "#333",
            }}
          >
            {recipe.imageUrl && (
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                style={{
                  width: "90px",
                  height: "90px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  flexShrink: 0,
                }}
              />
            )}

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "15px", margin: "0 0 8px" }}>
                {recipe.title || "Untitled Recipe"}
              </h3>

              {recipe.nutrition && (
                <div style={{ marginBottom: "8px" }}>
                  <strong>Nutritional Info:</strong>
                  <ul style={{ listStyleType: "none", paddingLeft: 0, margin: "4px 0" }}>
                    {recipe.nutrition.calories && <li>Calories: {recipe.nutrition.calories}</li>}
                    {recipe.nutrition.protein && <li>Protein: {recipe.nutrition.protein}</li>}
                    {recipe.nutrition.fat && <li>Fat: {recipe.nutrition.fat}</li>}
                    {recipe.nutrition.carbs && <li>Carbs: {recipe.nutrition.carbs}</li>}
                    {recipe.nutrition.vitamins && <li>Vitamins: {recipe.nutrition.vitamins}</li>}
                  </ul>
                </div>
              )}

              <div>
                <strong>Ingredients:</strong>
                <ul style={{ margin: "4px 0 8px 16px", padding: 0 }}>
                  {Array.isArray(recipe.ingredients)
                    ? recipe.ingredients.map((item, idx) => <li key={idx}>{item}</li>)
                    : <li>No ingredients listed.</li>}
                </ul>

                <strong>Instructions:</strong>
                <p style={{ marginTop: "4px" }}>{recipe.instructions || "No instructions provided."}</p>
              </div>

              <div style={{ marginTop: "8px" }}>
                <FavoriteButton recipeId={recipe.id} />
              </div>
            </div>
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center", color: "#777" }}>No favorite recipes found.</p>
      )}
    </div>
  );
};

export default FavoriteList;
