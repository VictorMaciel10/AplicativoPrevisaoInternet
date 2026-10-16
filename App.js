import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import PrevisaoScreen from './screens/PrevisaoScreen';
import PorAtividadeScreen from './screens/PorAtividadeScreen';
import { CORES } from './components/cores';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: CORES.primaria,
            tabBarInactiveTintColor: CORES.textoSuave,
            tabBarLabelStyle: { fontSize: 13 },
          }}
        >
          <Tab.Screen
            name="Previsao"
            component={PrevisaoScreen}
            options={{
              title: 'Previsão',
              tabBarAccessibilityLabel: 'Aba Previsão',
              tabBarIcon: ({ color, size }) => <Ionicons name="wifi" size={size} color={color} />,
            }}
          />
          <Tab.Screen
            name="PorAtividade"
            component={PorAtividadeScreen}
            options={{
              title: 'Por atividade',
              tabBarAccessibilityLabel: 'Aba Por atividade',
              tabBarIcon: ({ color, size }) => <Ionicons name="time" size={size} color={color} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
