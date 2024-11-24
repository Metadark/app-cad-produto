import { Observable, confirm } from '@nativescript/core';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { navigate } from '../../utils/navigation';

export class CustomerDetailViewModel extends Observable {
  private customerService: CustomerService;
  private _customer: Customer;
  private _isNew: boolean;

  constructor(context: { customerId?: number; isNew?: boolean }) {
    super();
    this.customerService = new CustomerService();
    this._isNew = context.isNew || false;
    this._customer = {
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: ''
    };

    if (!this._isNew && context.customerId) {
      this.loadCustomer(context.customerId);
    }
  }

  get customer(): Customer {
    return this._customer;
  }

  get isNew(): boolean {
    return this._isNew;
  }

  async loadCustomer(id: number) {
    try {
      this._customer = await this.customerService.getCustomer(id);
      this.notifyPropertyChange('customer', this._customer);
    } catch (error) {
      console.error('Error loading customer:', error);
    }
  }

  async onSave() {
    try {
      await this.customerService.saveCustomer(this._customer);
      navigate('pages/customers/customers-page', {
        clearHistory: true
      });
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  }

  async onDelete() {
    try {
      const result = await confirm({
        title: 'Delete Customer',
        message: 'Are you sure you want to delete this customer?',
        okButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      });

      if (result) {
        await this.customerService.deleteCustomer(this._customer.id);
        navigate('pages/customers/customers-page', {
          clearHistory: true
        });
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  }

  onViewOrders() {
    navigate('pages/work-orders/work-orders-page', {
      context: { customerId: this._customer.id }
    });
  }

  onViewAppointments() {
    navigate('pages/appointments/appointments-page', {
      context: { customerId: this._customer.id }
    });
  }
}