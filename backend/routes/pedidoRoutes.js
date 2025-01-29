const express = require("express");
const Pedido = require("../models/Pedido");

const router = express.Router();

// Criar um novo pedido
router.post("/", async (req, res) => {
  try {
    const novoPedido = await Pedido.create(req.body);
    res.status(201).json(novoPedido);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// Obter todos os pedidos
router.get("/", async (req, res) => {
  try {
    const pedidos = await Pedido.findAll();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Atualizar status do pedido
router.put("/:id", async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ erro: "Pedido não encontrado" });

    pedido.status = req.body.status;
    await pedido.save();
    
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Deletar um pedido
router.delete("/:id", async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ erro: "Pedido não encontrado" });

    await pedido.destroy();
    res.json({ mensagem: "Pedido deletado" });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
