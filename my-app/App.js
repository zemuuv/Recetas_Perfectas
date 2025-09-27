import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabs from './Navigation/MainTabs';
import DetallesRecetaScreen from './Screens/DetallesRecetaScreen';

const RootStack = createNativeStackNavigator();

export default function App() {
  const [favorites, setFavorites] = useState([]);

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
        return prev.filter((r) => r.idMeal !== recipe.idMeal);
      } else {
        return [...prev, recipe];
      }
    });
  };

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="MainTabs" options={{ headerShown: false }}>
          {(props) => <MainTabs {...props} favorites={favorites} addFavorite={addFavorite} />}
        </RootStack.Screen>
        <RootStack.Screen name="DetallesReceta">
          {(props) => <DetallesRecetaScreen {...props} addFavorite={addFavorite} />}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
