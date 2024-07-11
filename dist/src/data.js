export async function createList(executor, userID, list) {
    if (userID !== list.ownerID) {
        throw new Error('Authorization error, cannot create list for other user');
    }
    await executor(`insert into list (id, ownerid, title, lastmodified) values ($1, $2, $3, now())`, [list.id, list.ownerID, list.title]);
    return { listIDs: [], userIDs: [list.ownerID] };
}
export async function deleteList(executor, userID, listID) {
    await requireAccessToList(executor, listID, userID);
    const userIDs = await getAccessors(executor, listID);
    await executor(`delete from list where id = $1`, [listID]);
    return {
        listIDs: [],
        userIDs,
    };
}
export async function searchLists(executor, { accessibleByUserID }) {
    const { rows } = await executor(`select id, xmin as rowversion from list where ownerid = $1 or ` +
        `id in (select listid from share where userid = $1)`, [accessibleByUserID]);
    return rows;
}
export async function getLists(executor, listIDs) {
    if (listIDs.length === 0)
        return [];
    const { rows } = await executor(`select id, title, ownerid from list where id in (${getPlaceholders(listIDs.length)})`, listIDs);
    return rows.map(r => {
        const list = {
            id: r.id,
            title: r.title,
            ownerID: r.ownerid,
        };
        return list;
    });
}
export async function createShare(executor, userID, share) {
    await requireAccessToList(executor, share.listID, userID);
    await executor(`insert into share (id, listid, userid, lastmodified) values ($1, $2, $3, now())`, [share.id, share.listID, share.userID]);
    return {
        listIDs: [share.listID],
        userIDs: [share.userID],
    };
}
export async function deleteShare(executor, userID, id) {
    const [share] = await getShares(executor, [id]);
    if (!share) {
        throw new Error("Specified share doesn't exist");
    }
    await requireAccessToList(executor, share.listID, userID);
    await executor(`delete from share where id = $1`, [id]);
    return {
        listIDs: [share.listID],
        userIDs: [share.userID],
    };
}
export async function searchShares(executor, { listIDs }) {
    if (listIDs.length === 0)
        return [];
    const { rows } = await executor(`select s.id, s.xmin as rowversion from share s, list l where s.listid = l.id and l.id in (${getPlaceholders(listIDs.length)})`, listIDs);
    return rows;
}
export async function getShares(executor, shareIDs) {
    if (shareIDs.length === 0)
        return [];
    const { rows } = await executor(`select id, listid, userid from share where id in (${getPlaceholders(shareIDs.length)})`, shareIDs);
    return rows.map(r => {
        const share = {
            id: r.id,
            listID: r.listid,
            userID: r.userid,
        };
        return share;
    });
}
export async function createTodo(executor, userID, todo) {
    await requireAccessToList(executor, todo.listID, userID);
    const { rows } = await executor(`select max(ord) as maxord from item where listid = $1`, [todo.listID]);
    const maxOrd = rows[0]?.maxord ?? 0;
    await executor(`insert into item (id, listid, title, description, status, priority, ord, lastmodified) values ($1, $2, $3, $4, $5, $6, $7, now())`, [todo.id, todo.listID, todo.title, todo.description, todo.status, todo.priority, maxOrd + 1]);
    return {
        listIDs: [todo.listID],
        userIDs: [],
    };
}
export async function updateTodo(executor, userID, update) {
    const todo = await mustGetTodo(executor, update.id);
    await requireAccessToList(executor, todo.listID, userID);
    await executor(`update item set title = coalesce($1, title), status = coalesce($2, status), description = coalesce($3, description), priority = coalesce($4, priority), ord = coalesce($5, ord), lastmodified = now() where id = $6`, [update.title, update.status, update.description, update.priority, update.sort, update.id]);
    return {
        listIDs: [todo.listID],
        userIDs: [],
    };
}
export async function deleteTodo(executor, userID, todoID) {
    const todo = await mustGetTodo(executor, todoID);
    await requireAccessToList(executor, todo.listID, userID);
    await executor(`delete from item where id = $1`, [todoID]);
    return {
        listIDs: [todo.listID],
        userIDs: [],
    };
}
export async function searchTodos(executor, { listIDs }) {
    if (listIDs.length === 0)
        return [];
    const { rows } = await executor(`select id, xmin as rowversion from item where listid in (${getPlaceholders(listIDs.length)})`, listIDs);
    return rows;
}
export async function mustGetTodo(executor, id) {
    const [todo] = await getTodos(executor, [id]);
    if (!todo) {
        throw new Error('Specified todo does not exist');
    }
    return todo;
}
export async function getTodos(executor, todoIDs) {
    if (todoIDs.length === 0)
        return [];
    const { rows } = await executor(`select id, listid, title, status, description, priority, ord from item where id in (${getPlaceholders(todoIDs.length)})`, todoIDs);
    return rows.map(r => {
        const todo = {
            id: r.id,
            listID: r.listid,
            description: r.description,
            title: r.title,
            status: r.status,
            priority: r.priority,
            sort: r.ord,
        };
        return todo;
    });
}
export async function putClientGroup(executor, clientGroup) {
    const { id, userID, cvrVersion } = clientGroup;
    await executor(`insert into replicache_client_group
      (id, userid, cvrversion, lastmodified)
    values
      ($1, $2, $3, now())
    on conflict (id) do update set
      userid = $2, cvrversion = $3, lastmodified = now()`, [id, userID, cvrVersion]);
}
export async function getClientGroup(executor, clientGroupID, userID) {
    const { rows } = await executor(`select userid, cvrversion from replicache_client_group where id = $1`, [clientGroupID]);
    if (!rows || rows.length === 0) {
        return {
            id: clientGroupID,
            userID,
            cvrVersion: 0,
        };
    }
    const r = rows[0];
    if (r.userid !== userID) {
        throw new Error('Authorization error - user does not own client group');
    }
    return {
        id: clientGroupID,
        userID: r.userid,
        cvrVersion: r.cvrversion,
    };
}
export async function searchClients(executor, { clientGroupID }) {
    const { rows } = await executor(`select id, lastmutationid as rowversion from replicache_client where clientGroupID = $1`, [clientGroupID]);
    return rows;
}
export async function getClient(executor, clientID, clientGroupID) {
    const { rows } = await executor(`select clientgroupid, lastmutationid from replicache_client where id = $1`, [clientID]);
    if (!rows || rows.length === 0)
        return {
            id: clientID,
            clientGroupID: '',
            lastMutationID: 0,
        };
    const r = rows[0];
    if (r.clientgroupid !== clientGroupID) {
        throw new Error('Authorization error - client does not belong to client group');
    }
    return {
        id: r.id,
        clientGroupID: r.clientgroupid,
        lastMutationID: r.lastmutationid,
    };
}
export async function putClient(executor, client) {
    const { id, clientGroupID, lastMutationID } = client;
    await executor(`
      insert into replicache_client
        (id, clientgroupid, lastmutationid, lastmodified)
      values
        ($1, $2, $3, now())
      on conflict (id) do update set
        lastmutationid = $3, lastmodified = now()
      `, [id, clientGroupID, lastMutationID]);
}
export async function getAccessors(executor, listID) {
    const { rows } = await executor(`select ownerid as userid from list where id = $1 union ` +
        `select userid from share where listid = $1`, [listID]);
    return rows.map(r => r.userid);
}
async function requireAccessToList(executor, listID, accessingUserID) {
    const { rows } = await executor(`select 1 from list where id = $1 and (ownerid = $2 or id in (select listid from share where userid = $2))`, [listID, accessingUserID]);
    if (rows.length === 0) {
        throw new Error("Authorization error, can't access list");
    }
}
function getPlaceholders(count) {
    return Array.from({ length: count }, (_, i) => `$${i + 1}`).join(', ');
}
