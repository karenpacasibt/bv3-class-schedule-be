const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../config/config');

async function runSqlFiles(folder) {
    const dirPath = path.join(__dirname, folder);
    const table = mysql.escapeId(folder);

    // Conexion propia con multipleStatements: un .sql puede tener varias sentencias.
    const connection = await mysql.createConnection({
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name,
        multipleStatements: true
    });

    try {
        await connection.query(
            `CREATE TABLE IF NOT EXISTS ${table} (
                name VARCHAR(255) NOT NULL PRIMARY KEY,
                executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )`
        );

        const [rows] = await connection.query(`SELECT name FROM ${table}`);
        const executed = new Set(rows.map(row => row.name));

        const pending = fs.readdirSync(dirPath)
            .filter(file => file.endsWith('.sql') && !executed.has(file))
            .sort();

        if (pending.length === 0) {
            console.log(`${folder}: nothing to run`);
            return;
        }

        for (const file of pending) {
            const sql = fs.readFileSync(path.join(dirPath, file), 'utf-8');

            try {
                await connection.query(sql);
            } catch (err) {
                throw new Error(`${file}: ${err.message}`);
            }

            await connection.query(`INSERT INTO ${table} (name) VALUES (?)`, [file]);
            console.log(`${folder}: ${file}`);
        }
    } finally {
        await connection.end();
    }
}

module.exports = runSqlFiles;
