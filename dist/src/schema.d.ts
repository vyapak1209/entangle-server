import type { Executor } from './pg';
export declare function createDatabase(executor: Executor): Promise<void>;
export declare function createSchema(executor: Executor): Promise<void>;
