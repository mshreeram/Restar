const mongoose = require("mongoose");
const Restaurant = require("./models/Restaurant");

// Connect to MongoDB
mongoose.connect("mongodb+srv://mekashreeram:mshreeram@cluster0.t8wf3y7.mongodb.net/zomato_restaurants?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

// Error Handling for Database Connection
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', function() {
    console.log("Database connected successfully");
});

async function convertToGeoJSON() {
    const batchSize = 100; // Batching 100 documents at a time
    let skip = 0;
    let documentsProcessed = 0;

    while (true) {
        // Fetch a batch of documents
        const restaurants = await Restaurant.find().skip(skip).limit(batchSize);
        if (restaurants.length === 0) {
            break; // No more documents to process
        }

        // Process each document in the batch
        const bulkOps = restaurants.map(restaurant => {
            if (!restaurant.location || (restaurant.location.coordinates[0] === 0 && restaurant.location.coordinates[1] === 0)) {
                const { latitude, longitude } = restaurant;
                return {
                    updateOne: {
                        filter: { _id: restaurant._id },
                        update: {
                            $set: {
                                location: {
                                    type: 'Point',
                                    coordinates: [longitude, latitude],
                                },
                            },
                        },
                    },
                };
            }
        }).filter(Boolean);

        // Perform bulk write operation
        if (bulkOps.length > 0) {
            try {
                await Restaurant.bulkWrite(bulkOps);
                documentsProcessed += bulkOps.length;
                console.log(`${documentsProcessed} documents processed so far`);
            } catch (err) {
                console.error(`Error processing batch at skip ${skip}:`, err);
            }
        }

        // Move to the next batch
        skip += batchSize;
    }

    console.log('All restaurants have been converted to GeoJSON format.');
    mongoose.connection.close();
}

convertToGeoJSON().catch(err => {
    console.error('Error during conversion:', err);
    mongoose.connection.close();
});
