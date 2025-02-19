import mongoose from "mongoose"

mongoose.connect("mongodb+srv://agossanchxz:Machain4229@cluster0.0stmk.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=Cluster0")

.then(() => console.log("Conectados a la BD"))
.catch( (error) => console.log("Error al conectarse", error ))