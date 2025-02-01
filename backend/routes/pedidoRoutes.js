const express = require("express");
const Pedido = require("../models/Pedido");
const Cliente = require("../models/Cliente");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { cliente_id, total } = req.body;

    // Criar pedido
    const pedido = await Pedido.create({ cliente_id, total });

    // 🔥 Notificar a cozinha em tempo real
    const io = req.app.get("socketio");
    Object.keys(cozinheirosConectados).forEach((socketId) => {
      io.to(socketId).emit("novoPedido", pedido);
    });

    res.status(201).json(pedido);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// router.post("/", async (req, res) => {
//   try {
//     const { cliente_id, total } = req.body;

//     // Criar pedido
//     const pedido = await Pedido.create({
//       cliente_id,
//       total,
//     });

//     // 🔥 Notificar a cozinha em tempo real
//     const io = req.app.get("socketio");
//     cozinheirosConectados.forEach((socketId) => {
//       io.to(socketId).emit("novoPedido", pedido);
//     });
    
//     // Verificar se o cliente existe
//     const cliente = await Cliente.findByPk(cliente_id);
//     if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado" });

//     const novoPedido = await Pedido.create({ cliente_id, total });
//     res.status(201).json(novoPedido);
//   } catch (error) {
//     res.status(400).json({ erro: error.message });
//   }
// });

// Criar um novo pedido
// router.post("/", async (req, res) => {
//   try {
//     const novoPedido = await Pedido.create(req.body);
//     res.status(201).json(novoPedido);
//   } catch (error) {
//     res.status(400).json({ erro: error.message });
//   }
// });

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

    // 🔥 Obter ID do cliente e socket correspondente
    const io = req.app.get("soket.io");
    const socketId = clientesConectados[pedido.cliente.id];
    if (socketId) {
      io.emit("pedidoAtualizado", { id: pedido.id, status: pedido.status });
    }
    
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
