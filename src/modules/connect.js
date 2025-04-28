const mongoose = require("mongoose");

const connectToDatabase = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@teste01.knkrwsq.mongodb.net/?retryWrites=true&w=majority&appName=teste01`,
            
        );
        console.log("Conexão com o banco de dados estabelecida com sucesso!");
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error);
    }
};

module.exports = connectToDatabase;