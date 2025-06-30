# WEAP API Server

This is the backend API server for the WEAP website, built with Node.js, Express, and MongoDB.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the server directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/weap_db
   CLIENT_URL=http://localhost:5173
   ```

### MongoDB Setup

#### Local Development

1. Install MongoDB locally from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```
   mongod
   ```
3. The server will connect to the local MongoDB instance at `mongodb://127.0.0.1:27017/weap_db`

#### Production Setup (Recommended)

For production, it's recommended to:

1. Enable MongoDB authentication
2. Create a dedicated database user
3. Update the `MONGODB_URI` in `.env` to include authentication:
   ```
   MONGODB_URI=mongodb://username:password@host:port/weap_db?authSource=admin
   ```

#### Creating a MongoDB Admin User (Local Development)

1. Connect to MongoDB shell:
   ```
   mongosh
   ```

2. Create an admin user:
   ```javascript
   use admin
   db.createUser({
     user: "weap_admin",
     pwd: "secure_password",  // Replace with a strong password
     roles: [{ role: "userAdminAnyDatabase", db: "admin" }]
   })
   ```

3. Update your `.env` file with the credentials:
   ```
   MONGODB_URI=mongodb://weap_admin:secure_password@127.0.0.1:27017/weap_db?authSource=admin
   ```

4. Restart MongoDB with authentication enabled:
   ```
   mongod --auth
   ```

### Running the Server

#### Development Mode
```
npm run dev
```

#### Production Mode
```
npm start
```

## API Endpoints

### Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/applications | Get all applications (with pagination) |
| GET    | /api/applications/:id | Get a single application by ID |
| POST   | /api/applications | Create a new application |
| PUT    | /api/applications/:id | Update an application |
| DELETE | /api/applications/:id | Delete an application |

## Database Structure

The application uses MongoDB with Mongoose for schema validation:

### Application Schema

- `name`: String (required, max 100 chars)
- `email`: String (required, valid email)
- `schoolEmail`: String (required, valid UWO email)
- `studentId`: String (required, 8-10 digits)
- `program`: String (required)
- `team`: String (required)
- `resumeUrl`: String (optional, must start with http)
- `resumeMethod`: String (enum: 'url', 'file')
- `resumeData`: String
- `timestamp`: Date (default: current date)
- `createdAt`: Date (automatic)
- `updatedAt`: Date (automatic)

## Security Considerations

- API endpoints for retrieving, updating, and deleting applications should be properly secured in production
- Consider implementing JWT authentication for protected routes
- Use HTTPS in production
- Set appropriate CORS restrictions in production 