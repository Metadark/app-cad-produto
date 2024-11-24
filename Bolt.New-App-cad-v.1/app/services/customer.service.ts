import { Sqlite } from '@nativescript/sqlite';
import { getDatabase } from './database.service';
import { Customer, CustomerFilter } from '../models/customer.model';

export class CustomerService {
  private db: Sqlite;

  constructor() {
    this.db = getDatabase();
  }

  async getCustomers(filter?: CustomerFilter): Promise<Customer[]> {
    let query = 'SELECT * FROM customers WHERE 1=1';
    const params: any[] = [];

    if (filter?.searchText) {
      query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      params.push(
        `%${filter.searchText}%`,
        `%${filter.searchText}%`,
        `%${filter.searchText}%`
      );
    }

    if (filter?.sortBy) {
      query += ` ORDER BY ${filter.sortBy} ${filter.sortOrder || 'asc'}`;
    }

    return this.db.all(query, params);
  }

  async getCustomer(id: number): Promise<Customer> {
    const result = await this.db.get('SELECT * FROM customers WHERE id = ?', [id]);
    return result[0];
  }

  async saveCustomer(customer: Customer): Promise<number> {
    if (customer.id) {
      await this.db.execSQL(
        `UPDATE customers 
         SET name = ?, email = ?, phone = ?, address = ?, notes = ?
         WHERE id = ?`,
        [
          customer.name,
          customer.email,
          customer.phone,
          customer.address,
          customer.notes,
          customer.id
        ]
      );
      return customer.id;
    } else {
      const result = await this.db.execSQL(
        `INSERT INTO customers 
         (name, email, phone, address, notes)
         VALUES (?, ?, ?, ?, ?)`,
        [
          customer.name,
          customer.email,
          customer.phone,
          customer.address,
          customer.notes
        ]
      );
      return result.insertId;
    }
  }

  async deleteCustomer(id: number): Promise<void> {
    await this.db.execSQL('DELETE FROM customers WHERE id = ?', [id]);
  }
}