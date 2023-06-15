const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];

    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      console.log('Error al leer el archivo:', error);
    }
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    product.id = this.#getId();

    if (this.validarCampos(product)) {
      const codeRepe = this.products.some((existingProduct) => existingProduct.code === code);
      if (codeRepe) {
        console.log('Código repetido');
      } else {
        this.products.push(product);
        this.saveProductsToFile();
      }
    }
  }

  #getId() {
    const oldId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
    return oldId + 1;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updatedFields,
    };

    this.saveProductsToFile();
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }

    this.products.splice(productIndex, 1);
    this.saveProductsToFile();
  }

  saveProductsToFile() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      fs.writeFileSync(this.path, data, 'utf-8');
    } catch (error) {
      console.log('Error al escribir en el archivo:', error);
    }
  }

  validarCampos(product) {
    const values = Object.values(product);
    return values.every((valor) => valor !== null && valor !== undefined && valor.length !== 0);
  }
}

//-----------TEST-----------//
const pm = new ProductManager('products.json');
console.log(pm.getProducts()); // []

pm.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);
console.log(pm.getProducts()); // [ { id: 1, title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 } ]

const product = pm.getProductById(1);
console.log(product); // { id: 1, title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 }

pm.updateProduct(1, { price: 250 });
console.log(pm.getProductById(1)); // { id: 1, title: 'producto prueba', description: 'Este es un producto prueba', price: 250, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 }

pm.deleteProduct(1);
console.log(pm.getProducts()); // []
