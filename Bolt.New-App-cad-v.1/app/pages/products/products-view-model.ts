import { Observable } from '@nativescript/core';
import { Product, ProductFilter } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { navigate } from '../../utils/navigation';

export class ProductsViewModel extends Observable {
  private productService: ProductService;
  private _products: Product[] = [];
  private _searchText: string = '';
  private filter: ProductFilter = {};

  constructor() {
    super();
    this.productService = new ProductService();
    this.loadProducts();
  }

  get products(): Product[] {
    return this._products;
  }

  get searchText(): string {
    return this._searchText;
  }

  set searchText(value: string) {
    if (this._searchText !== value) {
      this._searchText = value;
      this.notifyPropertyChange('searchText', value);
    }
  }

  async loadProducts() {
    try {
      this.filter.searchText = this._searchText;
      this._products = await this.productService.getProducts(this.filter);
      this.notifyPropertyChange('products', this._products);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  onSearch() {
    this.loadProducts();
  }

  onClearSearch() {
    this.searchText = '';
    this.loadProducts();
  }

  onShowFilters() {
    // TODO: Show filter dialog
    console.log('Show filters');
  }

  async onScanBarcode() {
    try {
      const barcode = await this.productService.scanBarcode();
      // Search for product with scanned barcode
      this.searchText = barcode;
      this.loadProducts();
    } catch (error) {
      console.error('Error scanning barcode:', error);
    }
  }

  onAddProduct() {
    navigate('pages/products/product-detail-page', {
      context: { isNew: true }
    });
  }

  onProductTap(args: any) {
    const product = this._products[args.index];
    navigate('pages/products/product-detail-page', {
      context: { productId: product.id }
    });
  }
}