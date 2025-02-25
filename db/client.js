require('dotenv').config();
const { Client } = require('pg');
const client = new Client('postgres://localhost:5432/career_sim_golf_reviews');

module.exports = client;