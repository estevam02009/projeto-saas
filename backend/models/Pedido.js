const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Cliente = require("./Cliente");

const Pedido = sequelize.define("Pedido", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Cliente, key: "id" }  // 🔗 Ligando com a tabela Cliente
    },
    status: {
        type: DataTypes.ENUM("Pendente", "Preparando", "Pronto", "Finalizado"),
        defaultValue: "Pendente"
    },
    total: { type: DataTypes.FLOAT, allowNull: false },
}, { timestamps: true });

Pedido.belongsTo(Cliente, { foreignKey: "cliente_id" }); // 🔗 Criando a relação
Cliente.hasMany(Pedido, { foreignKey: "cliente_id" });

module.exports = Pedido;