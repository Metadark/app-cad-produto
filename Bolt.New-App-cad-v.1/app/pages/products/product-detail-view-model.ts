import { Observable } from '@nativescript/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { navigate } from '../../utils/navigation';

export class ProductDetailViewModel extends Observable {
  private productService: ProductService;
  private _product: Product;
  private _isNew: boolean;

  constructor(context: { productId?: number; isNew?: boolean }) {
    super();
    this.productService = new ProductService();
    this._isNew = context.isNew || false;
    this._product = {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      low_stock_threshold: 5
    };

    if (!this._isNew && context.productId) {
      this.loadProduct(context.productId);
    }
  }

  get product(): Product {
    return this._product;
  }

  get isNew(): boolean {
    return this._isNew;
  }

  async loadProduct(id: number) {
    try {
      this._product = await this.productService.getProduct(id);
      this.notifyPropertyChange('product', this._product);
    } catch (error) {
      console.error('Error loading product:', error);
    }
  }

  async onSave() {
    try {
      await this.productService.saveProduct(this._product);
      navigate('pages/products/products-page', {
        clearHistory: true
      });
    } catch (error) {
      console.error('Error saving product:', error);
    }
  }

  async onScanBarcode() {
    try {
      this._product.barcode = await this.productService.scanBarcode();
      this.notifyPropertyChange('product', this._product);
    } catch (error) {
      console.error('Error scanning barcode:', error);
    }
  }
}