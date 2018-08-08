var express = require('express');
var router = express.Router();
var mongodb = require("mongodb").MongoClient;
var db_str = "mongodb://localhost:27017/mydb";

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//注册
router.post('/resgin',function(req,res){
//	 console.log(req.body) 
	 
	mongodb.connect(db_str,function(err,db){
	 	db.collection('info',function(err,coll){
	 		coll.find({user:req.body.user}).toArray(function(err,data){
	 			if(data.length>0){
	 				res.send('2')
	 				db.close()
	 			}else{
	 				coll.insert(req.body,function(){
	 					res.send('1')
	 					db.close()
	 				})
	 			}
	 		})
	 	})
	 })
	 
})

//登录
router.post("/login",function(req,res){
	mongodb.connect(db_str,function(err,db){
	 	db.collection('info',function(err,coll){
	 		coll.find(req.body).toArray(function(err,data){
	 			if(data.length>0){
	 				req.session.name = data[0].user;
	 				res.send('1')
	 				db.close()
	 			}else{
	 					res.send('2')
	 					db.close()		
	 			}
	 		})
	 	})
	 })
});

//留言
router.post("/liuyan",(req,res)=>{
	mongodb.connect(db_str,(err,db)=>{
		db.collection("liuyancoll",(err,coll)=>{
			coll.insert(req.body,()=>{
				res.send("1");
				db.close();
			})
		})
	})
})
module.exports = router;
