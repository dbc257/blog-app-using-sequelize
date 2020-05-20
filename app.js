const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const models = require("./models");
app.use(express.urlencoded());
// tell express to use mustache templating engine
app.engine("mustache", mustacheExpress());
// the pages are located in views directory
app.set("views", "./views");
// extension will be .mustache
app.set("view engine", "mustache");

app.get("/filter", (req, res) => {
  res.render("filter");
});

app.post("/filter", (req, res) => {
  let category = req.body.pick;
  models.Post.findAll({
    where: {
      category: category,
    },
  }).then((filterResult) => res.render("filter", { postFilter: filterResult }));
});
//display the update page
app.get("/update/:id", (req, res) => {
  let id = req.params.id;
  models.Post.findOne({
    where: {
      id: id,
    },
  }).then((post) => {
    res.render("update", post.dataValues);
  });
});

//POST route to update an existing blog post
app.post("/update", (req, res) => {
  let id = req.body.updateID;
  let title = req.body.updateTitle;
  let body = req.body.updateBody;
  let category = req.body.updateCategory;
  models.Post.update(
    {
      title: title,
      body: body,
      category: category,
    },
    {
      where: {
        id: id,
      },
    }
  ).then(() => {
    res.redirect("/posts");
  });
});
//display the add-post page
app.get("/add-post", (req, res) => {
  res.render("add-post");
});
//display all blog posts
app.get("/posts", (req, res) => {
  models.Post.findAll().then((posts) => {
    res.render("index", { allPosts: posts });
  });
});
//POST route to save a new blog post
app.post("/add-post", (req, res) => {
  let title = req.body.postTitle;
  let body = req.body.postBody;
  let category = req.body.postCategory;
  let post = models.Post.build({
    title: title,
    body: body,
    category: category,
  });
  post.save().then(() => {
    res.redirect("/posts");
  });
});
//POST route to delete a blog post
app.post("/delete", (req, res) => {
  let id = req.body.deleteID;
  models.Post.destroy({
    where: {
      id: id,
    },
  }).then(() => {
    res.redirect("/posts");
  });
});

app.listen(3000, () => {
  console.log("Server is on the run!");
});
