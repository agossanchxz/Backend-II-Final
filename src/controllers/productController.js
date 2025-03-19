import Product from '../models/product.model.js';

class ProductController {
  handleErrorResponse(res, message, error, statusCode = 500) {
    console.error(message, error);
    return res.status(statusCode).json({ message, error: error.message || error });
  }

  async createProduct(req, res) {
    const { title, description, code, price, img, stock } = req.body;

    if (!title || !description || !code || !price || stock === undefined) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios excepto la imagen' });
    }
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: 'El precio debe ser un número positivo' });
    }
    if (!Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({ message: 'El stock debe ser un número entero no negativo' });
    }

    try {
      const existingProduct = await Product.findOne({ code });
      if (existingProduct) {
        return res.status(400).json({ message: 'El código del producto ya existe' });
      }

      const newProduct = await Product.create({ title, description, code, price, img, stock });
      res.status(201).json({ message: 'Producto creado con éxito', product: newProduct });
    } catch (error) {
      this.handleErrorResponse(res, 'Error creando producto:', error);
    }
  }

  async updateProduct(req, res) {
    const productId = req.params.id;
    const updateFields = req.body;

    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] === undefined) delete updateFields[key];
    });

    try {
      const updatedProduct = await Product.findByIdAndUpdate(productId, updateFields, { new: true });
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.status(200).json({ message: 'Producto actualizado con éxito', product: updatedProduct });
    } catch (error) {
      this.handleErrorResponse(res, 'Error actualizando producto:', error);
    }
  }

  async deleteProduct(req, res) {
    const productId = req.params.id;
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.status(200).json({ message: 'Producto eliminado con éxito', product: deletedProduct });
    } catch (error) {
      this.handleErrorResponse(res, 'Error eliminando producto:', error);
    }
  }

  async getProducts(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const query = search ? { title: new RegExp(search, 'i') } : {}; // Búsqueda por título

      const products = await Product.find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const totalProducts = await Product.countDocuments(query);

      res.status(200).json({
        totalProducts,
        page: parseInt(page),
        totalPages: Math.ceil(totalProducts / limit),
        products,
      });
    } catch (error) {
      this.handleErrorResponse(res, 'Error obteniendo productos:', error);
    }
  }
}

export default ProductController;
