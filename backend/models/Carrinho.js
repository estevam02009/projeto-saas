const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente');
const Produto = require('./Produto');

const Carrinho = sequelize.define('Carrinho', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cliente_id: { 
        type: DataTypes.INTEGER, 
        references: { model: Cliente, key: 'id' }, // Fixed the key reference
        allowNull: false, 
    },
    produto_id: { 
        type: DataTypes.INTEGER,
        references: { model: Produto, key: 'id' },
        allowNull: false,
     },
     quantidade: { type: DataTypes.INTEGER, allowNull: false },
     subtotal: { type: DataTypes.FLOAT, allowNull: false },
}, { timestamps: true });

Carrinho.belongsTo(Cliente, { foreignKey: 'cliente_id' });
Carrinho.belongsTo(Produto, { foreignKey: 'produto_id' });

module.exports = Carrinho;
