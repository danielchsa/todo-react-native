import { useEffect, useState } from "react";

import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import ToDoList from "../components/ToDoList";

import { hideTodosCompleted, setTodosReducer } from "../redux/todosSlice";

//Redux
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Notifications
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import moment from "moment";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Home({ navigation }) {
  const todos = useSelector((state) => state.todos.todos);
  const dispatch = useDispatch();

  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      console.log("TOKEN", token)
    );

    const getTodos = async () => {
      try {
        const todosSaved = await AsyncStorage.getItem("@Todos");

        if (todosSaved !== null) {
          const todos = JSON.parse(todosSaved);

          const todosFiltered = todos.filter((todo) =>
            moment(new Date(todo.hour)).isSameOrAfter(moment(), "day")
          );

          const checkTodoIsToday = todosFiltered.map((todo) => {
            if (
              moment(new Date(todo.hour)).isSame(moment(), "day") &&
              !todo.isToday
            ) {
              return { ...todo, isToday: true };
            }

            return todo;
          });

          await AsyncStorage.setItem(
            "@Todos",
            JSON.stringify(checkTodoIsToday)
          );
          console.log(
            "Algunos todos han expirado y por lo tanto, han sido eliminados"
          );

          dispatch(setTodosReducer(checkTodoIsToday));
        }
      } catch (e) {
        console.log(e);
      }
    };

    getTodos();
  }, []);

  const handlePress = async () => {
    if (isHidden) {
      const todos = await AsyncStorage.getItem("@Todos");

      if (todos !== null) {
        dispatch(setTodosReducer(JSON.parse(todos)));
        setIsHidden(false);
      }
    } else if (!isHidden && todos.length > 0) {
      dispatch(hideTodosCompleted());
      setIsHidden(true);
    }
  };

  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    if (Device.isDevice) {
      const settings = await Notifications.getPermissionsAsync();
      console.log({ settings });
      const { status: existingStatus } = settings;
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("This is not a physical device.");
    }

    return token;
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://avatars.githubusercontent.com/u/124733878?v=4",
        }}
        style={styles.pic}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.title}>Today</Text>
        <TouchableOpacity onPress={handlePress}>
          <Text style={{ color: "#3478f6" }}>
            {isHidden ? "Show Completed" : "Hide Completed"}
          </Text>
        </TouchableOpacity>
      </View>
      <ToDoList todosData={todos.filter((todo) => todo.isToday)} />

      <Text style={styles.title}>Tomorrow</Text>
      <ToDoList todosData={todos.filter((todo) => !todo.isToday)} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Add")}
      >
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    //paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingTop: 70,
    paddingHorizontal: 15,
  },
  pic: {
    width: 42,
    height: 42,
    alignSelf: "flex-end",
    borderRadius: 21,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 35,
    marginTop: 20,
  },
  button: {
    width: 45,
    height: 45,
    backgroundColor: "#232323",
    borderRadius: 25,
    position: "absolute",
    right: 20,
    bottom: 35,
    elevation: 8,
    shadowColor: "#000",
  },
  plus: {
    fontSize: 35,
    color: "#fff",
    position: "absolute",
    top: -2,
    left: 13,
  },
});
