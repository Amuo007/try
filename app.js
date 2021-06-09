//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser. Node.js lets developers use JavaScript to write command line tools and for server-side scripting—running scripts server-side to produce dynamic web page content before the page is sent to the user's web browser. Consequently, Node.js represents a JavaScript everywhere paradigm,[6] unifying web-application development around a single programming language, rather than different languages for server-side and client-side scripts.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

mongoose.connect("mongodb+srv://amuo:amuo12345@cluster0.e6cjg.mongodb.net/blogDB", { useNewUrlParser: true, useUnifiedTopology: true });

const blogSchema = {
  title: String,
  content: String,
  created_at: {type: Date, default: Date.now}
}

const Blog = mongoose.model("Blog", blogSchema);





app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/",function(req,res){
res.render("showcase")
});

app.get("/home", function (req, res) {

  Blog.find({}, function (err, foundBlogs) {
    if (err) {
      console.log(err);
    }

    res.render("home", {
      homePageContent: homeStartingContent,
      posts: foundBlogs

    });
  });



});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutPageContent: aboutContent
  });
});
app.get("/contact", function (req, res) {
  res.render("contact", {
    contactPageContent: contactContent
  });
});
app.get("/compose", function (req, res) {
  res.render("compose");
});
app.post("/compose", function (req, res) {


  title = req.body.contentTitle;
  body = req.body.contentBody;


  const blog = new Blog({
    title: title,
    content: body
  });

  blog.save();



  res.redirect("/home");
});


app.get("/post/:postName", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);

  Blog.find({}, function (err, foundBlogs) {
    if (err) {
      console.log(err);
    }

    foundBlogs.forEach(function (element) {
      const storedTitle = _.lowerCase(element.title);
      if (storedTitle === requestedTitle) {
        res.render("post", {
          title: element.title,
          content: element.content
        });

      }
    });

  });



});











app.listen(process.env.PORT, function () {
  console.log("Server started on port 3000");
});
// process.env.PORT