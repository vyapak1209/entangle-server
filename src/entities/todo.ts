import {z} from 'zod';
import {generate, Update} from '@rocicorp/rails';
import type {ReadTransaction} from 'replicache';

export const todoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  listID: z.string(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('LOW'),
  sort: z.number(),
});

export type Todo = z.infer<typeof todoSchema>;
export type TodoUpdate = Update<Todo>;

export const {
  put: putTodo,
  get: getTodo,
  update: updateTodo,
  delete: deleteTodo,
  list: listTodos,
} = generate('todo', todoSchema.parse);

export async function todosByList(tx: ReadTransaction, listID: string) {
  const allTodos = await listTodos(tx);
  return allTodos.filter(todo => todo.listID === listID);
}
