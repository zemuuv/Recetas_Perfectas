import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button,Text, View, FlatList,  TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { useState } from 'react';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';       
import { createNativeStackNavigator } from '@react-navigation/native-stack';  //stack hace una pila de ventanas
import axios from 'axios';  //forma mas facil de conectar con la api no es como el fetch

const Stack = createNativeStackNavigator(); //se inicializa el stac lo que nos permite generar una pila de Screen

//screen principal (HOME)
function HomeScreen({ navigation }) {
const [areas, setAreas] = useState([]); //guarda el estado de las areas

  // hace un request GEY a la api de recetas para clasificar recetas por region
   useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
        setAreas(response.data.meals); // Guardamos el array de áreas
      } catch (error) {
        console.error("Error al obtener áreas:", error);
      }
    };

    fetchAreas();
  }, []);

  //genera la lista de paises que trajo la api en el GET
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Recetas por region</Text>
      <FlatList
        data={areas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('Paises', { area: item.strArea })}//al presionar el pais lo redirige a la Screen de paises
            >
              <Text style={styles.item}>{item.strArea}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

//Screen de paises se ven las recetas del pais seleccionado
function PaisScreen({ route, navigation }) {
  const { area } = route.params;//guardo el dato del pais seleccionado
  const [meals, setMeals] = useState([]);

  //hace un request GET para trael las recetas del pais seleccionado
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
        );
        setMeals(response.data.meals);
      } catch (error) {
        console.error("Error al obtener platos:", error);
      }
    };

    fetchMeals();
  }, [area]);

//genera lista de recetas del pais consultado con imagenes
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Platos de {area}</Text>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          //al precionar una receta se abre una descripcion de esta y lo redirige a la Screen de recetas 
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

//Screen de recetas, se ve la descripcion de la receta seleccionada
function RecetasScreen ({route}){
  const { recipeName } = route.params;
  const [recipeDetails, setRecipeDetails] = useState([]);

  //hace request GET a la API para que le traga los datos de la receta
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

  //muestra titulo, imagen, pasos, Etc de la receta
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

          {/* Hipervínculo a YouTube */}
          {recipe.strYoutube ? (
            <TouchableOpacity onPress={() => Linking.openURL(recipe.strYoutube)}>
              <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
                Ver video en YouTube
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

//funcion default app aqui inicia la aplicacion es donde carga todo, ahi estan declarados los stack de cada Screen
export default function App() {
   return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Paises' }} />
        <Stack.Screen name="Paises" component={PaisScreen} options={{ title: 'Recetas' }} />
        <Stack.Screen name="Recetas" component={RecetasScreen} options={{ title: 'Recetas' }} />
      </Stack.Navigator>
    </NavigationContainer>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2F', // fondo oscuro elegante
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFD700', // dorado
    textAlign: 'center',
    marginBottom: 20,
  },
  item: {
    fontSize: 18,
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#4B0082', // violeta profundo
    borderRadius: 14,
    textAlign: 'center',
    color: '#FFD700',
    fontWeight: '700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00CED1', // turquesa brillante
    marginVertical: 8,
    padding: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#FF6347', // rojo tomate
  },
  mealName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E1E2F',
  },
  recipeCard: {
    marginBottom: 24,
    padding: 18,
    backgroundColor: '#2E0854', // púrpura oscuro
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFD700', // dorado
    marginBottom: 16,
    textAlign: 'center',
  },
  recipeImage: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#FF6347', // rojo
  },
  recipeText: {
    fontSize: 16,
    color: '#E5E5E5',
    marginBottom: 10,
    lineHeight: 22,
    fontWeight: '500',
  },
});