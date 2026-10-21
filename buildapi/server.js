
const express = require("express");

const app = express();
app.use(express.json());

let students = [
    { id: 1, name: "Arun", department: "IT", age: 20 },
    { id: 2, name: "Priya", department: "CSE", age: 21 }
];

let nextId = 3;

// GET: Display all students
app.get("/students", (req, res) => {
    res.json(students);
});

// GET: Display a student by ID
app.get("/students/:id", (req, res) => {
    const student = students.find(s => s.id === Number(req.params.id));

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
});

// POST: Add a student
app.post("/students", (req, res) => {
    const { name, department, age } = req.body;

    if (!name || !department || !Number.isInteger(age) || age < 1) {
        return res.status(400).json({ message: "Invalid student details" });
    }

    const student = { id: nextId++, name, department, age };
    students.push(student);

    res.status(201).json(student);
});

// PUT: Update a student
app.put("/students/:id", (req, res) => {
    const student = students.find(s => s.id === Number(req.params.id));

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    const { name, department, age } = req.body;

    if (!name || !department || !Number.isInteger(age) || age < 1) {
        return res.status(400).json({ message: "Invalid student details" });
    }

    student.name = name;
    student.department = department;
    student.age = age;

    res.json({
        message: "Student updated successfully",
        student
    });
});

// DELETE: Remove a student
app.delete("/students/:id", (req, res) => {
    const index = students.findIndex(s => s.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ message: "Student not found" });
    }

    const deleted = students.splice(index, 1)[0];

    res.json({
        message: "Student deleted successfully",
        student: deleted
    });
});

// Start server
app.listen(3000, () => {
    console.log("REST API running at http://localhost:3000");
});
