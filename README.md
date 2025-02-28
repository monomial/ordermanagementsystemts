# Order Management System API

A TypeScript-based RESTful API for managing orders with versioned endpoints, built with Express.js.

## Features

- **API Versioning** (v1 and v2)
- **Swagger Documentation**
- **Rate Limiting**
- **Error Handling**
- **Request Logging**
- **Security Headers**
- **CORS Support**
- **Health Check Endpoint**

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/monomial/ordermanagementsystemts.git
cd ordermanagementsystemts
```

2. Install dependencies:
```bash
npm install
```

3. Configure Environment:
The repository includes a default `.env` file with the following settings:
```env
NODE_ENV=development
PORT=8080
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=debug
```

⚠️ **Security Note**: The `.env` file is currently in source control. For production deployments:
- Create a new `.env` file with your secure settings
- Never commit sensitive credentials to source control
- Consider using environment-specific configuration management

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Running Tests
```bash
npm test
```

For running individual test files:
```bash
yarn test:single <filepath>
```

## API Documentation

The API documentation is available through Swagger UI when the application is running:
- Swagger UI: `http://localhost:8080/api-docs`
- Swagger JSON: `http://localhost:8080/api-docs/swagger.json`

### API Versions

#### V1 Endpoints (`/api/v1/orders`)
- `POST /` - Create a new order
- `GET /` - Get all active orders
- `GET /all` - Get all orders (including completed)
- `PUT /:id` - Update order status

#### V2 Endpoints (`/api/v2/orders`)
Enhanced version with additional features:
- `POST /` - Create a new order (with quantity)
- `GET /` - Get active orders with pagination
- `GET /all` - Get all orders with pagination
- `PUT /:id` - Update order status

### Example Requests

#### Create Order (V1)
```bash
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{"item": "Pizza"}'
```

#### Create Order (V2)
```bash
curl -X POST http://localhost:8080/api/v2/orders \
  -H "Content-Type: application/json" \
  -d '{"item": "Pizza", "quantity": 2}'
```

#### Get Orders with Pagination (V2)
```bash
curl http://localhost:8080/api/v2/orders?page=1&limit=10
```

## Project Structure

```
src/
├── config/
│   ├── logger.ts
│   └── swagger.ts
├── controllers/
│   └── orderController.ts
├── middleware/
│   ├── errorHandler.ts
│   └── rateLimit.ts
├── routes/
│   ├── v1/
│   │   └── orderRoutes.ts
│   └── v2/
│       └── orderRoutes.ts
├── services/
│   └── orderService.ts
├── types/
│   └── order.ts
└── app.ts
```

## Features in Detail

### Rate Limiting
- 100 requests per 15-minute window by default
- Configurable through environment variables

### Logging
- Console logging in development
- File-based logging for production
- HTTP request logging with Morgan
- Error logging with Winston

### Security
- Helmet for security headers
- CORS enabled
- Input validation
- Error handling middleware

### Health Check
- Endpoint: `GET /health`
- Returns server status

## Error Handling

The API uses standardized error responses:

```json
{
  "status": "error",
  "message": "Error description"
}
```

HTTP Status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
