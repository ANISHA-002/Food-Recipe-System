import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Reusable input component
const Input = ({ label, value, onChange, placeholder }) => (
  <div>
    <label style={{ fontWeight: 'bold', color: '#fff' }}>{label}</label><br />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
      required
    />
  </div>
);

// Reusable textarea component
const Textarea = ({ label, value, onChange }) => (
  <div>
    <label style={{ fontWeight: 'bold', color: '#fff' }}>{label}</label><br />
    <textarea
      rows="6"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      style={{ ...inputStyle, resize: 'vertical' }}
    />
  </div>
);

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  color: '#000',
  backgroundColor: '#fff'
};

const AddRecipe = () => {
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setSubmittedBy(currentUser.displayName || currentUser.email || '');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'recipes'), {
        title,
        ingredients: ingredients.split(',').map(item => item.trim()),
        instructions,
        imageUrl,
        nutrition: {
          calories,
          protein,
          fat,
        },
        createdBy: user?.uid || 'anonymous',
        submittedBy: submittedBy || user?.displayName || user?.email || 'anonymous',
        createdAt: new Date()
      });

      alert('Recipe added successfully!');
      setTitle('');
      setIngredients('');
      setInstructions('');
      setImageUrl('');
      setCalories('');
      setProtein('');
      setFat('');
      setSubmittedBy(user?.displayName || user?.email || '');
    } catch (error) {
      console.error('Error adding recipe: ', error);
    }
  };

  if (!user) {
    return (
      <div style={{
        color: '#fff',
        backgroundColor: '#000',
        padding: '40px',
        borderRadius: '12px',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '60px auto'
      }}>
        <h2>🔒 Please log in to add a recipe</h2>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '30px',
      backgroundColor: '#000000',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      color: '#fff',
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '24px',
        color: '#fff'
      }}>
        📝 Add New Recipe
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input label="Recipe Title:" value={title} onChange={setTitle} />
        <Input label="Submitted By:" value={submittedBy} onChange={setSubmittedBy} placeholder="Your name or alias" />
        <Input label="Ingredients (comma separated):" value={ingredients} onChange={setIngredients} />
        <Textarea label="Instructions:" value={instructions} onChange={setInstructions} />
        <Input label="Image URL:" value={imageUrl} onChange={setImageUrl} placeholder="https://example.com/image.jpg" />
        <Input label="Calories:" value={calories} onChange={setCalories} />
        <Input label="Protein:" value={protein} onChange={setProtein} />
        <Input label="Fat:" value={fat} onChange={setFat} />

        <button
          type="submit"
          style={{
            padding: '12px',
            backgroundColor: '#6c5ce7',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '10px',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#5a4ecb')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#6c5ce7')}
        >
          ➕ Add Recipe
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;
