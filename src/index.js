require("dotenv").config(); //config do dotenv

require("../src/modules/express"); // require do express

const connectToDatabase = require("../src/modules/connect"); //require pro export do database(connect.js)
connectToDatabase();// conectando ao database