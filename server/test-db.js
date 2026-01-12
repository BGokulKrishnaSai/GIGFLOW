const mongoose = require("mongoose");
require("dotenv").config();

const testDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Simple test
    const Test = mongoose.model("Test", { name: String });
    const testDoc = await Test.create({ name: "test" });
    console.log("Created document:", testDoc);

    await mongoose.disconnect();
    console.log("Disconnected");
  } catch (error) {
    console.error("Error:", error);
  }
};

testDB();