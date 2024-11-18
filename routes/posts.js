const express = require("express");
const router = express.Router();
const comments = require("../data/comments");

const posts = require("../data/posts");
const error = require("../utilities/error");

router
  .route("/")
  .get((req, res) => {
    const userId = req.query["userId"];
    if (userId) {
      let userPosts = [];
      posts.find((post) => {
        if (post.userId == userId) {
          userPosts.push(post);
        }
      });
      
      const links = [
        {
          href: "posts/:id",
          rel: ":id",
          type: "GET",
        },
      ];

      res.json({ userPosts, links });
    } else {
      const links = [
        {
          href: "posts/:id",
          rel: ":id",
          type: "GET",
        },
      ];

      res.json({ posts, links });
    }
  })
  .post((req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
      };

      posts.push(post);
      res.json(posts[posts.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);

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

    if (post) res.json({ post, links });
    else next();
  })
  .patch((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  });

router.route("/:id/comments").get((req, res, next) => {
  let id = req.params.id;
  let userId = req.query["userId"];

  if (userId) {
    let userPosts = [];
    posts.find((post) => {
      if (post.id == id) {
        comments.find((comment) => {
          if (comment.userId == userId && comment.postId == id) {
            userPosts.push(comment);
          }
        });
      }
    });

    return res.json(userPosts);
  } else {
    let userPosts = [];

    comments.find((comment) => {
      if (comment.postId == id) {
        userPosts.push(comment);
      }
    });

    return res.json(userPosts);
  }
});

module.exports = router;
