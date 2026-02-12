#!/usr/bin/env node
/**
 * Debug script to test login credentials
 * Usage: node scripts/testLogin.js <username> <password>
 * Example: node scripts/testLogin.js admin mypassword123
 */

const bcrypt = require('bcrypt')
const mysql = require('mysql2/promise')
require('dotenv').config()

const args = process.argv.slice(2)
if (args.length < 2) {
  console.error('Usage: node scripts/testLogin.js <username> <password>')
  console.error('Example: node scripts/testLogin.js admin mypassword123')
  process.exit(1)
}

const [username, password] = args

async function testLogin() {
  try {
    console.log('\n=== Testing Login Credentials ===')
    console.log('Username:', username)
    console.log('Password:', password)

    // Connect to MySQL
    console.log('\nConnecting to MySQL...')
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'dbms'
    })
    console.log('✓ Connected to MySQL')

    // Query user
    console.log('\nQuerying user...')
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    )
    
    if (rows.length === 0) {
      console.log('✗ User not found in database')
      await connection.end()
      process.exit(1)
    }

    const user = rows[0]
    console.log('✓ User found in database')
    console.log('  Stored hash:', user.password)

    // Test bcrypt comparison
    console.log('\nTesting bcrypt comparison...')
    const match = await bcrypt.compare(password, user.password)
    console.log('Password match:', match ? '✓ YES' : '✗ NO')

    if (match) {
      console.log('\n✓✓✓ Login credentials are valid!')
    } else {
      console.log('\n✗✗✗ Password does not match stored hash')
      console.log('\nTroubleshooting:')
      console.log('1. Make sure you typed the password exactly as you set it')
      console.log('2. Passwords are case-sensitive')
      console.log('3. Try running: node scripts/addUser.js <username> <newpassword>')
      console.log('   to create a new user with a known password')
    }

    await connection.end()
  } catch (err) {
    console.error('✗ Error:', err.message)
    process.exit(1)
  }
}

testLogin()
