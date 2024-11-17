const express = require("express"); 
const router = express.Router(); 

const comments = require("../data/comments"); 
const error = require("../utilities/error"); 

router
.route("/")
.get((req, res) => {
  
  const userId = req.query["userId"]; 
  
  let userComments = []; 
  comments.find((comment) => {
    if (comment.userId == userId) {
      userComments.push(comment); 
    }
  })

  console.log(userComments); 
  const links = [
    {
      href: "comments/:id",
      rel: ":id",
      type: "GET",
    },
  ];

  res.json({ userComments, links });
})
.post((req, res, next) => {
  if (req.body.userId && req.body.commentId && req.body.body) {
    const comment = {
      id: comments[comments.length - 1].id + 1,
      userId: req.body.userId,
      commentId: req.body.commentId,
      body: req.body.body,
    };
    comments.push(comment);
    res.json(comments[comments.length - 1]);
  } else next(error(400, "Insufficient Data"));
});

router
  .route("/:id")
  .get((req, res, next) => {
    const comment = comments.find((c) => c.id == req.params.id);

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
    if (comment) res.json({ comment, links });
    else next();
  })
  .patch((req, res, next) => {
    const comment = comments.find((c, i) => {
      if (c.id == req.params.id) {
        for (const key in req.body) {
          comments[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (comment) res.json(comment);
    else next();
  })
  .delete((req, res, next) => {
    const comment = comments.find((c, i) => {
      if (c.id == req.params.id) {
        comments.splice(i, 1);
        return true;
      }
    });

    if (comment) res.json(comment);
    else next();
  });

module.exports = router; 

