import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { increment } from 'firebase/firestore';

const FavoriteButton = ({ recipeId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false); // For button loading state

  // Check if the recipe is already in the user's favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!auth.currentUser) {
        console.log('No user is logged in'); // Log if no user is logged in
        return;
      }
      setLoading(true); // Set loading to true while checking
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        const favorites = userDoc.data()?.favorites || [];
        setIsFavorite(favorites.includes(recipeId)); // Set the favorite status
      } catch (error) {
        console.error("Error fetching user favorites:", error);
      } finally {
        setLoading(false); // Set loading to false after checking
      }
    };

    checkFavoriteStatus(); // Call the function to check if the recipe is in favorites
  }, [recipeId]);

  // Toggle favorite status for the recipe
  const handleFavoriteToggle = async () => {
    if (!auth.currentUser) return; // Prevent operation if no user is logged in
    setLoading(true); // Disable button while operation is ongoing

    const userRef = doc(db, "users", auth.currentUser.uid);
    const recipeRef = doc(db, "recipes", recipeId);

    try {
      if (isFavorite) {
        // Remove from favorites
        await updateDoc(userRef, {
          favorites: arrayRemove(recipeId)
        });
        await updateDoc(recipeRef, {
          favoritesCount: increment(-1) // Decrease favorites count
        });
      } else {
        // Add to favorites
        await updateDoc(userRef, {
          favorites: arrayUnion(recipeId)
        });
        await updateDoc(recipeRef, {
          favoritesCount: increment(1) // Increase favorites count
        });
      }

      setIsFavorite(!isFavorite); // Toggle the state after the operation
    } catch (error) {
      console.error("Error updating favorite status:", error);
    } finally {
      setLoading(false); // Set loading to false after operation
    }
  };

  return (
    <button
      onClick={handleFavoriteToggle}
      disabled={loading}
      style={{
        padding: "10px 20px",
        backgroundColor: loading
          ? "#6c757d" // Gray when processing
          : isFavorite
          ? "#232526,#414345" // Red when it's already a favorite
          : "#28a745", // Green when not yet a favorite
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: loading ? "not-allowed" : "pointer"
      }}
    >
      {loading ? "Processing..." : isFavorite ? "Remove from Favorites" : "Add to Favorites"}
    </button>
  );
};

export default FavoriteButton;
