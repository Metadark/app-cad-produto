import { Observable } from '@nativescript/core';
import { getDatabase } from '../../services/database.service';
import { navigate } from '../../utils/navigation';

export class DashboardViewModel extends Observable {
  private _productCount: number = 0;
  private _lowStockCount: number = 0;

  constructor() {
    super();
    this.loadDashboardData();
  }

  get productCount(): number {
    return this._productCount;
  }

  get lowStockCount(): number {
    return this._lowStockCount;
  }

  async loadDashboardData() {
    const db = getDatabase();
    
    // Get product count
    const productResult = await db.get('SELECT COUNT(*) as count FROM products');
    this._productCount = productResult[0].count;
    
    // Get low stock count
    const lowStockResult = await db.get(
      'SELECT COUNT(*) as count FROM products WHERE quantity <= low_stock_threshold'
    );
    this._lowStockCount = lowStockResult[0].count;
    
    this.notifyPropertyChange('productCount', this._productCount);
    this.notifyPropertyChange('lowStockCount', this._lowStockCount);
  }

  onNavigateToProducts() {
    navigate('pages/products/products-page');
  }

  onNavigateToCustomers() {
    navigate('pages/customers/customers-page');
  }

  onNavigateToAppointments() {
    navigate('pages/appointments/appointments-page');
  }

  onNavigateToWorkOrders() {
    navigate('pages/work-orders/work-orders-page');
  }

  onLogout() {
    // TODO: Implement logout logic
    navigate('pages/login/login-page', { clearHistory: true });
  }
}