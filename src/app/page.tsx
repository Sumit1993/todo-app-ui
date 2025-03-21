import TodoList from './components/TodoList';

export default function HomePage() {
  return (
    <main style={{ padding: '1rem' }}>
      <h1>Todo List</h1>
      <TodoList />
    </main>
  );
}
