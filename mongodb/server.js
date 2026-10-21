
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));


const client = new MongoClient(process.env.MONGODB_URI);

let students;

async function startServer() {
    await client.connect();

    const db = client.db("CollegeDB");
    students = db.collection("students");

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

// CREATE: Add a student
app.post("/api/students", async (req, res) => {
    try {
        const { name, department, age } = req.body;

        if (
            typeof name !== "string" || !name.trim() ||
            typeof department !== "string" || !department.trim() ||
            !Number.isInteger(age) || age < 1
        ) {
            return res.status(400).json({
                message: "Enter a valid name, department and age"
            });
        }

        const student = {
            name: name.trim(),
            department: department.trim(),
            age
        };

        const result = await students.insertOne(student);

        res.status(201).json({
            message: "Student added successfully",
            _id: result.insertedId,
            ...student
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ: Get all students
app.get("/api/students", async (req, res) => {
    try {
        const data = await students.find().toArray();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE: Update a student by ID
app.put("/api/students/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, department, age } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid student ID" });
        }

        if (
            typeof name !== "string" || !name.trim() ||
            typeof department !== "string" || !department.trim() ||
            !Number.isInteger(age) || age < 1
        ) {
            return res.status(400).json({
                message: "Enter a valid name, department and age"
            });
        }

        const result = await students.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    name: name.trim(),
                    department: department.trim(),
                    age
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE: Delete a student by ID
app.delete("/api/students/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid student ID" });
        }

        const result = await students.deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

startServer().catch(error => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
});
