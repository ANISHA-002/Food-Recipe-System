import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import FavoriteButton from "./FavoriteButton";
import CommentRating from "./CommentRating";
import DeleteRecipeButton from "./DeleteRecipeButton";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "recipes"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (recipes.length === 0) {
      setComments({});
      return;
    }

    const unsubscribes = recipes.map((recipe) => {
      const commentsRef = collection(db, "recipes", recipe.id, "comments");
      const q = query(commentsRef, orderBy("timestamp", "desc"));
      return onSnapshot(q, (snapshot) => {
        const recipeComments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments((prev) => ({
          ...prev,
          [recipe.id]: recipeComments,
        }));
      });
    });

    return () => unsubscribes.forEach((unsub) => unsub());
  }, [recipes]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedRecipes = showAll ? filteredRecipes : filteredRecipes.slice(0, 6);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#fff" }}>
        Loading recipes...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h2
        style={{
          textAlign: "center",
          fontSize: "2rem",
          marginBottom: 20,
          fontWeight: "bold",
          color: "#ffeaa7",
        }}
      >
        🍲 All Recipes
      </h2>

      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: 10,
            width: "60%",
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />
      </div>

      {displayedRecipes.length === 0 ? (
        <p style={{ textAlign: "center", color: "#ffffff" }}>No recipes found.</p>
      ) : (
        displayedRecipes.map((recipe) => {
          const isExpanded = expandedId === recipe.id;
          return (
            <div
              key={recipe.id}
              onClick={() => toggleExpand(recipe.id)}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 20,
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: 10,
                padding: 15,
                marginBottom: 15,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                backgroundColor: isExpanded
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(12px)",
                transition: "all 0.3s ease-in-out",
              }}
            >
              {recipe.imageUrl && (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 8,
                    flexShrink: 0,
                  }}
                />
              )}

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 10px", fontSize: 20, color: "#ffffff" }}>
                  {recipe.title || "Untitled Recipe"}
                </h3>

                {/* Show submittedBy only if present and not empty */}
                {recipe.submittedBy && recipe.submittedBy.trim() !== "" && (
                  <p
                    style={{
                      color: "#ffffff",
                      fontSize: 14,
                      fontStyle: "italic",
                      marginTop: 0,
                      marginBottom: 10,
                    }}
                  >
                    Submitted by: <strong>{recipe.submittedBy}</strong>
                  </p>
                )}

                {recipe.nutrition && (
                  <div style={{ marginBottom: 10, fontSize: 14, color: "#ffffff" }}>
                    <p>
                      <strong>Nutritional Info:</strong>
                    </p>
                    <ul style={{ listStyleType: "none", paddingLeft: 0, margin: 0 }}>
                      {recipe.nutrition.calories && (
                        <li>
                          <strong>Calories:</strong> {recipe.nutrition.calories}
                        </li>
                      )}
                      {recipe.nutrition.protein && (
                        <li>
                          <strong>Protein:</strong> {recipe.nutrition.protein}
                        </li>
                      )}
                      {recipe.nutrition.fat && (
                        <li>
                          <strong>Fat:</strong> {recipe.nutrition.fat}
                        </li>
                      )}
                      {recipe.nutrition.carbs && (
                        <li>
                          <strong>Carbs:</strong> {recipe.nutrition.carbs}
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {isExpanded && (
                  <div style={{ color: "#ffffff" }}>
                    <h4>Ingredients:</h4>
                    <ul style={{ paddingLeft: 20 }}>
                      {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0
                        ? recipe.ingredients.map((item, idx) => <li key={idx}>{item}</li>)
                        : <li>No ingredients provided.</li>}
                    </ul>

                    <h4>Instructions:</h4>
                    <p>{recipe.instructions || "No instructions provided."}</p>

                    <h4>Comments & Ratings</h4>
                    {comments[recipe.id] && comments[recipe.id].length > 0 ? (
                      comments[recipe.id].map((comment) => (
                        <div
                          key={comment.id || Math.random()}
                          style={{
                            marginTop: 10,
                            padding: 10,
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: 6,
                            backgroundColor: "rgba(255, 255, 255, 0.15)",
                            backdropFilter: "blur(6px)",
                          }}
                        >
                          <p style={{ marginBottom: 5 }}>
                            <strong>{comment.userName || "Anonymous"}</strong> rated it{" "}
                            <strong>{comment.rating} / 5</strong>
                          </p>
                          <p style={{ marginLeft: 10 }}>{comment.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p>No comments yet.</p>
                    )}
                    <CommentRating recipeId={recipe.id} />
                  </div>
                )}
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}
                onClick={(e) => e.stopPropagation()} // prevent toggleExpand on button clicks
              >
                <FavoriteButton recipeId={recipe.id} />
                <DeleteRecipeButton recipeId={recipe.id} />
              </div>
            </div>
          );
        })
      )}

      {filteredRecipes.length > 6 && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              padding: "10px 20px",
              fontSize: 16,
              borderRadius: 8,
              border: "none",
              backgroundColor: "#6c5ce7",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeList;
