const Bookshelf = require( 'bookshelf' )
const Knex = require( 'knex' )

const config = {
    name: 'default',
    client: '',
    host: 'localhost',
    user: 'root',
    password: '',
    database: '',
    charset: 'utf8',
    enableDaemon: true,
    intervalToTryingReconnect: 5000,
    intervalToCheckConnection: 15000,
    maxAttempsReconnect: Infinity
}

const bookshelf = Bookshelf( Knex({
    client: config.client,
    connection: {
        host     : config.host,
        user     : config.user,
        password : config.password,
        database : config.database,
        charset  : config.charset
    },
    pool: {
        min: 0,
        max: 10
    }
}) )

async function verifyConnectionHandler() {
    return bookshelf.knex.raw( 'select 1+1 as results' )
}

module.exports = {
    connector: () => new Promise( async resolve => {
        const database = {
            instance: bookshelf,
            connected: false,
            error: null
        }

        try {
            await verifyConnectionHandler()
            database.connected = true
        } catch ( error ) {
            database.error = error
        } finally {
            resolve( database )
        }
    }),
    config,
    verifyConnectionHandler
}
