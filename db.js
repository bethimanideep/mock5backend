require("dotenv").config()
const mongoose = require("mongoose")
const connection = mongoose.connect(process.env.mongodb)
const User = mongoose.model("User", new mongoose.Schema({}, { versionKey: false, strict: false }));

const Dashboard = mongoose.model("Dashboard", new mongoose.Schema({}, { versionKey: false, strict: false }));

module.exports = {
    connection, User, Dashboard
}