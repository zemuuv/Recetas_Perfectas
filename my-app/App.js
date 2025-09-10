import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button,Text, View, FlatList,  TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { useState } from 'react';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';  
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';  //forma mas facil de conectar con la api no es como el fetch
import { Ionicons } from '@expo/vector-icons'; // para iconos bonitos

const RootStack = createNativeStackNavigator(); //se inicializa el stac lo que nos permite generar una pila de Screen
const Tab = createBottomTabNavigator();
const HomeStackNav = createNativeStackNavigator();  

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
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Paises', { area: item.strArea })}>
            <Text style={styles.item}>{item.strArea}</Text>
          </TouchableOpacity>
        )}
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
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
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
function RecetasScreen ({route, addFavorite }){
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

          <TouchableOpacity onPress={() => addFavorite(recipe)}>
            <Text style={{ color: 'red', fontWeight: 'bold', marginTop: 10 }}>
              ❤️ Agregar/Quitar de Favoritos
            </Text>
          </TouchableOpacity>

          {recipe.strYoutube ? (
            <TouchableOpacity onPress={() => Linking.openURL(recipe.strYoutube)}>
              <Text style={{ color: 'blue', textDecorationLine: 'underline', marginTop: 10 }}>
                Ver video en YouTube
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

//Barra de navegación
function HomeStack({ addFavorite }) {
  return (
    <HomeStackNav.Navigator>
      <HomeStackNav.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Inicio' }} />
      <HomeStackNav.Screen name="Paises" component={PaisScreen} options={{ title: 'Paises' }} />
      <HomeStackNav.Screen name="Recetas">
        {(props) => <RecetasScreen {...props} addFavorite={addFavorite} />}
      </HomeStackNav.Screen>
    </HomeStackNav.Navigator>
  );
}


//pagina para visualizar las recetas añadidas a favoritos
function FavoritosScreen({ favorites, navigation }) {
  // Para abrir DetallesReceta en el Stack raíz usamos navigation.getParent()
  const openDetalles = (item) => {
    const parentNav = navigation.getParent(); // debe ser el Stack raíz
    if (parentNav) parentNav.navigate('DetallesReceta', { recipe: item });
    else navigation.navigate('DetallesReceta', { recipe: item }); // fallback
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Recetas Favoritas</Text>
      {favorites.length === 0 ? (
        <Text>No tienes recetas favoritas aún.</Text>
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

//detalles de las recetas favoritas
function DetallesRecetaScreen({ route, addFavorite }) {
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


//encontrar una receta aleatoria
function RandomScreen({ addFavorite }) {
  const [recipe, setRecipe] = useState(null);

  const fetchRandomRecipe = async () => {
    try {
      const response = await axios.get("https://www.themealdb.com/api/json/v1/1/random.php");
      setRecipe(response.data.meals[0]);
    } catch (error) {
      console.error("Error al obtener receta random:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRandomRecipe();
    }, [])
  );

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

          {/* ⭐ Botón de favoritos */}
          <Button title="⭐ Agregar a Favoritos" onPress={() => addFavorite(recipe)} />

          {/* 🔄 Botón para otra receta */}
          <View style={{ marginTop: 10 }}>
            <Button title="🔄 Otra receta" onPress={fetchRandomRecipe} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}


//ayuda en la navegacion entre paginas
function MainTabs({ favorites, addFavorite }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Inicio') iconName = 'home';
          else if (route.name === 'Favoritos') iconName = 'heart';
          else if (route.name === 'Random') iconName = 'shuffle';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio">
        {() => <HomeStack addFavorite={addFavorite} />}
      </Tab.Screen>

      <Tab.Screen name="Favoritos">
        {(props) => <FavoritosScreen {...props} favorites={favorites} />}
      </Tab.Screen>

      <Tab.Screen name="Random">
        {(props) => <RandomScreen {...props} addFavorite={addFavorite} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}





//funcion default app aqui inicia la aplicacion es donde carga todo, ahi estan declarados los stack de cada Screen
export default function App() {
  const [favorites, setFavorites] = useState([]);

  // Cargar favoritos desde AsyncStorage al iniciar
  useEffect(() => {
    const load = async () => {
      try {
        const json = await AsyncStorage.getItem('@favorites');
        if (json) setFavorites(JSON.parse(json));
      } catch (e) {
        console.error("Error cargando favoritos:", e);
      }
    };
    load();
  }, []);

  // Guardar favoritos cada vez que cambian
  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem('@favorites', JSON.stringify(favorites));
      } catch (e) {
        console.error("Error guardando favoritos:", e);
      }
    };
    save();
  }, [favorites]);

  const addFavorite = (recipe) => {
    setFavorites((prev) => {
      if (prev.some((r) => r.idMeal === recipe.idMeal)) {
        // quitar
        return prev.filter((r) => r.idMeal !== recipe.idMeal);
      } else {
        // agregar
        return [...prev, recipe];
      }
    });
  };

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {/* Pantalla principal que contiene Tabs */}
        <RootStack.Screen name="MainTabs" options={{ headerShown: false }}>
          {(props) => <MainTabs {...props} favorites={favorites} addFavorite={addFavorite} />}
        </RootStack.Screen>

        {/* DetallesReceta a nivel raíz para que sea accesible desde cualquier tab */}
        <RootStack.Screen name="DetallesReceta">
          {(props) => <DetallesRecetaScreen {...props} addFavorite={addFavorite} />}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}



//ESTILOS DE LA APLICACION (modificarlos para que queden mas lindos juana y santiago)
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