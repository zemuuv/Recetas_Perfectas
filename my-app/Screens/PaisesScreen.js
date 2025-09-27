import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import styles from '../Styles';

export default function PaisScreen({ route, navigation }) {
  const { area } = route.params;
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        setMeals(response.data.meals);
      } catch (error) {
        console.error("Error al obtener platos:", error);
      }
    };
    fetchMeals();
  }, [area]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Platos de {area}</Text>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Recetas', { recipeName: item.strMeal })}>
            <View style={styles.mealItem}>
              <Image source={{ uri: item.strMealThumb }} style={styles.mealImage} />
              <Text style={styles.mealName}>{item.strMeal}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
