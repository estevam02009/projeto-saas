const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Categoria = require("./Categoria");

const Produto = sequelize.define("Produto", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.STRING, allowNull: true },
    preco: { type: DataTypes.FLOAT, allowNull: false },
    imagem: { type:DataTypes.STRING, allowNull: true }, // URL da imagem
    categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Categoria, key: "id" }
    }
}, { timestamps: true });

// Relacionamneto: Uma categoria pode ter varios produtos
Produto.belongsTo(Categoria, { foreignKey: "categoria_id" });
Categoria.hasMany(Produto, { foreignKey: "categoria_id" });

module.exports = Produto;