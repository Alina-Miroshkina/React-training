import React, { useState, useEffect, useCallback } from 'react';
import styles from './RecipeApp.module.css'; // Импорт CSS модуля

const RecipeApp = () => {
  const [randomNumber, setRandomNumber] = useState(() => Math.floor(Math.random() * 1000));
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRandomRecipe = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const randomId = Math.floor(Math.random() * 100) + 1;
      const response = await fetch(`https://dummyjson.com/recipes/${randomId}`);

      if (!response.ok) {
        throw new Error('Рецепт не найден');
      }

      const data = await response.json();
      setCurrentRecipe(data);
      setRandomNumber(Math.floor(Math.random() * 1000));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRandomRecipe();
  }, [fetchRandomRecipe]);

  return (
    <div className={styles.container}>
      <h2 className={styles.counter}>Случайное число: {randomNumber}</h2>

      <button
        onClick={fetchRandomRecipe}
        className={styles.button}
        disabled={loading}
      >
        {loading ? 'Загрузка...' : 'Получить новый рецепт'}
      </button>

      {error && <p className={styles.error}>Ошибка: {error}</p>}

      {loading && !currentRecipe && (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
          <p>Идет загрузка рецепта...</p>
        </div>
      )}

      {currentRecipe && (
        <div className={styles.recipeCard}>
          <h3 className={styles.recipeTitle}>{currentRecipe.name}</h3>
          <img
            src={currentRecipe.image}
            alt={currentRecipe.name}
            className={styles.recipeImage}
            loading="lazy"
          />
          <div className={styles.recipeMeta}>
            <span title="Время приготовления">
              ⏱️ {currentRecipe.prepTimeMinutes + currentRecipe.cookTimeMinutes} мин
            </span>
            <span title="Количество порций">🍽️ {currentRecipe.servings}</span>
            <span title="Рейтинг">⭐ {currentRecipe.rating}</span>
            <span title="Сложность">⚡ {currentRecipe.difficulty}</span>
          </div>
          
          <div className={styles.recipeDetails}>
            <div className={styles.ingredientsSection}>
              <h4>Ингредиенты:</h4>
              <ul className={styles.ingredientsList}>
                {currentRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            
            <div className={styles.instructionsSection}>
              <h4>Инструкции:</h4>
              <ol className={styles.instructionsList}>
                {currentRecipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeApp;