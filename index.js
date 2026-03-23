const express = require("express");
const {router} = require("./Router/index");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json"); 


const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use("/", router);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, ()=>{
    console.log(`Running on ${PORT}`);
});