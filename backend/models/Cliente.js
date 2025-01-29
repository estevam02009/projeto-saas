const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cliente = sequelize.define('Clientes', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    telefone: { type: DataTypes.STRING, allowNull: true },
    endereco: { type: DataTypes.STRING, allowNull: true },
}, { timestamps: true });

module.exports = Cliente;