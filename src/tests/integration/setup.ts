import { OrderService } from '../../services/orderService';

// Global setup
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.PORT = '8081'; // Use different port for testing
});

// Clear data before each test
beforeEach(() => {
  // Reset the OrderService state
  const orderService = new OrderService();
  // Clear any test data if needed
});

// Cleanup after tests
afterAll(() => {
  // Cleanup any resources if needed
}); 