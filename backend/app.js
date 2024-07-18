const express = require("express");
const app = express();

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://mekashreeram:mshreeram@cluster0.t8wf3y7.mongodb.net/zomato_restaurants?retryWrites=true&w=majority&appName=Cluster0", {});

const db = mongoose.connection;

// Error Handling for Database Connection
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', function() {
    console.log("Database connected successfully");
});

const restaurantsRoute = require("./routes/restaurants");
const restaurantDetailsRoute = require("./routes/restaurantDetails");

app.use("/restaurants", restaurantsRoute);
app.use("/restaurant", restaurantDetailsRoute);

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at ${port}`);
});