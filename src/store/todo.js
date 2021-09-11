import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
    name: "todos",
    initialState: {
        list: [],
        loading: false,
        lastFetch: null
    },
    reducers: {
        todosRequested: (todos) => {
            todos.loading = true
        },
        todosReceived: (todos, action) => {
            todos.list = action.payload;
            todos.loading = false;
            todos.lastFetch = Date.now();
        },
        todosRequestFailed: (todos) => {
            todos.loading = false
        },
        addedTodo: (todos, action) => {
            todos.push(action.payload)
        },
        updatedTodo: (todos, action) => {
            const { id } = action.payload;
            const index = todos.list.findIndex(bug => bug.id === id);
            todos.list[index].resolved = true

        }
    }
})

const { addedTodo, updatedTodo, todosReceived, todosRequested, todosRequestFailed } = slice.actions;
export default slice.reducer;

//Action Creators
export const loadTodo = () => (dispatch, getState) => {
    const { lastFetch } = getState().entities.todos;

    const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
    if (diffInMinutes < 10) return;

    apiCallBegan({
        url: "/todo",
        onStart: todosRequested.type,
        onSuccess: todosReceived.type,
        onError: todosRequestFailed.type
    })
}

export const addTodo = todo => apiCallBegan({
    url: "/addtodo",
    method: "post",
    data: todo,
    onSuccess: addedTodo.type,
})

export const updateTodo = id => apiCallBegan({
    url: `/updatetodo/${id}`,
    method: "patch",
    onSuccess: updatedTodo.type,
})

//Selectors
//Memoization
export const getUnresolvedBug = createSelector(
    state => state.entities.todos,
    todos => todos.list.filter(todo => !todo.resolved)
)