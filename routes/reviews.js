const express = require("express");
const router = express.Router();
const {
  getReviews,
  addReview,
  deleteReview,
} = require("../controllers/reviews");

// 获取房间所有评论
router.get("/room/:roomId", getReviews);

// 添加评论（自己解析 token，不依赖中间件）
router.post("/", addReview);

// 删除评论（自己解析 token，不依赖中间件）
router.delete("/:id", deleteReview);

module.exports = router;
