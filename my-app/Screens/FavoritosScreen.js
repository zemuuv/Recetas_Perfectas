import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import styles from '../Styles';

export default function FavoritosScreen({ favorites, navigation }) {
  const openDetalles = (item) => {
    const parentNav = navigation.getParent();
    if (parentNav) parentNav.navigate('DetallesReceta', { recipe: item });
    else navigation.navigate('DetallesReceta', { recipe: item });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Recetas Favoritas</Text>
      {favorites.length === 0 ? (
        <Text style={styles.otherText}>No tienes recetas favoritas aún.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.mealItem} onPress={() => openDetalles(item)}>
              <Image source={{ uri: item.strMealThumb }} style={styles.mealImage} />
              <Text style={styles.mealName}>{item.strMeal}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
