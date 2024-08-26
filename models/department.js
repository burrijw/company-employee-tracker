const { getAll, addItem } = require('../queries/queries');

class Department {
    static getAllDepartments() {
        return getAll('department');
    }

    static addDepartment(name) {
        return addItem('department', ['name'], [name]);
    }
}

module.exports = Department;