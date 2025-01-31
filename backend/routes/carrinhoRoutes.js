const express = require('express');
const Carrinho = require('../models/Carrinho');
const Produto = require('../models/Produto');
const Pedido = require('../models/Pedido');

const router = express.Router();

// Adicionar produto ao carrinho
router.post('/', async (req, res) => {
    try {
        const { cliente_id, produto_id, quantidade } = req.body;

        // Verificar se o produto existe
        const produto = await Produto.findByPk(produto_id);
        if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado' });

        // Calcular subtotal
        const subtotal = produto.preco * quantidade;

        // Adicionar ao carrinho
        const item = await Carrinho.create({
            cliente_id,
            produto_id,
            quantidade,
            subtotal
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ erro: error.mensagem });
    }
});

router.post("/finalizar/:cliente_id", async (req, res) => {
    try {
        const cliente_id = req.params.cliente_id;

        // Buscar itens do carrinho
        const carrinho = await Carrinho.findAll({ where: { cliente_id } });

        if (carrinho.length === 0) {
            return res.status(400).json({ erro: "Carrinho está vazio" });
        }

        // Calcular total
        const total = carrinho.reduce((sum, item) => sum + item.subtotal, 0);

        // Criar o pedido
        const pedido = await Pedido.create({ cliente_id, total });

        // Esvaziar o carrinho após finalizar pedido
        await Carrinho.destroy({ where: { cliente_id } });

        res.status(201).json({ mensagem: "Pedido criado!", pedido });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});


// listar items do carrinho
router.get('/', async (req, res) => {
    try {
        const carrinho = await Carrinho.findAll({
            where: { cliente_id: req.params.cliente_id },
            include: Produto
        });

        // Calcular total do carrinho
        const total = carrinho.reduce((sum, item) => sum + item.subtotal, 0);
        res.json({ items: carrinho, total });
    } catch (error) {
        res.status(500).json({ erro: error.mensagem });
    }
});

// Atualizar a quantdade de um item no carrinho
router.put('/:id', async (req, res) => {
    try {
        const item = await Carrinho.findByPk(req.params.id);
        if (!item) return res.status(404).json({ mensagem: 'Item não encontrado' });

        const produto = await Produto.findByPk(item.produto_id);
        if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado' });

        // Atualizar quantidade e subtotal
        item.quantidade = req.body.quantidade;
        item.subtotal = produto.preco * item.quantidade;
        await item.save();

        res.json(item);
    } catch (error) {
        res.status(500).json({ erro: error.mensagem });
    }
});

// Remover item do carrinho
router.delete('/:id', async (req, res) => {
    try {
        const item = await Carrinho.findByPk(req.params.id);
        if (!item) return res.status(404).json({ mensagem: 'Item não encontrado' });

        await item.destroy();
        res.json({ mensagem: 'Item removido com sucesso' });
    } catch (error) {
        res.status(500).json({ erro: error.mensagem });
    }
});

// Esvaziar o carrinho de um cliente
router.delete('/cliente/:cliente_id', async (req, res) => {
    try {
        await Carrinho.destroy({ where: { cliente_id: req.params.cliente_id } });
        res.json({ mensagem: 'Carrinho esvaziado com sucesso' });
    } catch (error) {
        res.status(500).json({ erro: error.mensagem });
    }
});

module.exports = router;