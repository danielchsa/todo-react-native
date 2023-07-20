import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

import Checkbox from "./Checkbox";

import moment from "moment/moment";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { deleteTodoReducer } from "../redux/todosSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

function ToDo({ id, text, isCompleted, isToday, hour }) {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todos);

  const handleDelete = async () => {
    dispatch(deleteTodoReducer({ id }));
    try {
      await AsyncStorage.setItem(
        "@Todos",
        JSON.stringify(todos.filter((todo) => todo.id !== id))
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Checkbox id={id} isCompleted={isCompleted} isToday={isToday} />
        <View>
          <Text
            style={
              isCompleted
                ? [
                    styles.text,
                    { textDecorationLine: "line-through", color: "#73737360" },
                  ]
                : styles.text
            }
          >
            {text}
          </Text>
          <Text
            style={
              isCompleted
                ? [
                    styles.time,
                    { textDecorationLine: "line-through", color: "#73737360" },
                  ]
                : styles.time
            }
          >
            {moment(new Date(hour)).format("LT")}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleDelete}>
        <MaterialIcons name="delete-outline" size={24} color="#73737360" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
    color: "#737373",
  },
  time: {
    fontSize: 13,
    fontWeight: "500",
    color: "#a3a3a3",
  },
});
export default ToDo;
