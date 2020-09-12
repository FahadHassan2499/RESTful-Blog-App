var express      =require("express"), 
	methodOverride=require("method-override"),
	expressSanitize=require("express-sanitizer"),
    app          =express(),
    bodyParser   =require("body-parser"),
	mongoose     =require("mongoose");

//APP CONFIG
mongoose.set('useUnifiedTopology',true);//mongodb://localhost:27017/restful_blog_app
mongoose.connect('mongodb+srv://garoudev:garou2499@cluster0.pfl6u.mongodb.net/restful_blog?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true})
 .then(()=> {
	console.log("Connected to DB");
}).catch(err =>{
	console.log("ERROR:",err.message);
});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitize());

//MONGOOSE MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created: {type:Date , default:Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);



//RESTful ROUTES
app.get("/",function(req,res){
	res.redirect("/blogs");
})
//INDEX ROUTE
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
			
		}else{
			res.render("index",{blogs:blogs});
			
		}
	})
})
//NEW ROUTE
app.get("/blogs/new",function(req,res){
	res.render("new");
});
//CREATE ROUTE
app.post("/blogs",function(req,res){		
		req.body.blog.body=req.sanitize(req.body.blog.body);				
		 Blog.create(req.body.blog,function(err,newBlog){
					if(err){
						console.log(err);
					}else{
						res.redirect("/blogs");
					}
			});
		 });
//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog:foundBlog});
		}
	});
});
//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit",{blog:foundBlog});
		}
	})
});
//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
			req.body.blog.body=req.sanitize(req.body.blog.body);				
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			res.redirect("/blogs");	
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	})
});
//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	})
});





app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log(" yelpCamp server is live");
});
