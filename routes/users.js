const express = require("express");
const router = express.Router();
const comments = require("../data/comments");

const users = require("../data/users");
const posts = require("../data/posts");
const error = require("../utilities/error");

router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "users/:id",
        rel: ":id",
        type: "GET",
      },
    ];

    res.json({ users, links });
  })
  .post((req, res, next) => {
    if (req.body.name && req.body.username && req.body.email) {
      if (users.find((u) => u.username == req.body.username)) {
        next(error(409, "Username Already Taken"));
      }

      const user = {
        id: users[users.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      };

      users.push(user);
      res.json(users[users.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const user = users.find((u) => u.id == req.params.id);

    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    if (user) res.json({ user, links });
    else next();
  })
  .patch((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        for (const key in req.body) {
          users[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  })
  .delete((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        users.splice(i, 1);
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  });

router.route("/:id/posts").get((req, res, next) => {
  let id = req.params.id;

  let userPosts = [];
  posts.find((post) => {
    if (post.userId == id) {
      userPosts.push(post);
    }
  });

  return res.json(userPosts);
});

router.route("/:id/comments").get((req, res, next) => {
  let id = req.params.id;
  let postId = req.query["postId"];

  if (postId) {
    let userPosts = [];
    comments.find((comment) => {
      if (comment.userId == id && comment.postId == postId) {
        userPosts.push(comment);
      }
    });

    return res.json(userPosts);
  } else {
    let userPosts = [];

    comments.find((comment) => {
      if (comment.userId == id) {
        userPosts.push(comment);
      }
    });

    return res.json(userPosts);
  }
});
module.exports = router;
