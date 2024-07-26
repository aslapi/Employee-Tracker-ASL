const inquirer = require('inquirer');
const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// Connecting to the business_db database
const pool = new Pool({
    user: 'postgres',
    password: 'mnthunder',
    host: 'localhost',
    database: 'business_db'
});

// Connecting to the database
pool.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Main menu questions
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

// Questions when adding a new department
const addDepartmentQuestions = [
    {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department?'
    }
];

// Questions when adding a new role
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

// Questions when adding a new employee
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
        name: 'roleId',
        message: 'Role ID of employee?'
    }
];

// Main menu for the application
function mainMenu() {
    inquirer.prompt(mainQuestions).then((answers) => {
        switch (answers.menuSelection) {
            // Add new department to the database
            case 'Add a department':
                inquirer.prompt(addDepartmentQuestions).then((answers) => {
                    pool.query('INSERT INTO department (department_name) VALUES ($1)', [answers.departmentName], (error, results) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Department added successfully!');
                        }
                        mainMenu();
                    });
                });
                break;
            // Add new role to the database
            case 'Add a role':
                inquirer.prompt(addRoleQuestions).then((answers) => {
                    pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answers.roleTitle, answers.employeeSalary, answers.roleDepartment], (error, results) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Role added successfully!');
                        }
                        mainMenu();
                    });
                });
                break;
            // Add new employee to the database
            case 'Add an employee':
                inquirer.prompt(addEmployeeQuestions).then((answers) => {
                    pool.query('INSERT INTO employee (first_name, last_name, role_id) VALUES ($1, $2, $3)', [answers.employeeFirstName, answers.employeeLastName, answers.roleId], (error, results) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Employee added successfully!');
                        }
                        mainMenu();
                    });
                });
                break;
            // View all departments in the database
            case 'View departments':
                pool.query('SELECT * FROM department', (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.table(results.rows);
                    }
                    mainMenu();
                });
                break;
            // View all roles in the database
            case 'View roles':
                pool.query('SELECT * FROM role', (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.table(results.rows);
                    }
                    mainMenu();
                });
                break;
            // View all employees in the database
            case 'View employees':
                pool.query('SELECT * FROM employee', (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.table(results.rows);
                    }
                    mainMenu();
                });
                break;
            // Exit the application
            case 'Exit':
                console.log('Goodbye!');
                pool.end();
                break;
        }
    });
}

mainMenu();
