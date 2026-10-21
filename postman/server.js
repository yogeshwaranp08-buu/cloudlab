
const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to read JSON request bodies
app.use(express.json());

// Sample pet records
let pets = [
    { id: 1, name: "Bruno", type: "Dog", age: 3, adopted: false },
    { id: 2, name: "Milo", type: "Cat", age: 2, adopted: true }
];

let nextId = 3;

// GET: Retrieve all pets
app.get("/pets", (req, res) => {
    res.status(200).json(pets);
});

// GET: Retrieve one pet by ID
app.get("/pets/:id", (req, res) => {
    const pet = pets.find(p => p.id === Number(req.params.id));

    if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
    }

    res.status(200).json(pet);
});

// POST: Add a new pet
app.post("/pets", (req, res) => {
    const { name, type, age, adopted = false } = req.body;

    if (
        typeof name !== "string" || !name.trim() ||
        typeof type !== "string" || !type.trim() ||
        !Number.isInteger(age) || age < 0 ||
        typeof adopted !== "boolean"
    ) {
        return res.status(400).json({
            message: "Provide a valid name, type, non-negative integer age, and boolean adopted"
        });
    }

    const newPet = {
        id: nextId++,
        name: name.trim(),
        type: type.trim(),
        age,
        adopted
    };

    pets.push(newPet);
    res.status(201).json(newPet);
});

// PUT: Update an existing pet
app.put("/pets/:id", (req, res) => {
    const pet = pets.find(p => p.id === Number(req.params.id));

    if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
    }

    const { name, type, age, adopted } = req.body;

    if (
        typeof name !== "string" || !name.trim() ||
        typeof type !== "string" || !type.trim() ||
        !Number.isInteger(age) || age < 0 ||
        typeof adopted !== "boolean"
    ) {
        return res.status(400).json({
            message: "Provide all fields with valid values"
        });
    }

    pet.name = name.trim();
    pet.type = type.trim();
    pet.age = age;
    pet.adopted = adopted;

    res.status(200).json({
        message: "Pet updated successfully",
        pet
    });
});

// DELETE: Remove a pet
app.delete("/pets/:id", (req, res) => {
    const index = pets.findIndex(
        p => p.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({ message: "Pet not found" });
    }

    const deletedPet = pets.splice(index, 1)[0];

    res.status(200).json({
        message: "Pet deleted successfully",
        pet: deletedPet
    });
});

// Start the server
app.listen(PORT, "127.0.0.1", () => {
    console.log(`Pet Centre API running at http://localhost:${PORT}`);
});
