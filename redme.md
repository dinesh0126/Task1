# Mini Social Post App - MERN API Plan

Yeh project `MERN Stack` me banao:

- Frontend: `React.js`
- Backend: `Node.js + Express.js`
- Database: `MongoDB`
- Styling: `Basic CSS`
- Auth: `JWT`

## Recommended Folder Structure

```text
Backend/
  src/
    config/
    controllers/
    middlewares/
    models/
    routes/
    services/
    utils/
    validations/
    app.js
    server.js

Frontend/
  src/
    api/
    components/
    pages/
    hooks/
    store/
    utils/
    styles/
```

## Frontend State Management

`Context API` mat use karo. Frontend me `Zustand` use karo.

Suggested stores:

- `authStore` - user, token, login, logout, session restore
- `postStore` - feed list, loading, pagination, create post
- `uiStore` - modal, toast, local UI state if needed

## MongoDB Collections

Sirf `2 collections` use karo:

### 1. `users`

Suggested fields:

```json
{
  "_id": "ObjectId",
  "name": "Dinesh Kumar",
  "email": "dinesh@example.com",
  "password": "hashed_password",
  "profileImage": "optional image url",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### 2. `posts`

Likes aur comments isi collection ke andar embed karo:

```json
{
  "_id": "ObjectId",
  "author": "ObjectId(user)",
  "text": "optional post text",
  "imageUrl": "optional image url",
  "likes": [
    {
      "user": "ObjectId(user)",
      "username": "Dinesh Kumar",
      "likedAt": "date"
    }
  ],
  "comments": [
    {
      "_id": "ObjectId",
      "user": "ObjectId(user)",
      "username": "Aman",
      "text": "nice post",
      "createdAt": "date"
    }
  ],
  "createdAt": "date",
  "updatedAt": "date"
}
```

## Validation Rules

Production-ready feel ke liye yeh validations zaroor lagao:

- `name`: required, min `2`, max `50`
- `email`: required, lowercase, valid email format, unique
- `password`: required, min `8`, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
- `post.text`: optional, max `1000`
- `post.imageUrl`: optional, valid URL
- `post`: `text` ya `imageUrl` me se kam se kam ek required
- `comment.text`: required, min `1`, max `300`
- Har protected route pe JWT auth required
- Mongo `ObjectId` validation har param route pe karo

Recommended packages:

- `express`
- `mongoose`
- `bcryptjs`
- `jsonwebtoken`
- `cors`
- `helmet`
- `morgan`
- `dotenv`
- `express-rate-limit`
- `express-mongo-sanitize`
- `xss-clean` ya equivalent sanitization
- `multer` agar image upload local/cloudinary se karna hai
- `zod` ya `express-validator` for request validation

Frontend recommended packages:

- `react-router-dom`
- `axios`
- `zustand`
- `react-hook-form`
- `zod`
- `@hookform/resolvers`

## API Base URL

```text
/api/v1
```

## Endpoints You Should Build

Yeh endpoints enough hain is task ko clean tareeke se complete karne ke liye.

### Auth APIs

#### 1. Signup

```http
POST /api/v1/auth/signup
```

Request body:

```json
{
  "name": "Dinesh Kumar",
  "email": "dinesh@example.com",
  "password": "Test@1234"
}
```

Purpose:

- New user register karega
- Password hash hoga
- Duplicate email reject hogi

#### 2. Login

```http
POST /api/v1/auth/login
```

Request body:

```json
{
  "email": "dinesh@example.com",
  "password": "Test@1234"
}
```

Purpose:

- User authenticate hoga
- JWT token return hoga

#### 3. Get Logged In User

```http
GET /api/v1/auth/me
```

Purpose:

- Current logged-in user ka profile laane ke liye
- Frontend refresh pe session maintain karne me useful

### Post APIs

#### 4. Create Post

```http
POST /api/v1/posts
```

Request body:

```json
{
  "text": "My first post",
  "imageUrl": "https://example.com/post.jpg"
}
```

Validation:

- `text` ya `imageUrl` me se ek required

#### 5. Get Public Feed

```http
GET /api/v1/posts?page=1&limit=10
```

Purpose:

- Sab users ke posts feed me dikhenge
- Latest first sort karo
- Pagination add karo bonus point ke liye

#### 6. Get Single Post

```http
GET /api/v1/posts/:postId
```

Purpose:

- Detail page ya refresh state ke liye useful

#### 7. Delete Own Post

```http
DELETE /api/v1/posts/:postId
```

Purpose:

- Sirf post owner delete kar sake

### Like APIs

#### 8. Toggle Like on Post

```http
PATCH /api/v1/posts/:postId/like
```

Purpose:

- Same endpoint se like/unlike handle karo
- Agar user already liked hai to unlike
- Nahi hai to like

Why this is better:

- Frontend simple rahega
- Duplicate like issue avoid hoga

### Comment APIs

#### 9. Add Comment

```http
POST /api/v1/posts/:postId/comments
```

Request body:

```json
{
  "text": "Nice post"
}
```

Purpose:

- Post pe comment add karna
- Username bhi save karna as required in task

#### 10. Delete Own Comment

```http
DELETE /api/v1/posts/:postId/comments/:commentId
```

Purpose:

- Sirf comment owner ko delete allow karo

## Minimal Final Endpoint List

Agar tum concise list chahte ho, to yeh final APIs banao:

```text
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
GET    /api/v1/auth/me

POST   /api/v1/posts
GET    /api/v1/posts
GET    /api/v1/posts/:postId
DELETE /api/v1/posts/:postId

PATCH  /api/v1/posts/:postId/like

POST   /api/v1/posts/:postId/comments
DELETE /api/v1/posts/:postId/comments/:commentId
```

## Suggested Response Shape

Har API me consistent response do:

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Security + Production Notes

Industry standard follow karne ke liye:

- Password ko `bcrypt` se hash karo
- JWT ko `Authorization: Bearer <token>` me bhejo
- `helmet` use karo
- `cors` properly configure karo
- `rate limit` login/signup routes pe lagao
- Centralized error handler banao
- Async wrapper use karo
- Request validation middleware banao
- Env variables use karo:
  - `PORT`
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN`
  - `CLIENT_URL`
- Mongoose schema me `timestamps: true`
- Feed query me `populate("author", "name profileImage")`

## Frontend Pages You Will Need

- `Signup Page`
- `Login Page`
- `Feed Page`
- `Create Post Form`
- `Comment Box / Comment List`

## Frontend Data Flow with Zustand

- Login ke baad token aur user `authStore` me save karo
- Page refresh pe `auth/me` hit karke session restore karo
- Feed data `postStore` me rakho
- Like/comment ke baad UI ko instantly update karo
- Optimistic update use kar sakte ho, ya response se exact post replace karo

## Best Backend Flow

Recommended implementation order:

1. User model
2. Auth routes
3. Auth middleware
4. Post model
5. Create post API
6. Feed API
7. Like API
8. Comment API
9. Frontend integration
10. Validation, error handling, polish

## Final Recommendation

Tumhare task ke liye main yeh bolunga:

- `likes` aur `comments` ko `posts` document ke andar hi rakho
- `toggle like` endpoint use karo
- `comment create/delete` separate rakho
- `auth/me` route zaroor banao
- Pagination feed me zaroor add karo

Agar chaho, next step me main tumhare liye:

1. full backend folder structure bana sakta hoon
2. Express + MongoDB models/controllers/routes likh sakta hoon
3. `Frontend + Backend` dono ka starter production-ready code bana sakta hoon

## Current Project Status

Is workspace me ab complete starter application create kar diya gaya hai:

- `Backend/` - Express, MongoDB, JWT, Zod validation
- `Frontend/` - React, Zustand, React Router, simple CSS

## Quick Start

### Backend

```bash
cd Backend
cp .env.example .env
npm install
npm run dev
```

### Frontend

```bash
cd Frontend
cp .env.example .env
npm install
npm run dev
```

## Final API List

```text
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
GET    /api/v1/auth/me

GET    /api/v1/posts
GET    /api/v1/posts/:postId
POST   /api/v1/posts
DELETE /api/v1/posts/:postId
PATCH  /api/v1/posts/:postId/like
POST   /api/v1/posts/:postId/comments
DELETE /api/v1/posts/:postId/comments/:commentId
```
