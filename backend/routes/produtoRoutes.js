const express = require("express");
const Produto = require("../models/Produto");
const Categoria = require("../models/Categoria");
// const uploads = require("../config/upload");
const upload = require("../config/multer");

const router = express.Router();

// Criar Novo produto
router.post("/", upload.single("imagem"), async (req, res) => {
    try {
        const { nome, descricao, preco, categoria_id } = req.body;

        // Verificar se a categoria existe
        const categoria = await Categoria.findByPk(categoria_id);
        if (!categoria) return res.status(404).json({ erro: "Categoria não encontrada." });

        // Caminho de uma imagem
        const imagem = req.file ? `/uploads/${req.file.filename}` : null;

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
        if (!produto) return res.status(404).json({ erro: "Produto não encontrado." });

        req.json(produto);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Atualizar um produto (com opção de imagem).
router.put("/:id", upload.single("imagem"), async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);
        if (!produto) return res.status(404).json({ erro: "Produto não encontrado" });

        // se tiver uma nova imagem, atualizar o caminho
        if(req.file) req.body.imagem = `/uploads/${req.file.filename}`;

        await produto.update(req.body);
        res.json(produto);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Servir imagems da pasta uploads
router.use("/uploads", express.static('uploads'));

// Deletar um produto
router.delete("/:id", async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);
        if (!produto) return res.status(404).json({ erro: "Produto não encontrado" });

        await produto.destroy();
        res.json({ mensagem: "Produto removido com sucesso" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

module.exports = router;