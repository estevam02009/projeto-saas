const express = require("express");
const cors = require("cors");
const http = require("http"); // Cria um servidor http.
const { Server } = require("socket.io"); // importa o socket.io

const sequelize = require("./config/database");
const pedidoRoutes = require("./routes/pedidoRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const carrinhoRoutes = require("./routes/carrinhoRoutes");

const app = express();
const server = http.createServer(app); // Cria um servidor http.

const io = new Server(server, { // Renamed from 'server' to 'io'
  cors: { origin: "*" }, // permitir operações de qualquer origem
}); // Cria um servidor com socket.io

app.use(cors());
app.use(express.json());

// Rotas
app.use("/pedidos", pedidoRoutes);
app.use("/clientes", clienteRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/produtos", produtoRoutes);
app.use("/carrinho", carrinhoRoutes);

// Evento WebSocket quando um cliente se conecta
io.on("connection", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);
  // Evento WebSocket quando um cliente se desconecta
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// Middleware para permitir que os WebSockets sejam usados em rotas.
app.set('socket.io', io);

// Exportando a imagem
app.use("/uploads", express.static("uploads"));

// Iniciar o servidor e sincronizar com MySQL
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
});
