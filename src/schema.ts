import type { Executor } from './pg';

const schemaVersion = 7;

export async function createDatabase(executor: Executor) {
  console.log('creating database');
  const actualSchemaVersion = await getSchemaVersion(executor);
  if (schemaVersion !== actualSchemaVersion) {
    await createSchema(executor);
  }
}

export async function createSchema(executor: Executor) {
  await executor(
    `drop table if exists replicache_meta, replicache_client_group,
    replicache_client, list, share, item cascade`,
  );

  await executor(
    'create table replicache_meta (key text primary key, value json)',
  );
  await executor(
    "insert into replicache_meta (key, value) values ('schemaVersion', $1)",
    [schemaVersion],
  );

  await executor(`create table entangle_user (
    userid varchar(36) not null,
    username varchar(36) not null,
    gh_repo_name varchar(36),
    gh_pat varchar(255),
    gh_pat_expiry timestamp(6),
    lastmodified timestamp(6) not null
    )`);

  await executor(`create table replicache_client_group (
    id varchar(36) primary key not null,
    userid varchar(36) not null,
    cvrversion integer not null,
    lastmodified timestamp(6) not null
    )`);

  await executor(`create table replicache_client (
    id varchar(36) primary key not null,
    clientgroupid varchar(36) not null,
    lastmutationid integer not null,
    lastmodified timestamp(6) not null
    )`);

  await executor(`create table list (
    id varchar(36) primary key not null,
    ownerid varchar(36) not null,
    title text not null,
    lastmodified timestamp(6) not null
    )`);

  await executor(`create table share (
    id varchar(36) primary key not null,
    listid varchar(36) not null,
    userid varchar(36) not null,
    lastmodified timestamp(6) not null
    )`);
    
    await executor(`do $$ begin
    if not exists (select 1 from pg_type where typname = 'status_enum') then
        create type status_enum as enum ('TODO', 'IN_PROGRESS', 'DONE');
    end if;
  end $$;`);

  await executor(`do $$ begin
    if not exists (select 1 from pg_type where typname = 'priority_enum') then
        create type priority_enum as enum ('HIGH', 'MEDIUM', 'LOW');
    end if;
  end $$;`);

  await executor(`create table item (
    id varchar(36) primary key not null,
    listid varchar(36) not null,
    title text not null,
    description text,
    status status_enum not null default 'TODO',
    priority priority_enum not null default 'LOW',
    ord integer not null,
    lastmodified timestamp(6) not null
    )`);
}

async function getSchemaVersion(executor: Executor) {
  const metaExists = await executor(`select exists(
    select from pg_tables where schemaname = 'public' and tablename = 'replicache_meta')`);
  if (!metaExists.rows[0].exists) {
    return 0;
  }
  const qr = await executor(
    `select value from replicache_meta where key = 'schemaVersion'`,
  );
  return qr.rows[0].value;
}
