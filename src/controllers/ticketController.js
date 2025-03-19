import Ticket from "../models/ticketModel.js";
import Product from "../models/product.model.js";

export const createTicket = async (req, res) => {
    try {
        const { purchaser, products } = req.body;

        let totalAmount = 0;
        const productsData = [];
        for (let item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(400).json({ error: "Producto no encontrado" });
            }
            totalAmount += product.price * item.quantity;
            productsData.push({ product: item.product, quantity: item.quantity });
        }

        const code = `TICKET-${Date.now()}`;

        const newTicket = new Ticket({ purchaser, products: productsData, amount: totalAmount, code });
        await newTicket.save();

        res.status(201).json(newTicket);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el ticket" });
    }
};

export const getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los tickets" });
    }
};

export const getTicketByCode = async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ code: req.params.code }).populate("products.product");
        if (!ticket) return res.status(404).json({ error: "Ticket no encontrado" });

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el ticket" });
    }
};
