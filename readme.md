# Project Title

Short description of the project.

## Installation

1. Clone the repository: `git clone https://github.com/yourusername/yourproject.git`
2. Install dependencies: `npm install`

## Usage

1. Install all dependecies : `npm install || yarn install`
2. Start the server: `npm start || yarn `
3. Access the API at: `http://localhost:3000/api/`

## Features

- User Management
- Branch Management
- Product Management
- Sale Management
- Track Sales

## API Endpoints

# Products - Admin

- `POST /product/create`: Add a Product.
- `GET /api/products/:id`: Get a product by ID.
- `POST /api/products`: Create a new product.
- `PUT /api/products/:id`: Update a product by ID.
- `DELETE /api/products/:id`: Delete a product by ID.

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/yourfeature`
3. Make your changes and commit: `git commit -m "Add your message here"`
4. Push to the branch: `git push origin feature/yourfeature`
5. Submit a pull request.

## Uploading Files

1. First, get the picture data from the request. we are using middleware multer, which handles file uploads in Node.js.
2. Next, create a unique filename for the picture. we are using uuid to generate a unique ID for each file.
3. Save the picture to the server's file system. we are saving the files in `images` folder.
4. There are 2 folders under `images` folder `avatars` and `products`.
5. In uploading file request we are uploading the file and parsing the fileUrl with `fileUrlParser()` to save it on database.

## Deleting Files

1. In `utils` folder we have a function called `deleteFile`.
2. It takes two values the subfolder name under `images` and `filename`.
3. Then deletes file.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
