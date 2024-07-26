const inquirer = require('inquirer');
const express = require('express');
const { Pool } = require('pg'); // Adjust the path as necessary
// const { mainQuestions, addDepartment, addRole, addEmployee, viewDepartments, viewRoles, viewEmployees, updateEmployeeRole, exit } = require('./questions'); // Adjust the path as necessary

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
    user: 'postgres',
    password: 'mnthunder',
    host: 'localhost',
    database: 'business_db'
});

pool.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const mainQuestions = [
    {
        type: 'list',
        name: 'menuSelection',
        message: 'What would you like to do?',
        choices: [
            'Add a department',
            'Add a role',
            'Add an employee',
            'View departments',
            'View roles',
            'View employees',
            'Exit'
        ]
    }
];

const addDepartmentQuestions = [
    {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department?'
    }
];

const addRoleQuestions = [
    {
        type: 'input',
        name: 'roleTitle',
        message: 'What is the title of the role?'
    },
    {
        type: 'input',
        name: 'employeeSalary',
        message: "What is the employee's salary?"
    },
    {
        type: 'input',
        name: 'roleDepartment',
        message: 'What is the department ID of the role?'
    }
];

const addEmployeeQuestions = [
    {
        type: 'input',
        name: 'employeeFirstName',
        message: 'What is the first name of the employee?'
    },
    {
        type: 'input',
        name: 'employeeLastName',
        message: 'What is the last name of the employee?'
    },
    {
        type: 'input',
        name: 'role_id',
        message: 'Role ID of employee?'
    },
    {
        type: 'input',
        name: 'employeeDepartment',
        message: 'Department ID of employee?'
    }
];

function mainMenu() {
    inquirer.prompt(mainQuestions).then((answers) => {
        switch (answers.menuSelection) {
            case 'Add a department':
            inquirer.prompt(addDepartmentQuestions).then((answers) => {
                    pool.query('INSERT INTO department (name) VALUES ($1)', [answers.departmentName], (error, results) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Department added successfully!');
                        }
                        mainMenu();
                    });
                });
                break;
            case 'Add a role':
                inquirer.prompt(addRoleQuestions).then((answers) => {
                    pool.query('INSERT INTO role (title) VALUES ($1)', [answers.roleName], (error, results) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Role added successfully!');
                        }
                        mainMenu();
                    });
                });
                break;
            case 'Add an employee':
                inquirer.prompt(addEmployeeQuestions).then((answers) => {
                    pool.query('INSERT INTO employee (first_name, last_name) VALUES ($1, $2)', [answers.firstName, answers.lastName], (error, results) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Employee added successfully!');
                        }
                        mainMenu();
                    });
                });
                break;
            case 'View Departments':
                inquirer.prompt(viewDepartments).then((answers) => {
                    switch (answers.viewDepartments) {
                        case 'View All Departments':
                            pool.query('SELECT * FROM department', (error, results) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.table(results.rows);
                                }
                                mainMenu();
                            });
                            break;
                        case 'View Department Budget':
                            pool.query('SELECT department.name, SUM(role.salary) FROM department JOIN role ON department.id = role.department_id GROUP BY department.name', (error, results) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.table(results.rows);
                                }
                                mainMenu();
                            });
                            break;
                    }
                });
                break;
            case 'View Roles':
                inquirer.prompt(viewRoles).then((answers) => {
                    switch (answers.viewRoles) {
                        case 'View All Roles':
                            pool.query('SELECT * FROM role', (error, results) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.table(results.rows);
                                }
                                mainMenu();
                            });
                            break;
                        case 'View Roles by Department':
                            pool.query('SELECT role.title, department.name FROM role JOIN department ON role.department_id = department.id', (error, results) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.table(results.rows);
                                }
                                mainMenu();
                            });
                            break;
                    }
                });
                break;
            case 'View Employees':
                inquirer.prompt(viewEmployees).then((answers) => {
                    switch (answers.viewEmployees) {
                        case 'View All Employees':
                            pool.query('SELECT * FROM employee', (error, results) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.table(results.rows);
                                }
                                mainMenu();
                            });
                            break;
                        case 'View Employees by Manager':
                            pool.query('SELECT employee.first_name, employee.last_name, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name FROM employee JOIN employee AS manager ON employee.manager_id = manager.id', (error, results) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.table(results.rows);
                                }
                                mainMenu();
                            });
                            break;
                        case 'View Employees by Department':
                            pool.query('SELECT employee.first_name, employee.last_name, department.name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id', (error, results) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.table(results.rows);
                                }
                                mainMenu();
                            });
                            break;
                    }
                });
                break;
            case 'Update an employee role':
                inquirer.prompt(updateEmployeeRole).then((answers) => {
                    pool.query('UPDATE employee SET role_id = $1 WHERE first_name = $2 AND last_name = $3', [answers.roleId, answers.employeeFirstName, answers.employeeLastName], (error, results) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Employee role updated successfully!');
                        }
                        mainMenu();
                    });
                });
                break;
            case 'Exit':
                console.log('Goodbye!');
                pool.end();
                break;
        }
    });
}

mainMenu();
