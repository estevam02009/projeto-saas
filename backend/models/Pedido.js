const {  DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pedido = sequelize.define('pedido', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cliente_nome: { type: DataTypes.STRING, allowNull: false },
    status: {
        type: DataTypes.ENUM("pendente", "Preparando", "Pronto", "Finaçlizado"),
        defaultValue: "Pendente"
    },
    totel: { type: DataTypes.FLOAT, allowNull: false },
}, { timestamps: true });

module.exports = Pedido;