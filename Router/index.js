const router = require("express").Router()
const {eventRouter} = require("./events");
const {userRouter} = require("./user");

router.use("/events",eventRouter);
router.use("/users",userRouter);

module.exports = {router};

