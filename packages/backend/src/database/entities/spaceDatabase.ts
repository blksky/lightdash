import { Knex } from 'knex';

export type DbSpaceDatabaseType = {
    dbtype_id: number;
    dbtype_name: string;
    created_at: Date;
    updated_at: Date;
};

export type CreateDbSpaceDatabaseType = Pick<
    DbSpaceDatabaseType,
    'dbtype_name'
>;

export type SpaceDatabaseTypeTable = Knex.CompositeTableType<
    DbSpaceDatabaseType,
    CreateDbSpaceDatabaseType
>;
export const SpaceDatabaseTypeTableName = 'space_database_type';

export type DbSpaceDatabase = {
    db_id: number;
    space_uuid: string;
    dbtype_id: number;
    db_url: string;
    db_user: string;
    db_password: string;
    created_at: Date;
    updated_at: Date;
};

export type CreateDbSpaceDatabase = Pick<
    DbSpaceDatabase,
    'space_uuid' | 'dbtype_id' | 'db_url' | 'db_user' | 'db_password'
>;

export type SpaceDatabaseTable = Knex.CompositeTableType<
    DbSpaceDatabase,
    CreateDbSpaceDatabase
>;
export const SpaceDatabaseTableName = 'space_database';
