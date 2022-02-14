const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Course = require('../models/course');
const Post = require('../models/post');
const Class = require('../models/class');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const editUser = async (req, res) => {
    const { userId } = req;
    const user = req.body;
    let accDetails = {
        fullname: user.fullname,
        age: user.age,
        cellno: user.cellno,
    }
    console.log(accDetails,req.file.filename);
    if (req.file)
        accDetails = { ...accDetails, dp: req.file.filename }
        console.log(accDetails);
    const oldpass = user.cpassword;
    const userid = userId
    try {
        if (oldpass) {
            try {
                const oldDBMSPASS = await Student.findById(userid, '_id password dp');
                try {
                    const value = await bcrypt.compare(oldpass, oldDBMSPASS.password);
                    console.log(value,123);
                    if (value) {
                        const salt = await bcrypt.genSalt(10);
                        const hashedPass = await bcrypt.hash(user.password, salt);
                        await Student.findOneAndUpdate({ _id: userid }, { ...accDetails, password: hashedPass }, { select: '_id' });
                        res.status(200).send("Details updated");
                    }
                    else
                        res.status(200).send('Wrong Old password');
                } catch (error) {
                    res.status(200).send('Password Matching Unsucessfull!!');
                }
            } catch (error) {
                res.status(200).send("Username is already in use Try another!!");
            }
        }
        else {
            await Student.findByIdAndUpdate(userid, accDetails);
            res.status(201).send("Details updated");
        }
    } catch (error) {
        res.status(200).send("Username is already in use Try another!!");
    }

}

const createUser = async (req, res) => {
    const { data, isTeacher } = req.body;
    let newUser;
    if (isTeacher) {
        newUser = new Teacher(data);
    }
    else {
        newUser = new Student(data);
    }
    try {
        await newUser.save();
        res.status(201).send('Account Created');
    } catch (error) {
        console.log(error.message);
        res.status(409).send({ message: error.message });
    }
};
const checkUser = async (req, res) => {
    const { data, isTeacher } = req.body;
    let user;
    try {
        if (isTeacher)
            user = await Teacher.findOne({ email: data.email }, '_id fullname password');
        else
            user = await Student.findOne({ email: data.email }, '_id fullname password');
        if (user === null) {
            throw new "error"
        }
        console.log(user);
        const value = await bcrypt.compare(data.password, user.password)
        if (!value)
            throw new "error"
        const payload = {
            user: {
                _id: user._id,
                username: user.fullname,
                isTeacher
            }
        }
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '720hr' });
        res.cookie('tkn', token, { maxAge: 2592000000, httpOnly: true });
        res.status(200).json({ message: true, userId: user._id, username: user.fullname });
    } catch (error) {
        res.status(409).json({ message: false });
    }
};
const checkLogin = async (req, res) => {
    res.status(200).json({ isTeacher: req.isTeacher, username: req.username });
}
const userLogout = async (req, res) => {
    try {
        res.clearCookie('tkn');
        console.log("logout sucessfully!!");
        res.status(200).send("sucess!!")
    } catch (error) {
        console.log(error.message);
    }
};
const fetchUser = async (req, res) => {
    const { userId, isTeacher } = req;
    console.log(userId, isTeacher);
    try {
        if (isTeacher) {
            const user = await Teacher.findById(userId, {
                courses: {
                    $slice: 4
                },
                activeTasks: {
                    $slice: 4
                },
                wishList: {
                    $slice: 4
                }
            }, {
                $project: '_id fullname email dp sex age cellno income rating reviewLength'
            }
            ).populate('courses', '_id name category price countOfStudents rating reviewLength timeSlot active discount').populate('wishList', '_id name category price timeSlot countOfStudents rating reviewLength active discount').populate({
                path: 'activeTasks', select: 'title class task', populate: [{
                    path: 'class',
                    select: 'name course',
                    populate: {
                        path: 'course',
                        select: 'name'
                    }
                }
                    , {
                    path: 'task',
                    select: 'time'
                }]
            });
            console.log(user.courses);
            res.status(200).json({ user: user, isTeacher });
        }
        else {
            const user = await Student.findById(userId, {
                activeClasses: {
                    $slice: 4
                },
                activeTasks: {
                    $slice: 4
                },
                wishList: {
                    $slice: 4
                }
            }, {
                $project: '_id fullname email dp sex age cellno'
            }).populate('wishList', '_id name category countOfStudents rating reviewLength  price timeSlot active discount').populate({
                path: 'activeTasks', select: 'title class task', populate: [{
                    path: 'class',
                    select: 'name course',
                    populate: {
                        path: 'course',
                        select: 'name'
                    }
                }
                    , {
                    path: 'task',
                    select: 'time'
                }]
            }).populate('activeClasses', '_id name course timeSlot dp');
            res.status(200).json({ user: user, isTeacher });
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message })
    }
}

module.exports = { fetchUser, userLogout, checkLogin, createUser, checkUser, editUser }
