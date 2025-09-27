import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeStack from './HomeStack';
import FavoritosScreen from '../Screens/FavoritosScreen';
import RandomScreen from '../Screens/RandomScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs({ favorites, addFavorite }) {
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
