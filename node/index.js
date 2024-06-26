const express = require('express');
const axios = require('axios').default;
const mysql = require('mysql');
require('dotenv').config();

class App {
  constructor() {
    this.app = express();
    this.PORT = 3000;
    this.dbConfig = {
      host: 'db',
      user: 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || '',
    };

    this.setupRoutes();
    this.createTable();
  }

  async start() {
    this.app.listen(this.PORT, () => {
      console.log(`Server is running!`);
    });
  }

  setupRoutes() {
    this.app.get('/', async (_req, res) => {
      const name = await this.getRandomName();
      try {
        await this.insertUser(name);
        const users = await this.getAllUsers();
        this.sendResponse(res, users);
      } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send('Error processing request');
      }
    });
  }

  async createTable() {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection(this.dbConfig);
      const CREATE_TABLE_QUERY = `
        CREATE TABLE IF NOT EXISTS people (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL
        )
      `;

      connection.query(CREATE_TABLE_QUERY, (error, _results, _fields) => {
        if (error) {
          reject(error);
          return;
        }
        console.log("Table 'people' created successfully");
        connection.end();
        resolve();
      });
    });
  }

  async getRandomName() {
    const RANDOM_INDEX = Math.floor(Math.random() * 10);
    const response = await axios.get('https://swapi.dev/api/people');
    return response.data.results[RANDOM_INDEX].name;
  }

  async insertUser(name) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection(this.dbConfig);
      const INSERT_USER_QUERY = `INSERT INTO people(name) values('${name}')`;

      connection.query(INSERT_USER_QUERY, (error, _results, _fields) => {
        if (error) {
          reject(error);
          return;
        }
        connection.end();
        resolve();
      });
    });
  }

  async getAllUsers() {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection(this.dbConfig);
      const SELECT_QUERY = `SELECT id, name FROM people`;

      connection.query(SELECT_QUERY, (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        connection.end();
        resolve(results);
      });
    });
  }

  sendResponse(res, users) {
    const tableRows = users
      .map(
        (user) => `
        <tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
        </tr>
      `
      )
      .join('');
    const table = `
      <table>
        <tr>
          <th>#ID</th>
          <th>Name</th>
        </tr>${tableRows}
      </table>`;

    res.send(`
      <h1>Full Cycle Rocks!</h1>
      ${table}
    `);
  }
}

const myApp = new App();
myApp.start();