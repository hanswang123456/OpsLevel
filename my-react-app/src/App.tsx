import React, { useMemo, useRef, useState, type JSX } from "react";
import "./App.css";

type Todo = {
  id: number;
  name: string;
  priority: number;
};

function App(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState<string>("");
  const [priority, setPriority] = useState<string>("");

  const idCounter = useRef<number>(0);

  // Add to do list items
  function addTodo(): void {
    const name = task.trim();
    const p = Number(priority);

    if (!name || Number.isNaN(p) || p < 1) {
      alert("Enter valid task and priority (>= 1)");
      return;
    }

    const newTodo: Todo = {
      id: idCounter.current++,
      name,
      priority: p,
    };

    setTodos((prev) => [...prev, newTodo]);

    setTask("");
    setPriority("");
  }

  // Remove to do list item
  function deleteTodo(id: number): void {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  // sort the items within the list
  const sortedTodos = useMemo<Todo[]>(() => {
    return [...todos].sort((a, b) => a.priority - b.priority);
  }, [todos]);

  // run filter across the existing items
  const missing = useMemo<number[]>(() => {
    if (todos.length === 0) return [];

    const set = new Set<number>(todos.map((t) => t.priority));
    const max = Math.max(...set);

    const res: number[] = [];
    for (let i = 1; i <= max; i++) {
      if (!set.has(i)) res.push(i);
    }

    return res;
  }, [todos]);

  return (
    <div className="container">
      <h1>Priority TODO List</h1>

      {/* INPUT */}
      <div className="input-row">
        <input
          value={task}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTask(e.target.value)
          }
          placeholder="Task name"
        />

        <input
          value={priority}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPriority(e.target.value)
          }
          type="number"
          min={1}
          placeholder="Priority"
        />

        <button onClick={addTodo}>Add</button>
      </div>

      {sortedTodos.length === 0 ? (
        <p>No tasks yet...</p>
      ) : (
        sortedTodos.map((todo: Todo) => (
          <div key={todo.id} className="todo">
            <div>
              <span className="priority">#{todo.priority}</span> {todo.name}
            </div>

            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </div>
        ))
      )}

      {/* MISSING PRIORITIES */}
      <div className="missing-box">
        <strong>Missing Priorities:</strong>{" "}
        {missing.length ? missing.join(", ") : "None"}
      </div>
    </div>
  );
}

export default App;
