export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export let todos: Todo[] = [];

export function clearAll() {
  todos = [];
}

export function addTodo(text: string): void {
  // 防御空值与纯空格
  if (!text || text.trim() === '') return;
  
  const newTodo: Todo = {
    id: Date.now(),
    text: text.trim(),
    completed: false
  };
  
  todos = [...todos, newTodo];
}

export function toggleTodo(id: number): void {
  todos = todos.map(t => 
    t.id === id ? { ...t, completed: !t.completed } : t
  );
}