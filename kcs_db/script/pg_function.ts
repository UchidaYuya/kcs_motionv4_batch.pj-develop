import { Client, QueryResult } from "node-postgres";
const copyFrom = require('pg-copy-streams').from;
import { Cursor } from 'pg-cursor';

export function pg_copy_from(c: Client, table_name: string, lines : Array<any>):boolean {
    // const stream = this.m_db.query(copyFrom(`COPY ${table_name} FROM STDIN`))
    // fileStream.on('error', () => { return false })
    // stream.on('error', () => { return false })
    // stream.on('finish', () => { return true })
    // fileStream.pipe(stream)
    return true;
}

export function expDataByCursor(sql:string, filename:string, db:Client):number{
    return 1;
}

//カーソル用
export function pg_cursor_open(c: Client, sql): Cursor {
    const cursor = c.query(new Cursor(sql));
    return cursor;
}

export function pg_cursor_close(c: Cursor){
    c.release();
}

export function pg_fetch_array(cur: Cursor , num:Number) {
    return [];

}

export function pg_fetch_assoc(cur: Cursor, num:Number) {
    return [];
}

export function pg_connect(h:string , port:string , dbname: string , pws:string , user:string): Client
{
    var c = new Client({ 
        user: user,
        host: h,
        database: dbname,
        password: pws,
        port: parseInt(port)
     });
    return c;
}

export async function pg_query(c: Client, sql:string){
    var O_result = await c.query(sql);
    //O_result[0]['charge']
    return O_result;
}

// pg_connect("host=" + ini.db_host + " port=" + ini.db_port + " dbname=" + ini.db_name + " password=" + passwd + " user=" + ini.db_user);
// pg_query(dbh, sql);