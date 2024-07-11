import { z } from 'zod';
import { generate } from '@rocicorp/rails';
export const listSchema = z.object({
    id: z.string(),
    title: z.string(),
    ownerID: z.string(),
});
export const { init: createList, list: listLists, get: getList, delete: deleteList, } = generate('list', listSchema.parse);
