import type { List, Todo, TodoUpdate, Share } from '../entities';
import type { Executor } from './pg.js';
export declare type SearchResult = {
    id: string;
    rowversion: number;
};
export declare type ClientGroupRecord = {
    id: string;
    userID: string;
    cvrVersion: number;
};
export declare type ClientRecord = {
    id: string;
    clientGroupID: string;
    lastMutationID: number;
};
export declare type Affected = {
    listIDs: string[];
    userIDs: string[];
};
export declare type UserRecord = {
    userID: string;
    username: string;
    ghRepoName: string;
    ghPat: string;
    ghPatExpiry: Date;
};
export declare function createList(executor: Executor, userID: string, list: List): Promise<Affected>;
export declare function deleteList(executor: Executor, userID: string, listID: string): Promise<Affected>;
export declare function searchLists(executor: Executor, { accessibleByUserID }: {
    accessibleByUserID: string;
}): Promise<SearchResult[]>;
export declare function getLists(executor: Executor, listIDs: string[]): Promise<{
    id: string;
    title: string;
    ownerID: string;
}[]>;
export declare function createShare(executor: Executor, userID: string, share: Share): Promise<Affected>;
export declare function deleteShare(executor: Executor, userID: string, id: string): Promise<Affected>;
export declare function searchShares(executor: Executor, { listIDs }: {
    listIDs: string[];
}): Promise<SearchResult[]>;
export declare function getShares(executor: Executor, shareIDs: string[]): Promise<{
    id: string;
    listID: string;
    userID: string;
}[]>;
export declare function createTodo(executor: Executor, userID: string, todo: Omit<Todo, 'sort'>): Promise<Affected>;
export declare function updateTodo(executor: Executor, userID: string, update: TodoUpdate): Promise<Affected>;
export declare function deleteTodo(executor: Executor, userID: string, todoID: string): Promise<Affected>;
export declare function searchTodos(executor: Executor, { listIDs }: {
    listIDs: string[];
}): Promise<SearchResult[]>;
export declare function mustGetTodo(executor: Executor, id: string): Promise<{
    sort: number;
    description: string;
    id: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    title: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    listID: string;
}>;
export declare function getTodos(executor: Executor, todoIDs: string[]): Promise<{
    sort: number;
    description: string;
    id: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    title: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    listID: string;
}[]>;
export declare function putClientGroup(executor: Executor, clientGroup: ClientGroupRecord): Promise<void>;
export declare function getClientGroup(executor: Executor, clientGroupID: string, userID: string): Promise<ClientGroupRecord>;
export declare function searchClients(executor: Executor, { clientGroupID }: {
    clientGroupID: string;
}): Promise<SearchResult[]>;
export declare function getClient(executor: Executor, clientID: string, clientGroupID: string): Promise<ClientRecord>;
export declare function putClient(executor: Executor, client: ClientRecord): Promise<void>;
export declare function getAccessors(executor: Executor, listID: string): Promise<string[]>;
