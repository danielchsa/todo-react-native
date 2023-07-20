import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: [],
};

export const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodoReducer: (state, action) => {
      const newTodo = action.payload;
      state.todos = [...state.todos, newTodo];
    },
    setTodosReducer: (state, action) => {
      const todos = action.payload;
      state.todos = todos;
    },
    updateTodoReducer: (state, action) => {
      const todosUpdated = state.todos.map((todo) => {
        if (todo.id === action.payload.id) {
          todo.isCompleted = !todo.isCompleted;
        }

        return todo;
      });
      state.todos = todosUpdated;
    },
    deleteTodoReducer: (state, action) => {
      const { id } = action.payload;
      const todos = state.todos.filter((todo) => todo.id !== id);
      state.todos = todos;
    },
    hideTodosCompleted: (state) => {
      state.todos = state.todos.filter((todo) => !todo.isCompleted);
    },
  },
});

export const {
  addTodoReducer,
  setTodosReducer,
  updateTodoReducer,
  deleteTodoReducer,
  hideTodosCompleted,
} = todosSlice.actions;
export default todosSlice.reducer;
