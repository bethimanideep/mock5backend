const express = require('express');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { connection, User, Dashboard } = require('./db');
const cors = require("cors")
const app = express();
app.use(express.json());
app.use(cors())
app.get('/', (req, res) => {
    res.json("welcome") 
});
//signup
app.post('/signup', async (req, res) => {
    let { email, password } = req.body
    let user = await User.findOne({ email })
    if (user) res.json("Already exist")
    else {
        let hash = bcrypt.hashSync(password, 10)
        let obj = {
            email,
            password: hash
        }
        let newuser = new User(obj)
        await newuser.save()
        res.json("Registered Succesfully")
    }
});
//login
app.post('/login', async (req, res) => {
    let { email, password } = req.body
    let user = await User.findOne({ email })
    if (!user) res.json("Email not Found")
    else {
        let val = bcrypt.compareSync(password, user.password)
        if (val) {
            const token = jwt.sign({ user }, "masai")
            res.json({ token })
        } else {
            res.json("Invalid password")
        }
    }
});
//dashboard
app.post('/dashboard', async (req, res) => {
    let { lastname, firstname, email, department, salery } = req.body
    let obj = {
        lastname,
        firstname,
        email,
        department,
        salery
    }
    let user = new Dashboard(obj)
    await user.save()
    let data = await Dashboard.find()
    res.json(data)
});
//getdashboarddata
app.get('/getdata', async (req, res) => {
    let data = await Dashboard.find()
    res.json(data)
});
// deleting
app.get('/deleting/:email', async (req, res) => {
    let { email } = req.params
    await Dashboard.findOneAndDelete({ email })
    let data = await Dashboard.find()
    res.json(data)
});
//sorting
app.get('/sorting/:val', async (req, res) => {
    let val = req.params.val
    if (val == "desc") {
        let data = await Dashboard.aggregate([
            { $sort: { salery: -1 } }
        ]);
        res.json(data)
    } else {

        let data = await Dashboard.aggregate([
            { $sort: { salery: 1 } }
        ]);
        res.json(data)
    }
});
//filtering
app.get('/filtering/:val', async (req, res) => {
    let val = req.params.val
    let data = await Dashboard.find({ department: val })
    res.json(data)
});
//search
app.get('/search/:val', async (req, res) => {
    let val = req.params.val;
    try {
      const employees = await Dashboard.find({ firstname: { $regex: `${val}`, $options: 'i' } });
      res.json(employees);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      res.status(500).json({ error: 'Failed to fetch employees' });
    }
  });
  

app.listen(4500, async () => {
    try {
        await connection
        console.log("connected to db")
    } catch (error) {
        console.log(error);
    }
    console.log('Server is running on port 4500 ');
});
