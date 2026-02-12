#!/usr/bin/env node
/**
 * Helper script to add a user to the MySQL users table
 * Usage: node scripts/addUser.js <username> <password>
 * Example: node scripts/addUser.js admin mypassword123
 */

const bcrypt = require('bcrypt')
const mysql = require('mysql2/promise')
require('dotenv').config()

const args = process.argv.slice(2)
if (args.length < 2) {
  console.error('Usage: node scripts/addUser.js <username> <password>')
  process.exit(1)
}

const [username, password] = args

async function addUser() {
  try {
    const hashed = await bcrypt.hash(password, 10)
    console.log(`Hashed password: ${hashed}`)

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'dbms'
    })

    await connection.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashed]
    )

    console.log(`✓ User '${username}' added successfully`)
    await connection.end()
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  }
}

addUser()
