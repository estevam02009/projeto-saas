const express = require("express");
const Categoria = require("../models/Categoria");

const router = express.Router();

// Criar nova categoria
router.post("/", async (req, res) => {
    try {
        const novaCategoria = await Categoria.create(req.body);
        res.status(201).json(novaCategoria);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

// listar todas as categorias
router.get("/", async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

module.exports = router;