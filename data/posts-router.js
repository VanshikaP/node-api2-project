const express = require('express');
const Posts = require('./db.js');

const router = express.Router()

router.get('/', (req, res) => {
    Posts.find(req.query)
    .then(Posts => {
      res.status(200).json(Posts);
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        error: "The posts information could not be retrieved."
      });
    });
  });

router.get('/:id', (req, res) => {
  Posts.findById(req.params.id)
  .then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
        error: "The post information could not be retrieved."
    });
  });
});

router.get('/:id/comments', (req, res) => {
    Posts.findPostComments(req.params.id)
    .then(comments => {
        if (comments) {
            res.status(200).json(comments)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: "The comments information could not be retrieved."
        })
    })
})

router.post('/', (req, res) => {
    if (!req.body.hasOwnProperty('title') || !req.body.hasOwnProperty('contents')) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        Posts.insert(req.body)
        .then(response => {
          Posts.findById(response.id)
          .then(post => {
              res.status(201).json(post);
          }).catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error while saving the post to the database" });
          })
        })
        .catch(error => {
          // log error to database
          console.log(error);
        });
    }

});

router.post('/:id/comments', (req, res) => {
    Posts.findById(req.params.id)
    .then( post => {
        if (post) {
            if (!req.body.hasOwnProperty('text')) {
                res.status(400).json({ errorMessage: "Please provide text for the comment." })
            } else {
                Posts.insertComment(req.body)
                .then(commentID => {
                    res.status(201).json(req.body)
                })
            }
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: "The posts information could not be retrieved." })
    })
})

router.delete('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        const deletedPost = post;
        Posts.remove(req.params.id)
        .then(count => {
            if (count > 0) {
            res.status(200).json(deletedPost);
            } else {
            res.status(404).json({ message: 'The post could not be found' });
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
            message: 'Error removing the post',
            });
        });
    })
    .catch(err => console.log('Post not found'))
});

router.put('/:id', (req, res) => {
  const changes = req.body;
  if (!req.body.hasOwnProperty('title') || !req.body.hasOwnProperty('contents')) {
      res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  } else {
    Posts.update(req.params.id, changes)
    .then(postID => {
        Posts.findById(req.params.id)
        .then(post => {
          if (post) {
              res.status(201).json(post);
            } else {
              res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        }).catch(err => console.log(err))
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        error: "The post information could not be modified."
      });
    });
  }
});



module.exports = router;