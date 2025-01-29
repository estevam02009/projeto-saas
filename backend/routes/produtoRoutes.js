const express = require("express");
const Produto = require("../models/Produto");
const Categoria = require("../models/Categoria");

const router = express.Router();

// Criar Novo produto
router.post("/", async (req, res) => {
    try {
        const { nome, descricao, preco, categoria_id, imagem } = req.body;

        // Verificar se a categoria existe
        const categoria = await Categoria.findByPk(categoria_id);
        if(!categoria) return res.status(404).json({ erro: "Categoria não encontrada." });

        const novoProduto = await Produto.create({ nome, descricao, preco, categoria_id, imagem });
        res.status(201).json(novoProduto);
    } catch (error) {
        res.status().json({ erro: error.message });
    }
});

// listar todos os produtos
router.get("/", async (req, res) => {
    try {
        const produtos = await Produto.findAll({ include: Categoria });
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Listar produto por ID
router.get("/:id", async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id, { include: Categoria });
        if(!produto) return res.status(404).json({ erro: "Produto não encontrado." });

        req.json(produto);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});