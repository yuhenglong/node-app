const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const passport = require("passport");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// express实例化对象
const router = express.Router();

// 加载model
require('../models/User');
const User = mongoose.model('users');
// 登录接口
router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', urlencodedParser, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: 'ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
    // 查询数据库
    // User.findOne({ email: req.body.email }).then((user) => {
    //     if (!user) {
    //         req.flash("error_msg", "用户不存在！");
    //         res.redirect('/users/login');
    //         return;
    //     }
    // })
});
// 注册
router.get("/register", (req, res) => {
    res.render("users/register")
});
// 注册上传表单
router.post("/register", urlencodedParser, (req, res) => {
    let errors = [];
    if (req.body.password != req.body.password2) {
        errors.push({
            text: "两次密码不一致！"
        })
    };

    if (req.body.password.length < 4) {
        errors.push({
            text: "密码长度不能小于4位！"
        })
    };

    if (errors.length > 0) {
        res.render("users/register", {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    }
});
module.exports = router;