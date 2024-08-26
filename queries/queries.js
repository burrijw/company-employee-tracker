const db = require('../config/db');

const getAll = async (table) => {
    const query = `SELECT * FROM ${table}`;
    const result = await db.query(query);
    return result.rows;
};

const addItem = async (table, columns, values) => {
    const query = `
        INSERT INTO ${table} (${columns.join(', ')}) 
        VALUES (${values.map((_, i) => `$${i + 1}`).join(', ')}) 
        RETURNING *
    `;
    const result = await db.query(query, values);
    return result.rows[0];
};

module.exports = {
    getAll,
    addItem,
};