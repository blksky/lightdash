import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
CREATE TABLE IF NOT EXISTS space_database_type (
    dbtype_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    dbtype_name varchar(255) NOT NULL,
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS space_database (
    db_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    space_uuid uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    dbtype_id integer NOT NULL,
    db_url  varchar(255) NOT NULL,
    db_user  varchar(255) NOT NULL,
    db_password  varchar(255) NOT NULL,
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW()
);
`);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
DROP TABLE IF EXISTS
    space_db_type,
    space_db CASCADE;
    `);
}
