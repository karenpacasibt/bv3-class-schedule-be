const createDatabase = require('./createDatabase');
const runSqlFiles = require('./runSqlFiles');

// npm run migrate
(async () => {
    try {
        await createDatabase();
        await runSqlFiles('migrations');
        console.log('Migrations complete');
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exitCode = 1;
    }
})();
