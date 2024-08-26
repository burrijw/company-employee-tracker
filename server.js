const inquirer = require('inquirer');
const db = require('./config/db');
const Department = require('./models/department');
const Employee = require('./models/employee');
const Role = require('./models/role');

const startApp = async () => {
    try {
        console.log(" .-------------------------------------------------------------------------------------------------.");
        console.log("|   _________    _______           __           ______     ___  ____     _________     _______      |");
        console.log("|  |  _   _  |  |_   __ \\         /  \\        .' ___  |   |_  ||_  _|   |_   ___  |   |_   __ \\     |");
        console.log("|  |_/ | | \\_|    | |__) |       / /\\ \\      / .'   \\_|     | |_/ /       | |_  \\_|     | |__) |    |");
        console.log("|      | |        |  __ /       / ____ \\     | |            |  __'.       |  _|  _      |  __ /     |");
        console.log("|     _| |_      _| |  \\ \\_   _/ /    \\ \\_   \\ `.___.'\\    _| |  \\ \\_    _| |___/ |    _| |  \\ \\_   |");
        console.log("|    |_____|    |____| |___| |____|  |____|   `._____'    |____||____|  |_________|   |____| |___|  |");
        console.log("|                                                                                                   |");
        console.log(" '-------------------------------------------------------------------------------------------------'");
        
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role'
                ]
            }
        ]);

        switch (answers.action) {
            case 'View all departments':
                const departments = await Department.getAllDepartments();
                console.table(departments);
                break;

            case 'View all roles':
                const roles = await Role.getAllRoles();
                console.table(roles);
                break;

            case 'View all employees':
                const employees = await Employee.getAllEmployees();
                console.table(employees);
                break;

            case 'Add a department':
                const { departmentName } = await inquirer.prompt([
                    { type: 'input', name: 'departmentName', message: 'Enter the name of the department:' }
                ]);
                await Department.addDepartment(departmentName);
                console.log('Department added.');
                break;

            case 'Add a role':
                const { roleTitle, roleSalary, roleDepartmentId } = await inquirer.prompt([
                    { type: 'input', name: 'roleTitle', message: 'Enter the role title:' },
                    { type: 'number', name: 'roleSalary', message: 'Enter the salary:' },
                    { type: 'number', name: 'roleDepartmentId', message: 'Enter the department ID:' }
                ]);
                await Role.addRole(roleTitle, roleSalary, roleDepartmentId);
                console.log('Role added.');
                break;

            case 'Add an employee':
                const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
                    { type: 'input', name: 'firstName', message: 'Enter the employee’s first name:' },
                    { type: 'input', name: 'lastName', message: 'Enter the employee’s last name:' },
                    { type: 'number', name: 'roleId', message: 'Enter the role ID:' },
                    { type: 'number', name: 'managerId', message: 'Enter the manager’s ID (if any):', default: null }
                ]);
                await Employee.addEmployee(firstName, lastName, roleId, managerId);
                console.log('Employee added.');
                break;

            case 'Update an employee role':
                const { employeeId, newRoleId } = await inquirer.prompt([
                    { type: 'number', name: 'employeeId', message: 'Enter the ID of the employee to update:' },
                    { type: 'number', name: 'newRoleId', message: 'Enter the new role ID:' }
                ]);
                await Employee.updateEmployeeRole(employeeId, newRoleId);
                console.log('Employee role updated.');
                break;
        }

        // Restart application for more actions
        startApp();
        
    } catch (error) {
        console.error('Error:', error);
    }
};

startApp();
