import type { QueryResult } from 'pg';
export declare function withExecutor<R>(f: (executor: Executor) => R): Promise<R>;
export declare type Executor = (sql: string, params?: any[]) => Promise<QueryResult>;
export declare type TransactionBodyFn<R> = (executor: Executor) => Promise<R>;
/**
 * Invokes a supplied function within a transaction.
 * @param body Function to invoke. If this throws, the transaction will be rolled
 * back. The thrown error will be re-thrown.
 */
export declare function transact<R>(body: TransactionBodyFn<R>): Promise<R>;
