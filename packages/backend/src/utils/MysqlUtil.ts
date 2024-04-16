import knex, { Knex } from 'knex';

export function getMysqlClient(): Knex<any, any> {
    return knex({
        client: 'mysql',
        connection: {
            host: process.env.MYSQLHOST,
            user: process.env.MYSQLUSER,
            password: process.env.MYSQLPASSWORD,
            database: process.env.MYSQLDATABASE,
        },
    });
}

export async function runMysqlQuery(sql: string): Promise<any> {
    const mysqlDb = getMysqlClient();
    return mysqlDb.raw(sql);
}
