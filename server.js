import inquirer from "inquirer";
import db from "./db/db.js";
import { addItem } from "./utils/utils.js";

const startApp = async () => {
  try {
    console.log(
      " .-------------------------------------------------------------------------------------------------.",
    );
    console.log(
      "|   _________    _______           __           ______     ___  ____     _________     _______      |",
    );
    console.log(
      "|  |  _   _  |  |_   __ \\         /  \\        .' ___  |   |_  ||_  _|   |_   ___  |   |_   __ \\     |",
    );
    console.log(
      "|  |_/ | | \\_|    | |__) |       / /\\ \\      / .'   \\_|     | |_/ /       | |_  \\_|     | |__) |    |",
    );
    console.log(
      "|      | |        |  __ /       / ____ \\     | |            |  __'.       |  _|  _      |  __ /     |",
    );
    console.log(
      "|     _| |_      _| |  \\ \\_   _/ /    \\ \\_   \\ `.___.'\\    _| |  \\ \\_    _| |___/ |    _| |  \\ \\_   |",
    );
    console.log(
      "|    |_____|    |____| |___| |____|  |____|   `._____'    |____||____|  |_________|   |____| |___|  |",
    );
    console.log(
      "|                                                                                                   |",
    );
    console.log(
      " '-------------------------------------------------------------------------------------------------'",
    );

    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ]);

    switch (answers.action) {
      case "View all departments":
        const departments = await db.query(`SELECT * FROM department`);
        console.table(departments.rows);
        break;

      case "View all roles":
        const roles = await db.query(`
          SELECT
            r.id,
            r.title,
            r.salary,
            d.name
            AS department
          FROM role r
            JOIN department d ON r.department_id = d.id`);
        console.table(roles.rows);
        break;

      case "View all employees":
        const employees = await db.query(`
          SELECT
            e.id,
            e.first_name,
            e.last_name,
            r.title AS ROLE,
            d.name AS department,
            r.salary,
            CONCAT(m.first_name, ' ', m.last_name) AS manager
          FROM
            employee e
            JOIN ROLE r ON e.role_id = r.id
            JOIN department d ON r.department_id = d.id
            LEFT JOIN employee m ON e.manager_id = m.id`);
        console.table(employees.rows);
        break;

      case "Add a department":
        const { departmentName } = await prompt([
          {
            type: "input",
            name: "departmentName",
            message: "Enter the name of the department:",
          },
        ]);
        await addItem("department", ["name"], [departmentName]);
        console.log("Department added.");
        break;

      case "Add a role":
        const { roleTitle, roleSalary, roleDepartmentId } = await prompt([
          {
            type: "input",
            name: "roleTitle",
            message: "Enter the role title:",
          },
          {
            type: "number",
            name: "roleSalary",
            message: "Enter the salary:",
          },
          {
            type: "number",
            name: "roleDepartmentId",
            message: "Enter the department ID:",
          },
        ]);
        await addItem(
          "role",
          ["title", "salary", "department_id"],
          [roleTitle, roleSalary, roleDepartmentId],
        );
        console.log("Role added.");
        break;

      case "Add an employee":
        const { firstName, lastName, roleId, managerId } = await prompt([
          {
            type: "input",
            name: "firstName",
            message: "Enter the employee’s first name:",
          },
          {
            type: "input",
            name: "lastName",
            message: "Enter the employee’s last name:",
          },
          { type: "number", name: "roleId", message: "Enter the role ID:" },
          {
            type: "number",
            name: "managerId",
            message: "Enter the manager’s ID (if any):",
            default: null,
          },
        ]);
        await addItem(
          "employee",
          ["first_name", "last_name", "role_id", "manager_id"],
          [firstName, lastName, roleId, managerId],
        );
        console.log("Employee added.");
        break;

      case "Update an employee role":
        const { employeeId, newRoleId } = await prompt([
          {
            type: "number",
            name: "employeeId",
            message: "Enter the ID of the employee to update:",
          },
          {
            type: "number",
            name: "newRoleId",
            message: "Enter the new role ID:",
          },
        ]);
        await db.query(`UPDATE employee SET role_id = $1 WHERE id = $2`, [
          newRoleId,
          employeeId,
        ]);
        console.log("Employee role updated.");
        break;
    }

    // Restart application for more actions
    startApp();
  } catch (error) {
    console.error("Error:", error);
  }
};

startApp();
