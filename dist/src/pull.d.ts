import type { PullResponse } from 'replicache';
import type Express from 'express';
export declare function pull(userID: string, requestBody: Express.Request): Promise<PullResponse>;
