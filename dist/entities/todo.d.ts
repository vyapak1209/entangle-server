import { z } from 'zod';
import { Update } from '@rocicorp/rails';
import type { ReadTransaction } from 'replicache';
export declare const todoSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    listID: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["TODO", "IN_PROGRESS", "DONE"]>>;
    priority: z.ZodDefault<z.ZodEnum<["LOW", "MEDIUM", "HIGH"]>>;
    sort: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    sort: number;
    description: string;
    id: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    title: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    listID: string;
}, {
    sort: number;
    description: string;
    id: string;
    title: string;
    listID: string;
    priority?: "LOW" | "MEDIUM" | "HIGH" | undefined;
    status?: "TODO" | "IN_PROGRESS" | "DONE" | undefined;
}>;
export declare type Todo = z.infer<typeof todoSchema>;
export declare type TodoUpdate = Update<Todo>;
export declare const putTodo: (tx: import("replicache").WriteTransaction, value: {
    sort: number;
    description: string;
    id: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    title: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    listID: string;
}) => Promise<void>, getTodo: (tx: ReadTransaction, id: string) => Promise<{
    sort: number;
    description: string;
    id: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    title: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    listID: string;
} | undefined>, updateTodo: (tx: import("replicache").WriteTransaction, value: Update<{
    sort: number;
    description: string;
    id: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    title: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    listID: string;
}>) => Promise<void>, deleteTodo: (tx: import("replicache").WriteTransaction, id: string) => Promise<void>, listTodos: (tx: ReadTransaction, options?: import("@rocicorp/rails").ListOptions | undefined) => Promise<{
    sort: number;
    description: string;
    id: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    title: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    listID: string;
}[]>;
export declare function todosByList(tx: ReadTransaction, listID: string): Promise<{
    sort: number;
    description: string;
    id: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    title: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    listID: string;
}[]>;
