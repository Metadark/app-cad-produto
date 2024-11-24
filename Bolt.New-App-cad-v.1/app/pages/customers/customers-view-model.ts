import { Observable } from '@nativescript/core';
import { Customer, CustomerFilter } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { navigate } from '../../utils/navigation';

export class CustomersViewModel extends Observable {
  private customerService: CustomerService;
  private _customers: Customer[] = [];
  private _searchText: string = '';
  private filter: CustomerFilter = {};

  constructor() {
    super();
    this.customerService = new CustomerService();
    this.loadCustomers();
  }

  get customers(): Customer[] {
    return this._customers;
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

  async loadCustomers() {
    try {
      this.filter.searchText = this._searchText;
      this._customers = await this.customerService.getCustomers(this.filter);
      this.notifyPropertyChange('customers', this._customers);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  }

  onSearch() {
    this.loadCustomers();
  }

  onClearSearch() {
    this.searchText = '';
    this.loadCustomers();
  }

  onAddCustomer() {
    navigate('pages/customers/customer-detail-page', {
      context: { isNew: true }
    });
  }

  onCustomerTap(args: any) {
    const customer = this._customers[args.index];
    navigate('pages/customers/customer-detail-page', {
      context: { customerId: customer.id }
    });
  }
}