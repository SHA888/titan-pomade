# API Documentation

This document provides detailed information about the Titan Pomade API, including available endpoints, request/response formats, and authentication methods.

## Base URL

```
https://api.yourdomain.com/v1
```

For local development:
```
http://localhost:3001/v1
```

## Authentication

Most API endpoints require authentication using JWT (JSON Web Tokens).

### Obtaining a Token

1. **Login**
   ```http
   POST /auth/login
   Content-Type: application/json
   
   {
     "email": "user@example.com",
     "password": "yourpassword"
   }
   ```

   Response:
   ```json
   {
     "success": true,
     "data": {
       "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "user": {
         "id": "123",
         "email": "user@example.com",
         "name": "John Doe"
       }
     }
   }
   ```

2. **Using the Token**
   Include the token in the `Authorization` header:
   ```
   Authorization: Bearer your.jwt.token.here
   ```

### Refreshing Tokens

```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your.refresh.token.here"
}
```

## API Endpoints

### Users

#### Get Current User
```http
GET /users/me
Authorization: Bearer your.jwt.token.here
```

#### Update User
```http
PATCH /users/me
Authorization: Bearer your.jwt.token.here
Content-Type: application/json

{
  "name": "New Name",
  "email": "new.email@example.com"
}
```

### Products

#### List Products
```http
GET /products
```

#### Get Product by ID
```http
GET /products/:id
```

#### Create Product (Admin Only)
```http
POST /products
Authorization: Bearer your.jwt.token.here
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "stock": 100
}
```

## Search

### Search Products
```http
GET /search?q=query&limit=10&offset=0
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details"
  }
}
```

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

- 100 requests per 15 minutes per IP address for unauthenticated requests
- 1000 requests per 15 minutes per user for authenticated requests

## Webhooks

### Available Webhooks

#### Order Created
Triggered when a new order is created.

**Payload:**
```json
{
  "event": "order.created",
  "data": {
    "id": "order_123",
    "amount": 99.99,
    "status": "pending",
    "customer": {
      "id": "cust_123",
      "email": "customer@example.com"
    }
  }
}
```

## Versioning

API versioning is handled through the URL path:
```
/v1/endpoint
```

## Changelog

### v1.0.0 (2025-08-02)
- Initial API release
- User authentication
- Product management
- Search functionality
