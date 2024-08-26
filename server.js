const inquirer = require('inquirer');
const db = require('./config/db');
const { 
    viewDepartments, 
    addDepartment, 
    pdateEmployeeRole, 
} = require('./models');