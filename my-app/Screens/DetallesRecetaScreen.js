import { ScrollView, Text, Image, Button } from 'react-native';
import styles from '../Styles';

export default function DetallesRecetaScreen({ route, addFavorite }) {
  const { recipe } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.strMeal}</Text>
      <Image source={{ uri: recipe.strMealThumb }} style={styles.recipeImage} />
      <Text style={styles.recipeText}>Categoría: {recipe.strCategory}</Text>
      <Text style={styles.recipeText}>Área: {recipe.strArea}</Text>
      <Text style={styles.recipeText}>Instrucciones: {recipe.strInstructions}</Text>
      <Button title="⭐ Agregar/Quitar Favorito" onPress={() => addFavorite(recipe)} />
    </ScrollView>
  );
}
