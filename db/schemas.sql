DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    department_name VARCHAR(40) NOT NULL
);

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(40),
    salary INT NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(40),
    last_name VARCHAR(40),
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id)
);