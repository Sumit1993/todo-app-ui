'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent } from '@mui/material';

interface Todo {
  id: number;
  todo: string;
}

const fetchTodos = async (): Promise<Todo[]> => {
  // Adjust the URL as needed (e.g., using an Ingress or service URL in Kubernetes)
  const { data } = await axios.get('http://nextjs.local/api/todos');
  return data.todos; // Assumes the response has a "todos" property
};

export default function TodoList() {
  const { data, error, isLoading } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading todos.</p>;

  return (
    <div>
      {data?.map((todo) => (
        <Card key={todo.id} sx={{ marginBottom: 2 }}>
          <CardContent>{todo.todo}</CardContent>
        </Card>
      ))}
    </div>
  );
}
