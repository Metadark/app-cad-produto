import { Sqlite } from '@nativescript/sqlite';
import { getDatabase } from './database.service';
import { Product, ProductFilter } from '../models/product.model';
import { BarcodeScanner } from '@nativescript/barcodescanner';

export class ProductService {
  private db: Sqlite;
  private barcodeScanner: BarcodeScanner;

  constructor() {
    this.db = getDatabase();
    this.barcodeScanner = new BarcodeScanner();
  }

  async getProducts(filter?: ProductFilter): Promise<Product[]> {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (filter?.searchText) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${filter.searchText}%`, `%${filter.searchText}%`);
    }

    if (filter?.lowStock) {
      query += ' AND quantity <= low_stock_threshold';
    }

    if (filter?.sortBy) {
      query += ` ORDER BY ${filter.sortBy} ${filter.sortOrder || 'asc'}`;
    }

    return this.db.all(query, params);
  }

  async getProduct(id: number): Promise<Product> {
    const result = await this.db.get('SELECT * FROM products WHERE id = ?', [id]);
    return result[0];
  }

  async saveProduct(product: Product): Promise<number> {
    if (product.id) {
      await this.db.execSQL(
        `UPDATE products 
         SET name = ?, description = ?, price = ?, quantity = ?, 
             low_stock_threshold = ?, barcode = ?, location = ?
         WHERE id = ?`,
        [
          product.name,
          product.description,
          product.price,
          product.quantity,
          product.low_stock_threshold,
          product.barcode,
          product.location,
          product.id
        ]
      );
      return product.id;
    } else {
      const result = await this.db.execSQL(
        `INSERT INTO products 
         (name, description, price, quantity, low_stock_threshold, barcode, location)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          product.name,
          product.description,
          product.price,
          product.quantity,
          product.low_stock_threshold,
          product.barcode,
          product.location
        ]
      );
      return result.insertId;
    }
  }

  async scanBarcode(): Promise<string> {
    const available = await this.barcodeScanner.available();
    if (available) {
      const result = await this.barcodeScanner.scan({
        formats: 'QR_CODE, EAN_13, EAN_8, UPC_A',
        showFlipCameraButton: true,
        preferFrontCamera: false,
        showTorchButton: true,
        beepOnScan: true,
        torchOn: false,
        resultDisplayDuration: 500,
      });
      return result.text;
    }
    throw new Error('Barcode scanner not available');
  }
}