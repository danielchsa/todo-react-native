import { TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateTodoReducer } from "../redux/todosSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Checkbox({ id, isCompleted, isToday }) {
  const todos = useSelector((state) => state.todos.todos);
  const dispatch = useDispatch();

  const handleCheck = async () => {
    try {
      dispatch(updateTodoReducer({ id }));
      await AsyncStorage.setItem(
        "@Todos",
        JSON.stringify(
          todos.map((todo) => {
            if (todo.id === id) {
              return { ...todo, isCompleted: !isCompleted };
            }
            return todo;
          })
        )
      );
    } catch (e) {
      console.log(e);
    }
  };
  return isToday ? (
    <TouchableOpacity
      onPress={handleCheck}
      style={isCompleted ? styles.checked : styles.unChecked}
    >
      {isCompleted && <Entypo name="check" size={16} color="#fafafa" />}
    </TouchableOpacity>
  ) : (
    <View style={styles.isToday} />
  );
}

const styles = StyleSheet.create({
  checked: {
    width: 20,
    height: 20,
    marginRight: 13,
    borderRadius: 6,
    backgroundColor: "#262626",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
    shadowColor: "#000", // ios && android
    shadowOffset: {
      width: 0,
      height: 2, // ios
    },
    shadowOpacity: 1, // ios
    shadowRadius: 5, // ios
    elevation: 5, // only android
  },
  unChecked: {
    width: 20,
    height: 20,
    marginRight: 13,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 6,
    backgroundColor: "#fff",
    marginLeft: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },

  isToday: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#262626",
    marginRight: 13,
    marginLeft: 15,
  },
});
export default Checkbox;
