const express = require("express");
const Cliente = require("../models/Cliente");
// const Cliente = require("../models/Cliente");

const router = express.Router();

// Criar um novo cliente
router.post('/', async (req, res) => {
    try {
        const novoCliente = await Cliente.create(req.body);
        res.status(201).json(novoCliente);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

// Listar todos os clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Obter um cliente pelo ID
router.get('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if(!cliente) return res.status(404).json({ erro: "Cliente não encontrado." });

        res.json(cliente);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Atualizar um cliente
router.put('/:id', async (req, res) => {
    try {
        const Cliente = await Cliente.findByPk(req.params.id);
        if(!cliente) return res.status(404).json({ erro: "Cliente não encontrado." });

        await cliente.update(req.body);
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Deletar um Cxliente
router.delete('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if(!cliente) return res.status(404).json({ erro: "Cliente não encontrado." });

        await cliente.destroy();
        res.json({ message: "Cliente deletado com sucesso." });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

module.exports = router;