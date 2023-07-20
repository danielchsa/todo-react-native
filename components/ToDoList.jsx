import { FlatList } from "react-native";
import { Text } from "react-native";
import ToDo from "./ToDo";

function ToDoList({ todosData }) {
  return (
    <FlatList
      style={{ flexGrow: 0, height: 300 }}
      data={todosData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ToDo {...item} />}
    />
  );
}

export default ToDoList;
