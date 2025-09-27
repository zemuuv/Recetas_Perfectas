
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para persistencia local (almacenar info en el dispositivo)
import { NavigationContainer } from '@react-navigation/native'; // Contenedor principal de navegación
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Crea una pila de pantallas tipo "stack"

// Importación de  archivos
import MainTabs from './Navigation/MainTabs'; 
import DetallesRecetaScreen from './Screens/DetallesRecetaScreen';

// Se crea un "Stack Navigator" que contendrá las pantallas principales de la app
const RootStack = createNativeStackNavigator();

export default function App() {
  // Estado que almacena las recetas favoritas
  const [favorites, setFavorites] = useState([]);

  //Efecto para cargar favoritos almacenados al iniciar la app
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

  // Efecto para guardar los favoritos cada vez que cambie el estado "favorites"
  useEffect(() => {
    const save = async () => {
      try {
        // Convierte la lista de favoritos a JSON y la guarda bajo la clave '@favorites'
        await AsyncStorage.setItem('@favorites', JSON.stringify(favorites));
      } catch (e) {
        console.error("Error guardando favoritos:", e);
      }
    };
    save();
  }, [favorites]); // Se ejecuta cada vez que `favorites` cambia

  //Función para añadir o quitar recetas de favoritos
  const addFavorite = (recipe) => {
    setFavorites((prev) => {
      // Si la receta ya está en favoritos, la elimina
      if (prev.some((r) => r.idMeal === recipe.idMeal)) {
        return prev.filter((r) => r.idMeal !== recipe.idMeal);
      } else {
        // Si no está, la agrega a la lista
        return [...prev, recipe];
      }
    });
  };

  //Definición de la navegación principal de la app
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {/* Pantalla principal con pestañas (MainTabs).
            Se pasa el estado de favoritos y la función addFavorite como props */}
        <RootStack.Screen name="MainTabs" options={{ headerShown: false }}>
          {(props) => <MainTabs {...props} favorites={favorites} addFavorite={addFavorite} />}
        </RootStack.Screen>

        {/* Pantalla de detalles de una receta.
            También recibe la función addFavorite para permitir marcar como favorita */}
        <RootStack.Screen name="DetallesReceta">
          {(props) => <DetallesRecetaScreen {...props} addFavorite={addFavorite} />}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

