import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Management System API',
      version: '2.0.0',
      description: 'API documentation for Order Management System',
      contact: {
        name: 'API Support',
        url: 'http://localhost:8080/api-docs'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8080}`,
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Orders',
        description: 'Order management endpoints (Latest version)'
      },
      {
        name: 'Orders V1',
        description: 'Version 1 of order management endpoints'
      },
      {
        name: 'Orders V2',
        description: 'Version 2 of order management endpoints with enhanced features'
      }
    ],
    externalDocs: {
      description: 'API Documentation',
      url: '/api-docs'
    }
  },
  apis: ['./src/routes/**/*.ts']
};

export const specs = swaggerJsdoc(options); 