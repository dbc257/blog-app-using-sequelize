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

// GET route to display all blog posts
app.get("/posts", (req, res) => {
  models.Post.findAll().then((posts) => {
    res.render("index", { allPosts: posts });
  });
});
// GET route to display the add-post page
app.get("/add-post", (req, res) => {
  res.render("add-post");
});
// POST route to save a new blog post
app.post("/add-post", (req, res) => {
  let title = req.body.newTitle;
  let body = req.body.newBody;
  let category = req.body.newCategory;
  let post = models.Post.build({
    title: title,
    body: body,
    category: category,
  });
  post.save().then(() => {
    res.render("add-post", { title: title });
  });
});
// GET route to display filter page
app.get("/filter", (req, res) => {
  res.render("filter");
});
// POST route to filter by category
app.post("/filter", (req, res) => {
  let category = req.body.pick;
  models.Post.findAll({
    where: {
      category: category,
    },
  }).then((filterResult) => res.render("filter", { postFilter: filterResult }));
});
// GET route to display blog posts by ID // post-comments
app.get("/posts/:postID", (req, res) => {
  let postID = req.params.postID;
  models.Post.findByPk(postID, {
    include: [
      {
        model: models.Comment,
        as: "comments",
      },
    ],
  }).then((post) => {
    res.render("post-comments", post.dataValues);
  });
});
// POST route to add a comment to a post
app.post("/add-comment", (req, res) => {
  let title = req.body.title;
  let body = req.body.body;
  let postID = parseInt(req.body.postID);
  let comment = models.Comment.build({
    title: title,
    body: body,
    comment_id: postID,
  });
  comment.save().then((savedComment) => {
    res.redirect(`/posts/${postID}`);
  });
});
// GET route to display the update page
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
// POST route to update an existing blog post
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
    res.redirect(`/update/${id}`);
  });
});
// POST route to delete a blog post
app.post("/delete-post", (req, res) => {
  let deletePostID = req.body.deletePostID;
  models.Post.destroy({
    where: {
      id: deletePostID,
    },
  }).then(() => {
    res.redirect("/posts");
  });
});
// POST route to delete a comment from a post
app.post("/delete-comment", (req, res) => {
  let deleteID = req.body.deleteID;
  let commentID = req.body.commentID;
  models.Comment.destroy({
    where: {
      id: deleteID,
    },
  }).then(() => {
    res.redirect(`/posts/${commentID}`);
  });
});
// Check to see if the server is running
app.listen(3000, () => {
  console.log("Server is on the run!");
});
