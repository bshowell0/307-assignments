import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userModel from "./user.js";

const app = express();
const port = 8000;

app.use(cors());

app.use(express.json());

mongoose.set("debug", true);

mongoose
    .connect("mongodb://127.0.0.1:27017/users", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .catch((error) => console.log(error));


function getUsers(name, job) {
    let promise;
    if (name === undefined && job === undefined) {
        promise = userModel.find();
    } else if (name && !job) {
        promise = findUserByName(name);
    } else if (job && !name) {
        promise = findUserByJob(job);
    } else if (job && name) {
        promise = userModel.find({ name: name, job: job });
    }
    return promise;
}


function findUserByName(name) {
    return userModel.find({ name: name });
}

function findUserByJob(job) {
    return userModel.find({ job: job });
}

function findUserById(id) {
    return userModel.findById(id);
}

function addUser(user) {
    const userToAdd = new userModel(user);
    const promise = userToAdd.save();
    return promise;
}

function deleteUser(id) {
    return userModel.findByIdAndDelete(id);
}

export default {
    addUser,
    getUsers,
    findUserById,
    findUserByName,
    findUserByJob,
};

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    getUsers(name, job)
        .then(result => {
            if (result === undefined) {
                res.status(404).send("Resource not found.");
            } else {
            res.send({ users_list: result });
            }
        })
        .catch(error => {
            console.error("Error fetching users by name:", error);
            res.status(500).send({ error: 'Server error' });
        });
});

app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    findUserById(id)
        .then(result => {
            if (result === null) {
                res.status(404).send("Resource not found.");
            } else {
                res.send(result);
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).send({ error: 'Server error' });
        });
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd)
        .then(newUser => {
            res.status(201).send(newUser);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send({ error: 'Server error' });
        });
});

app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    deleteUser(id)
        .then(user => {
            if (user === null) {
                res.status(404).send({ error: "User not found" });
            } else {
                res.status(204).send(user);
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).send({ error: 'Server error' });
        });
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}\nUsers at http://localhost:${port}/users`
    );
});