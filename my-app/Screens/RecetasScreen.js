import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import axios from 'axios';
import styles from '../Styles';

export default function RecetasScreen({ route, addFavorite }) {
  const { recipeName } = route.params;
  const [recipeDetails, setRecipeDetails] = useState([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`);
        setRecipeDetails(response.data.meals || []);
      } catch (error) {
        console.error("Error al obtener receta:", error);
      }
    };
    fetchRecipe();
  }, [recipeName]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalles de {recipeName}</Text>
      {recipeDetails.map((recipe) => (
        <View key={recipe.idMeal} style={styles.recipeCard}>
          <Text style={styles.recipeTitle}>{recipe.strMeal}</Text>
          <Image source={{ uri: recipe.strMealThumb }} style={styles.recipeImage} />
          <Text style={styles.recipeText}>Categoría: {recipe.strCategory}</Text>
          <Text style={styles.recipeText}>Área: {recipe.strArea}</Text>
          <Text style={styles.recipeText}>Instrucciones: {recipe.strInstructions}</Text>

          <TouchableOpacity onPress={() => addFavorite(recipe)}>
            <Text style={{ color: 'red', fontWeight: 'bold', marginTop: 10 }}>❤️ Agregar/Quitar de Favoritos</Text>
          </TouchableOpacity>

          {recipe.strYoutube && (
            <TouchableOpacity onPress={() => Linking.openURL(recipe.strYoutube)}>
              <Text style={{ color: 'blue', textDecorationLine: 'underline', marginTop: 10 }}>Ver video en YouTube</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
