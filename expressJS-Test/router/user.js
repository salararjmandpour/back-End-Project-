const express = require('express');
const router = express.Router();
const Users = require("../model/user.model");
const Tasks = require("../model/task.model");
const queryTools = require("../tools/query");
const chalk = require("chalk");
const ac = require('../tools/ac');
const async = require('hbs/lib/async');
//-----------------------------test method by middleware user get-----------------------------------//
//-----------------------------------------async , await--------------------------------------------//
router.get("/", ac.checkAdminRoleMiddleware, async (req, res) => {
    try {
        const skip = req.query?.skip ? Number(req.query.skip ): 0;
        const limit = (req.query?.limit && Number(req.query.limit <= 20)) ? Number(req.query.limit) : 10;
        const sort = req.query?.sort ? queryTools.createSort(req.query.sort) : {};
        const users = await Users.find().skip(skip).limit(limit).sort(sort);
        console.log(req.user);
        return res.json(users);

    } catch (error) {
        if (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    }
})
//------------------------arrow function----------------------------------------//
// Users.find().exec((err, result) => {
//     if (err) {
//         console.log(err);
//         return res.sendStatus(500);
//     }
//     // console.log(result);
//     res.json(result);
// })
//--------------------------------test method get by id------------------------//
//-----------------------------------------async , await--------------------------------------------//
router.get("/:id", async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        if (!user) {
            return res.sendStatus(404);
        }
        console.log(req.user);
        return res.json(user);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

});
//------------------------arrow function----------------------------------------//
// Users.findById(req.params.id).exec((err, user) => {
//     if (err) {
//         console.log(err);
//         return res.sendStatus(500);
//     }
//     if (!user) {
//         return res.sendStatus(404);
//     }
//     console.log(user);
//     res.json(user);
// })
//---------------------------------test method put-----------------------------//
//-----------------------------------------async , await--------------------------------------------//
router.put("/:id",ac.checkUserRoleAccessForDeleteAndUpdateUserData, async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const AllowedToUpdate = ["age", "firstName", "lastName", "password"];
        const isValidOperation = updates.every(update => AllowedToUpdate.includes(update));

        if (!isValidOperation) {
            console.log(chalk.bgRed("isValidOperation :" + isValidOperation));
            return res.status(400).send("invalid request! 😕");
        }
        // console.log(updated);
        const updateUser = await Users.findOneAndUpdate({
            _id: res.locals.userId,
            user: req.user._id
        }, req.body, { new: true });

        if (!updateUser) return res.sendStatus(404);

        res.json(updateUser);
        // console.log(updateUser); 
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})
//------------------------arrow function----------------------------------------//
// Users.findById(req.params.id).exec((err, user) => {
//     if (err) {
//         console.log(err);
//         return res.sendStatus(500);
//     }
//     if (!user) {
//         return res.sendStatus(404);
//     }

//     req.body.firstName != undefined && (user.firstName = req.body.firstName);
//     req.body.lastName != undefined && (user.lastName = req.body.lastName);
//     req.body.age != undefined && (user.age = req.body.age);
//     req.body.isActive != undefined && (user.isActive = req.body.isActive);

//     user.save().then(saveUser => {
//         res.json(saveUser);
//         console.log(chalk.green("Successfully Saved :)"));
//     })

// })
//-------------------------------test method DELETE-------------------------------//
//-----------------------------------------async , await--------------------------------------------//
router.delete("/:id",ac.checkUserRoleAccessForDeleteAndUpdateUserData, async (req, res) => {
    try {
        console.log(res.locals);
        await Users.findByIdAndDelete(res.locals.userId);
        // const deletedUser = await Users.findByIdAndDelete(res.locals);
        // if (!deletedUser) {
        //     return res.sendStatus(404);
        // }
        res.status(200);
        res.send("Successfully deleted :)");
        console.log(chalk.green("Successfully deleted :)"));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})
//------------------------arrow function----------------------------------------//
//     Users.findByIdAndDelete(req.params.id).then((deletedUser) => {

//         if (!deletedUser) {
//             return res.sendStatus(404);
//         }
//         res.status(200);
//         res.send("Successfully deleted :)");
//         console.log(chalk.green("Successfully deleted :)"));
//         // res.send("Successfully deleted :)");
//     })
// //--------------------------------test method POST-------------------------------//
//-----------------------------------------async , await--------------------------------------------//
router.post("/",ac.checkAdminRoleMiddleware, async (req, res) => {
    try {
        const person = await new Users({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            isActive: req.body.isActive,
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password
        });
        await person.save();
        console.log(chalk.green("Successfully Creat User :)"));
        res.json(person);
    } catch (error) {
        console.log(err);
        res.status(500);
        res.send(err.message);
    }
});
//-----------------------------get task of user by admin--------------------------//
router.get('/:id/tasks', ac.checkAdminRoleMiddleware, async(req,res)=> {
    try {
        const match = {};
        if ((req.query?.complete)) {
            match.isComplete = req.query.complete === 'true';
        }

        const user = await Users.findById(req.params.id);
        const userAndTask = await user.populate({
            path: 'tasks',
            match
        });
        // const task = await Tasks.find(query);
        console.log(userAndTask);
        res.json(userAndTask.tasks);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})
//--------------------------------------------------------------------------------//
module.exports = router;





//********************************put method*************************************//
    // const person = new Users({
    //     firstName: "Salar",
    //     lastName: "Arjmandpour",
    //     age: 27,
    //     isActive: true,
    //     userName: "0Xff",
    //     email: "salararjmand@4gmail.com"
    // });
    // person.save().then(savedPerson => {
    //     console.log(savedPerson);
    //     res.send(savedPerson);
    // }).catch(err => {
    //     console.log(err);
    //     res.sendStatus(500);
    // });
//********************************************************************//