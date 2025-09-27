import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Screens/HomeScreen';
import PaisScreen from '../Screens/PaisesScreen';
import RecetasScreen from '../Screens/RecetasScreen';

const HomeStackNav = createNativeStackNavigator();

export default function HomeStack({ addFavorite }) {
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
