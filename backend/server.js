const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const pedidoRoutes = require("./routes/pedidoRoutes");
const clienteRoutes = require("./routes/ClienteRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/pedidos", pedidoRoutes);
app.use("/clientes", clienteRoutes);

// Iniciar o servidor e sincronizar com MySQL
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
});
