import { Application } from '@nativescript/core';
import { initializeDatabase } from './services/database.service';

// Initialize the database before starting the app
initializeDatabase()
  .then(() => {
    Application.run({ moduleName: 'app-root' });
  })
  .catch(error => {
    console.error('Failed to initialize database:', error);
  });