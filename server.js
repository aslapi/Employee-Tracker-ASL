const express = require('express');
const inquirer = require('inquirer');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : false }));

const PORT = process.env.PORT || 3001;

const { Pool } = require('pg');

const pool = new Pool (
    {
        user: 'postgres',
        password: 'mnthunder',
        host: 'localhost',
        database: 'business_db'
    },
    console.log("Connected to business_db!")
)

pool.connect();

app.listen(PORT, () => {
    console.log("Application listening on port " + PORT);
});

const mainMenu = [
    {
        type: 'list',
        name: 'mainMenu',
        message: 'What would you like to do?',
        choices: [
            'Add a department',
            'Add a role',
            'Add an employee',
            'View Departments',
            'View Roles',
            'View Employees',
            'Update an employee role',
            'Exit'
        ]
    }
]

const addDepartment = [
    {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the new department?'
    }
]

const addRole = [
    {
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the new role?'
    }
]