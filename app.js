var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();

mongoose.connect('mongodb://localhost:27017/blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog=mongoose.model("Blog", blogSchema);

//RESTful Routes

app.get("/",function(req,res){
  res.redirect("/blogs");
});
//index route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
      if(err){
        console.log("ERROR!!");
      }
      else{
      res.render("index",{blogs: blogs});
      }
    });
});

//new route
app.get("/blogs/new",function(req,res){
    res.render("new");
});
//create route
app.post("/blogs",function(req,res){
    //create blog
    Blog.create(req.body.blog,function(err, newBlog){
      if(err){
        res.render("new");
      }
      else{
        res.redirect("/blogs");
      }
    });
});

//show route
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
      if(err){
        res.redirect("/blogs");
      }
      else{
        res.render("show",{blog: foundBlog});
      }
    });
});

//edit route
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err, foundBlog){
      if(err){
        res.redirect("/blogs");
      }
      else{
        res.render("edit",{blog: foundBlog});
      }
    });
});
//update route
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err,updatedBlog){
      if(err){
        res.redirect("/blogs");
      }
      else{
        res.redirect("/blogs/"+ req.params.id);
      }
    });
});
//delete route
app.delete("blogs/:id",function(req,res){
  //destroy
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/blogs");
    }
    else{
      res.redirect("/blogs");
    }
  });
});

app.listen(3000,function(){
    console.log("Server Started!!");
});