import db from "../db/db.js";

const TABLE_NAMES = Object.freeze(["department", "role", "employee"]);

/**
 * Checks if the provided table name is valid.
 *
 * @param {string} table - The name of the table to validate.
 * @throws {Error} If the table name is not valid.
 */
function isValidTableName(table) {
  if (TABLE_NAMES.includes(table)) {
    return;
  } else {
    throw new Error(`The table name ${table} is not valid.`);
  }
}

/**
 * Retrieves all rows from the specified table.
 *
 * @param {string} table - The name of the table to retrieve data from.
 * @returns {Promise<Array>} A promise that resolves to an array of rows from the table.
 * @throws {Error} If the table name is not valid.
 */
export async function getAll(table) {
  isValidTableName(table);
  const query = `SELECT * FROM ${table}`;
  const result = await db.query(query);
  return result.rows;
}

/**
 * Adds a new item to the specified table.
 *
 * @param {string} table - The name of the table to insert data into.
 * @param {Array<string>} columns - An array of column names where the data will be inserted.
 * @param {Array<any>} values - An array of values corresponding to the columns.
 * @returns {Promise<Object>} A promise that resolves to the inserted row.
 * @throws {Error} If the table name is not valid.
 */
export async function addItem(table, columns, values) {
  isValidTableName(table);
  const query = `
        INSERT INTO ${table} (${columns.join(", ")})
        VALUES (${values.map((_, i) => `$${i + 1}`).join(", ")})
        RETURNING *
    `;
  const result = await db.query(query, values);
  return result.rows[0];
}
