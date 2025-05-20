import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  updateDoc,
  doc,
  orderBy,
  limit,
} from "firebase/firestore"; // <-- added orderBy, limit
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

const CommentRating = ({ recipeId }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(1);
  const [userComment, setUserComment] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const commentsRef = collection(db, "recipes", recipeId, "comments");

    // Updated query to get only the latest comment by this user
    const q = query(
      commentsRef,
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"), // newest first
      limit(1) // only one comment
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0];
        setUserComment({ id: data.id, ...data.data() });
        setComment(data.data().comment);
        setRating(data.data().rating);
      } else {
        setUserComment(null);
        setComment("");
        setRating(1);
      }
    });

    return () => unsubscribe();
  }, [recipeId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment || rating < 1 || rating > 5 || !user) return;

    try {
      const commentsRef = collection(db, "recipes", recipeId, "comments");

      if (userComment) {
        const commentDoc = doc(db, "recipes", recipeId, "comments", userComment.id);
        await updateDoc(commentDoc, {
          comment,
          rating,
          timestamp: serverTimestamp(),
        });
      } else {
        await addDoc(commentsRef, {
          comment,
          rating,
          userName: user.displayName || user.email || "Anonymous",
          userId: user.uid,
          timestamp: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };

  if (!user) {
    return <p style={{ color: "black" }}>Please log in to leave a comment.</p>;
  }

  return (
    <div onClick={(e) => e.stopPropagation()} style={{ marginTop: "20px" }}>
      {/* Comment Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#000",
          color: "#fff",
          padding: "16px",
          borderRadius: "10px",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block" }}>Rating (1-5):</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
            style={{ padding: "5px", width: "60px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block" }}>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            required
            placeholder="Write your comment..."
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "white",
            color: "black",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {userComment ? "Update" : "Submit"}
        </button>
      </form>

      {/* Show current user's comment ONCE below the form */}
      {userComment && (
        <div
          style={{
            backgroundColor: "#eee",
            padding: "10px",
            marginTop: "20px",
            borderRadius: "6px",
          }}
        >
          <strong>{userComment.userName}</strong> rated it {userComment.rating} / 5
          <p>{userComment.comment}</p>
        </div>
      )}
    </div>
  );
};

export default CommentRating;
