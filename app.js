var bodyParser = require("body-parser"),
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

app.listen(3000,function(){
    console.log("Server Started!!");
})