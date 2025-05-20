import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase"; // Adjust path if needed
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setName(docSnap.data().name || "");
          setPhotoURL(currentUser.photoURL || "");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { name }, { merge: true });

      await updateProfile(user, {
        displayName: name,
      });

      if (photo) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, photo);
        const url = await getDownloadURL(storageRef);

        await updateProfile(user, {
          photoURL: url,
        });

        setPhotoURL(url);
      }

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("An error occurred while updating your profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return <p style={{ color: "#fff", textAlign: "center" }}>Please log in to view your profile.</p>;

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "rgba(255, 255, 255, 0.1)", // translucent light background
        borderRadius: "10px",
        color: "#fff", // white text
        maxWidth: 400,
        margin: "20px auto",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(12px)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Profile Page</h2>

      {/* Display User's Email */}
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      {/* Display and Edit Name */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ color: "#fff" }}>
          <strong>Name:</strong>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            marginLeft: "10px",
            padding: "8px",
            width: "250px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "#fff",
            outline: "none",
          }}
        />
      </div>

      {/* Display and Edit Profile Picture */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ color: "#fff" }}>
          <strong>Profile Picture:</strong>
        </label>
        <input
          type="file"
          onChange={(e) => setPhoto(e.target.files[0])}
          style={{ marginLeft: "10px", color: "#fff" }}
          accept="image/*"
        />
      </div>

      {/* Display Profile Picture */}
      {photoURL && (
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <img
            src={photoURL}
            alt="Profile"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              marginTop: "10px",
              border: "2px solid #fff",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      {/* Show Error Message if Any */}
      {error && (
        <div style={{ color: "red", marginBottom: "20px", textAlign: "center" }}>
          <strong>{error}</strong>
        </div>
      )}

      {/* Save Profile Button */}
      <button
        onClick={handleSave}
        style={{
          padding: "10px 20px",
          backgroundColor: "#6c5ce7",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
          display: "block",
          margin: "0 auto",
          fontWeight: "bold",
          fontSize: "16px",
        }}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}

export default Profile;
