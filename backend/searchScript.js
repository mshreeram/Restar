const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');

mongoose.connect("mongodb+srv://mekashreeram:mshreeram@cluster0.t8wf3y7.mongodb.net/zomato_restaurants?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function createTextIndex() {
    try {
        await Restaurant.collection.createIndex({ restaurantName: "text", cuisine: "text" });
        console.log("Text index created successfully.");
    } catch (e) {
        console.error("Error creating text index:", e);
    }
}

createTextIndex();
