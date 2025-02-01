const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./config/database");
const pedidoRoutes = require("./routes/pedidoRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const carrinhoRoutes = require("./routes/carrinhoRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const cozinheirosConectados = {}; // 🔥 Agora está declarado globalmente!
const clientesConectados = {}; // 🔥 Lista de clientes conectados

io.on("connection", (socket) => {
  console.log(`🟢 Nova conexão: ${socket.id}`);

  // Registrar conexão da cozinha
  socket.on("registrarCozinha", () => {
    cozinheirosConectados[socket.id] = true;
    console.log(`👨‍🍳 Cozinha conectada: ${socket.id}`);
  });

  // Registrar cliente pelo ID
  socket.on("registrarCliente", (cliente_id) => {
    clientesConectados[cliente_id] = socket.id;
    console.log(`✅ Cliente ${cliente_id} registrado com socket ${socket.id}`);
  });

  // Desconectar clientes ou cozinheiros
  socket.on("disconnect", () => {
    if (cozinheirosConectados[socket.id]) {
      delete cozinheirosConectados[socket.id];
      console.log(`🔴 Cozinha desconectada: ${socket.id}`);
    }

    const clienteId = Object.keys(clientesConectados).find(
      (key) => clientesConectados[key] === socket.id
    );
    if (clienteId) delete clientesConectados[clienteId];

    console.log(`🔴 Cliente/Cozinha desconectado: ${socket.id}`);
  });
});

app.use(cors());
app.use(express.json());
app.use("/pedidos", pedidoRoutes);
app.use("/clientes", clienteRoutes);
app.use("/carrinho", carrinhoRoutes);

app.set("socketio", io);

const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  server.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
});
