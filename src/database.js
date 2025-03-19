import mongoose from 'mongoose';
import app from './app.js';
import initializeProducts from './initProducts.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/backend2';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');


    await initializeProducts();


    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(' Error en la conexión a MongoDB:', error);
    process.exit(1); 
  }
};

connectDB();