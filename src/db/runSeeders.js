const runSqlFiles = require('./runSqlFiles');

// npm run seed
(async () => {
    try {
        await runSqlFiles('seeders');
        console.log('Seeders complete');
    } catch (err) {
        console.error('Seeding failed:', err.message);
        process.exitCode = 1;
    }
})();
