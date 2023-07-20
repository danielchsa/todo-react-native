import { useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Switch,
  Pressable,
  TouchableOpacity,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import { useDispatch, useSelector } from "react-redux";
import { addTodoReducer } from "../redux/todosSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

function AddToDo({ navigation }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [isToday, setIsToday] = useState(false);
  const [show, setShow] = useState(false);
  const [withNotification, setWithNotification] = useState(false);
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todos);

  const addNewTodo = async () => {
    const newTodo = {
      id: Math.floor(Math.random() * 1000000),
      text: name,
      isCompleted: false,
      isToday,
      hour: isToday
        ? date.toISOString()
        : new Date(date.setDate(date.getDate() + 1)).toISOString(),
    };

    try {
      await AsyncStorage.setItem("@Todos", JSON.stringify([...todos, newTodo]));
      dispatch(addTodoReducer(newTodo));
      console.log("Se guardo correctamente");
      if (withNotification) {
        await scheduleNotification(newTodo);
      }
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  const scheduleNotification = async (todo) => {
    const now = new Date().toISOString();

    try {
      if (now > todo.hour) {
        throw new Error("Invalid date");
      }
      const hour = new Date(todo.hour);
      hour.setSeconds(0);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Hey! It's time 😉",
          body: todo.text,
          color: "#FFFFA500", //  #aarrggbb o #rrggbb format
          vibrate: [0, 500, 100, 250],
        },
        trigger: hour,
      });

      console.log(notificationId);
    } catch (e) {
      console.log(e);
      alert("The notification failed to schedule, make sure the hour is valid");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Task</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Task"
          placeholderTextColor={"#00000030"}
          onChangeText={(text) => setName(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Hour</Text>
        <Pressable onPress={() => setShow(true)} style={{ width: "80%" }}>
          <Text
            style={{
              textAlign: "center",
              backgroundColor: "#f1f1f1",
              width: 100,
              alignSelf: "flex-end",
              padding: 10,
              borderRadius: 10,
              fontSize: 16,
            }}
          >{`${date.getHours()}:${
            date.getMinutes() >= 10
              ? date.getMinutes()
              : "0" + date.getMinutes()
          }`}</Text>
        </Pressable>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Today</Text>
        <Switch value={isToday} onValueChange={(value) => setIsToday(value)} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Alert</Text>
        <Switch
          value={withNotification}
          onValueChange={(value) => setWithNotification(value)}
        />
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={"time"}
          is24Hour={false}
          onChange={(_, selectedDate) => {
            setShow(false);
            setDate(selectedDate);
          }}
          onTouchCancel={() => console.log("cancel")}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={addNewTodo}>
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Done
        </Text>
      </TouchableOpacity>
      <Text style={{ color: "#00000060" }}>
        If you disable today, the task will be considerate as tomorrow
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 35,
    marginTop: 10,
  },
  inputTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textInput: {
    borderBottomColor: "#00000030",
    borderBottomWidth: 1,
    width: "80%",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#232323",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
});

export default AddToDo;
