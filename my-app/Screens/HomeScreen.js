import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import styles from '../Styles';

export default function HomeScreen({ navigation }) {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
        setAreas(response.data.meals);
      } catch (error) {
        console.error("Error al obtener áreas:", error);
      }
    };
    fetchAreas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recetas por región</Text>
      <FlatList
        data={areas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Paises', { area: item.strArea })}>
            <Text style={styles.item}>{item.strArea}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
