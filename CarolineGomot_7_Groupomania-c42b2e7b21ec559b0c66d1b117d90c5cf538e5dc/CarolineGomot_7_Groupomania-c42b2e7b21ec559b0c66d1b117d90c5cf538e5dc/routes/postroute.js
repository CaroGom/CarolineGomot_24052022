const router = require('express').Router();
const postCtrl= require('../controllers/postcontroller');
const uploadCtrl= require('../controllers/uploadcontroller');
const multer= require('../middlewares/multermiddleware');


router.get('/', postCtrl.readPost);
router.post('/', multer, postCtrl.createPost);
router.put('/:id', postCtrl.updatePost);
router.delete('/:id', postCtrl.deletePost);
router.patch('/like-post/:id', postCtrl.likePost);
router.patch('/unlike-post/:id', postCtrl.unlikePost);

//comments

router.patch('/comment-post/:id', postCtrl.commentPost);
router.patch('/edit-comment-post/:id', postCtrl.editCommentPost);
router.patch('/delete-comment-post/:id', postCtrl.deleteCommentPost);

//upload



module.exports = router;