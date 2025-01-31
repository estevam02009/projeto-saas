const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const pedidoRoutes = require("./routes/pedidoRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const carrinhoRoutes = require("./routes/carrinhoRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/pedidos", pedidoRoutes);
app.use("/clientes", clienteRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/produtos", produtoRoutes);
app.use("/carrinho", carrinhoRoutes);

// Exportando  aimage,
app.use("/uploads", express.static("uploads"));

// Iniciar o servidor e sincronizar com MySQL
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
});
