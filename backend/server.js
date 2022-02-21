const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const HttpError = require("./models/http-error");

const petRoutes = require("./routes/pet-routes");
const authRoutes = require("./routes/auth-routes");
const adoptRequestRoutes = require("./routes/adopt-request-routes");

const server = express();

server.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
server.use(bodyParser.json({ limit: '5mb' }));
server.use((req,res,next)=> {
   res.setHeader('Access-Control-Allow-Origin','*');
   res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
   res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE');
   next();
});

server.use("/api/myusers", authRoutes);
server.use("/api/pets", petRoutes);
server.use("/api/adoptrequest", adoptRequestRoutes);

server.use((req, res, next) => {
   const error = new HttpError("Route not found", 404);
   return next(error);
});

server.use((err, req, res, next) => {
   if (res.headerSent) {
      return next(err);
   }
   res.status(err.code || 500);
   res.json({ message: err.message || "An unknown error occurred!" });
}); // error handle midleware
// console.log(process.env.DB_DATABASE);
mongoose
   .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.j8y6a.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`
      
   )
   .then(() => {
      server.listen(process.env.PORT || 5000);
   })
   .catch((err) => {
      console.log(err);
   });
