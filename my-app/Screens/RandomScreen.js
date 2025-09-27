import { useState, useCallback } from 'react';
import { ScrollView, Text, View, Image, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import styles from '../Styles';

export default function RandomScreen({ addFavorite }) {
  const [recipe, setRecipe] = useState(null);

  const fetchRandomRecipe = async () => {
    try {
      const response = await axios.get("https://www.themealdb.com/api/json/v1/1/random.php");
      setRecipe(response.data.meals[0]);
    } catch (error) {
      console.error("Error al obtener receta random:", error);
    }
  };

  useFocusEffect(useCallback(() => { fetchRandomRecipe(); }, []));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Si no sabes qué cocinar tal vez deberías probar</Text>
      {recipe && (
        <View style={styles.recipeCard}>
          <Text style={styles.recipeTitle}>{recipe.strMeal}</Text>
          <Image source={{ uri: recipe.strMealThumb }} style={styles.recipeImage} />
          <Text style={styles.recipeText}>Categoría: {recipe.strCategory}</Text>
          <Text style={styles.recipeText}>Área: {recipe.strArea}</Text>
          <Text style={styles.recipeText}>Instrucciones: {recipe.strInstructions}</Text>
          <Button title="⭐ Agregar a Favoritos" onPress={() => addFavorite(recipe)} />
          <View style={{ marginTop: 10 }}>
            <Button title="🔄 Otra receta" onPress={fetchRandomRecipe} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}
