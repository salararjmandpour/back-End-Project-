const express = require('express');
const router = express.Router();
const Tasks = require("../model/task.model");
const Users = require('../model/user.model');
const ac = require('../tools/ac');
const queryTools = require("../tools/query");
const chalk = require("chalk");
const match = require('nodemon/lib/monitor/match');
//--------------------------------------method GET------------------------------//
//-------------------async , await-------by virtual populate--------------------//
router.get("/", async (req, res) => {
    try {
        const skip = req.query?.skip ? Number(req.query.skip) : 0;
        const limit = (req.query?.limit && req.query.limit <= 5) ? Number(req.query.limit) : 5;
        const match = {};
        if ((req.query?.complete)) {
            match.isComplete = req.query.complete === 'true';
        }
        const userAndTask = await req.user.populate({
            path: 'tasks',
            match,
            options: {
                skip,
                limit
            }
        });
        // const task = await Tasks.find(query);
        console.log(userAndTask);
        res.json(userAndTask.tasks);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

});
//--------------------------------------method POST-------------------------------//
//-----------------------------------------async , await--------------------------------------------//
router.post("/", async (req, res) => {
    try {
        const taskObject = {
            title: req.body.title,
            isComplete: req.body.isComplete,
            user: req.user._id
        }

        const newTask = new Tasks(taskObject);
        if (req.body.description !== undefined) {
            taskObject.description = req.body.description;
        }
        await newTask.save();
        // console.log(newTask);
        res.send(newTask);
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error.message);
    }

});
//---------------------------------method GET by isComplete-------------------------//
// router.get("/complete", (req, res) => {
//     Tasks.find({ isComplete: true }).exec((err, tasks) => {
//         if (err) {
//             console.log(err);
//             return res.sendStatus(500);
//         }
//         if (!tasks) {
//             return res.sendStatus(404);
//         }
//         res.json(tasks);
//     })
// })
// //---------------------------------method GET by inComplete-------------------------//
// router.get("/incomplete", (req, res) => {
//     Tasks.find({ isComplete: false }).exec((err, tasks) => {
//         if (err) {
//             console.log(err);
//             return res.sendStatus(500);
//         }
//         if (!tasks) {
//             return res.sendStatus(404);
//         }
//         res.json(tasks);
//     })
// })
//------------------------------------method GET by id------------------------------//
//-----------------------------get task of user by admin--------------------------//
router.get('/all', ac.checkAdminRoleMiddleware, async (req, res) => {
    try {
        const skip = req.query?.skip ? Number(req.query.skip) : 0;
        const limit = (req.query?.limit && req.query.limit <= 20) ? Number(req.query.limit) : 10;
        const sort = req.query?.sort ? queryTools.createSort(req.query.sort) : {};
        console.log(sort);
        const match = {};
        if ((req.query?.complete)) match.isComplete = req.query.complete === 'true';
        if (req.query?.userId) match.user = req.query.userId;
        const tasks = await Tasks.find(match).skip(skip).limit(limit).sort(sort);
        // console.log(tasks);
        res.json(tasks);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
//-----------------------------------------async , await--------------------------------------------//
router.get("/:id", async (req, res) => {
    try {
        const task = await Tasks.findOne({ user: req.user._id, _id: req.params.id });
        if (!task) return res.sendStatus(404);
        res.json(task);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
//-------------------------------method PUT by id------------------------------------//
router.put("/:id", async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const AllowedToUpdate = ["title", "description", "isComplete"];
        const isValidOperation = updates.every(update => AllowedToUpdate.includes(update));

        if (!isValidOperation) {
            console.log(chalk.bgRed("isValidOperation :" + isValidOperation));
            return res.status(400).send("invalid request! 😕");
        }
        const updateTask = await Tasks.findOneAndUpdate({
            _id: req.params.id,
            user: req.user._id
        }, req.body, { new: true });

        if (!updateTask) return res.sendStatus(404);

        await updateTask.save();
        res.json(updateTask);
        console.log(chalk.green("Successfully Update :)"));

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})
//---------------------------------method DELETE by id-------------------------------//
router.delete("/:id", async (req, res) => {
    try {
        const deleteTask = await Tasks.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });
        if (!deleteTask) {
            return res.sendStatus(404);
            // res.send("ERROR :(");
        }
        res.status(200);
        res.send("Successfully deleted :)");
        console.log(chalk.green("Successfully deleted :)"));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//-----------------------------------------------------------------------------------//
module.exports = router;