var express = require('express');
var router = express.Router();
var mongodb=require('mongodb').MongoClient;
var db_str="mongodb://localhost:27017/mydb";
var async = require("async");

var ObjectId=require('mongodb').ObjectId;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { name:req.session.name });
});
//注册渲染
router.get("/resgin",(req,res)=>{
	res.render("resgin",{});
});

//登录渲染
router.get("/login",(req,res)=>{
	res.render("login",{});
});

//留言
router.get('/liuyan',(req,res)=>{
	
//	数据总条数
	var count=0;
//	每页展示的数量
	var size=3;
//	总页数
	var page=0;
//	页码
	var pagenum=req.query.pagenum;
	pagenum=pagenum?pagenum:1;
	
	mongodb.connect(db_str,(err,db)=>{
		db.collection('liuyancoll',(err,coll)=>{
			
			async.series([
				function(callback){
					coll.find({}).toArray((err,data)=>{
						
						count=data.length;
						page=Math.ceil(count/size) 
						
						pagenum=pagenum<1?1:pagenum;
						pagenum=pagenum>page?page:pagenum;
						callback(null,'')
					})
				},
				function(callback){
					coll.find({}).sort({_id:-1}).limit(size).skip((pagenum-1)*size).toArray((err,data)=>{
						callback(null,data)
					})
				}
			],function(err,data){
//				['',data]
				res.render('liuyan',{list:data[1],page:page,count:count,pagenum:pagenum,size:size})
				db.close()
				
			})
			
//			coll.find({}).sort({_id:-1}).toArray((err,data)=>{
//				res.render('liuyan',{list:data})
//				database.close()
//			})
		})
	})
})

//详情
router.get("/detail",(req,res)=>{
	var id=ObjectId(req.query.id);
	mongodb.connect(db_str,(err,db)=>{
		db.collection("liuyancoll",(err,coll)=>{
			coll.find({_id:id}).toArray((err,data)=>{
				res.render("detail",{detail:data[0].con});
				db.close();
			})
		})
	})
})

//注销
router.get("/relogin",(req,res)=>{
	req.session.destroy(()=>{
		res.redirect("/");
	})
})
module.exports = router;
