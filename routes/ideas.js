const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// express实例化对象
const router = express.Router();
// 引入模型
require("../models/idea");
const Idea = mongoose.model("ideas");

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res) => {
    Idea.find({}).sort({ date: "desc" }).then(ideas => {
        res.render("ideas/index", {
            ideas: ideas
        })
    })
});

router.post('/', urlencodedParser, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: "请输入正确的标题！" })
    };
    if (!req.body.details) {
        errors.push({ text: "请输入正确的内容！" });
    };
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        };
        new Idea(newUser).save().then(idea => {
            req.flash("success_msg", "数据添加成功！");
            res.redirect("/ideas");
        })
    }
});
router.get('/add', (req, res) => {
    res.render('ideas/add');
});
// 编辑
router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        res.render("ideas/edit", {
            idea: idea
        })
    })
});

// 编辑成功
router.put("/:id", urlencodedParser, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        // 数据库存储信息
        idea.save().then(idea => {
            req.flash("success_msg", "数据编辑成功！");
            res.redirect("/ideas");
        })
    })
});

// 实现删除
router.delete("/:id", (req, res) => {
    Idea.remove({
        _id: req.params.id
    }).then(() => {
        req.flash("success_msg", "数据删除成功！");
        res.redirect("/ideas");
    })
});
module.exports = router;