// Importamos lo necesario para crear un menú de pestañas (tabs)
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importamos las pantallas que se usarán dentro de las pestañas
import HomeStack from './HomeStack';
import FavoritosScreen from '../Screens/FavoritosScreen';
import RandomScreen from '../Screens/RandomScreen';
import NuevaRecetaScreen from '../Screens/NuevasRecetas';

// Creamos el contenedor de pestañas
const Tab = createBottomTabNavigator();

// Este componente define la barra de navegación inferior con tres pestañas
export default function MainTabs({ favorites, addFavorite }) {
  return (
    <Tab.Navigator
      // Configuramos opciones generales de todas las pestañas
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          // Asigna un ícono distinto según la pestaña
          let iconName;
          if (route.name === 'Inicio') iconName = 'home';
          else if (route.name === 'Favoritos') iconName = 'heart';
          else if (route.name === 'Random') iconName = 'shuffle';
          else if (route.name === 'Nueva receta') iconName = 'create';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Pestaña Inicio: carga la navegación en pila con HomeStack */}
      <Tab.Screen name="Inicio">
        {() => <HomeStack addFavorite={addFavorite} />}
      </Tab.Screen>

      {/* Pestaña Favoritos: muestra la lista de recetas guardadas */}
      <Tab.Screen name="Favoritos">
        {(props) => <FavoritosScreen {...props} favorites={favorites} />}
      </Tab.Screen>

      {/* Pestaña Random: trae una receta aleatoria */}
      <Tab.Screen name="Random">
        {(props) => <RandomScreen {...props} addFavorite={addFavorite} />}
      </Tab.Screen>

      <Tab.Screen name="Nueva receta">
        {(props) => <NuevaRecetaScreen {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
