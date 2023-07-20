import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./screens/Home";
import AddToDo from "./screens/AddToDo";

import store from "./redux/store";
import { Provider } from "react-redux";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Add"
            component={AddToDo}
            options={{ animation: "slide_from_right" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

/*
  Pasar props a un componente
  <Stack.Screen name="Add">
          {(props) => <AddToDo msg={"Hi!"} />}
        </Stack.Screen>

        Usar reac memo ya que con esta opcion se eliminan optimizaciones que da
        react navigation

    Otra opcion seria utilizar context

    initialRouteName como prop en Stact.Navigator para indicar cual es la ruta inicial

    screenoptins para estilar todos los encabezados
*/

// TODO: Hacer un custom hook para el async storage
// TODO: Hacer un custom hook para el useSelector y useDispatch
// TODO: Probar el middleware de redux
// TODO: Verificar si estoy utilizando la libreria redux
// TODO: Para redux solo se instala el toolkit y el react-redux
