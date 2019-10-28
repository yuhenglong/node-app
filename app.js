const express = require('express');
// 引入exphbs
const exphbs = require('express-handlebars');
// 引入路径模块
const path = require("path");
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
    // 引入mongoose
const mongoose = require('mongoose');
const session = require("express-session");
const flash = require('connect-flash');
// 实例化express对象
const app = express();

// load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');
// 连接数据库
mongoose.connect('mongodb://localhost/node-app')
    .then(() => {
        console.log("MongoDB connected...");
    }).catch(err => {
        console.log(err);
    });
// // 引入模型
require("./models/idea");
const Idea = mongoose.model("ideas");

app.engine('handlebars', exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// body-parser 的相关定义
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: true });

// 在服务端正常使用静态文件
app.use(express.static(path.join(__dirname, "public")));


// method-override 中间件
app.use(methodOverride("_method"));

// session & flash middleware
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

//flash
app.use(flash());
// 配置全局变量
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// 配置路由
app.get('/', (req, res) => {
    // render API要render到一个文件路径
    const title = "我是一头猪";
    res.render("index", {
        title: title
    });
});

app.get('/about', (req, res) => {
    res.render('about');
});

// 使用路由中间件，并且设置了二级路由，在分路由里面不用写：“/users”,会自动添加
app.use("/ideas", ideas);
app.use("/users", users);
// 定义实例化对象的监听端口
const port = 5000;
app.listen(port, () => {
    console.log(`Server started on ${port}`);
});