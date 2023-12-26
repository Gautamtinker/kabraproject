import app from "./app.js";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import connectDatabase from "./config/database.js";

dotenv.config({ path: "config/config.env" });

process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`server is shut down due to an uncaught error`);
  process.exit(1);
});

connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
/*
if(process.env.NODE_ENV = "production"){
    const path = require('path')

    app.get('/',(req,res)=>{
        app.use(express.static(path.resolve(__dirname,'frontend','build')))
        res.sendFile(path.resolve(__dirname,'frontend','build','index.html'))
    })
}
*/
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`server is shut down due to an Unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
