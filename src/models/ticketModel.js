import mongoose from "mongoose";
const ticketSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    purchase_datetime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "El monto debe ser mayor o igual a 0"], 
    },
    purchaser: {
      type: String,
      required: true,
      match: [/\S+@\S+\.\S+/, "Por favor ingrese un correo válido"],
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", 
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "La cantidad mínima es 1"], 
        },
      },
    ],
  },
  {
    timestamps: true, 
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;