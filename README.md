# Home Server - Photo Gallery

A simple home server with photo upload and gallery functionality.

## Features

- 📸 **Photo Upload**: Drag & drop or click to upload multiple photos
- 🖼️ **Photo Gallery**: View all uploaded photos in a responsive grid
- 📊 **Photo Details**: See file size, type, and upload date
- 🔍 **Photo Modal**: Click any photo to view it in full size
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Real-time Updates**: Automatic refresh after uploads

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run database migrations:
```bash
npm run db:migrate
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and go to `http://localhost:3000` or, on local network, go to http://192.168.1.10:3000

## Usage

### Uploading Photos

1. Click the "Choose Photos" button or drag & drop images onto the upload area
2. Select one or more image files (JPEG, PNG, GIF, WebP)
3. Click "Upload Photos" to start the upload process
4. Photos will appear in the gallery once uploaded

### Viewing Photos

- **Grid View**: All photos are displayed in a responsive grid
- **Photo Details**: Hover over photos to see basic information
- **Full View**: Click any photo to open it in a modal with detailed information
- **Navigation**: Use the refresh button to reload photos

### Supported File Types

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### File Size Limits

- Maximum file size: 10MB per photo
- Multiple photos can be uploaded simultaneously

## API Endpoints

- `GET /photos` - Get all photos
- `POST /photos` - Upload a new photo
- `GET /uploads/photos/{filename}` - Serve uploaded photos

## Project Structure

```
home_server/
├── public/                 # Static files
│   ├── index.html         # Main UI
│   ├── css/style.css      # Styles
│   └── js/app.js          # JavaScript functionality
├── src/
│   ├── routes/photos.ts   # Photo API routes
│   ├── database/          # Database schema and connection
│   └── server.ts          # Main server file
├── uploads/photos/        # Uploaded photos storage
└── database/              # SQLite database
```

## Development

### Database Commands

- Generate migrations: `npm run db:generate`
- Run migrations: `npm run db:migrate`
- Open database studio: `npm run db:studio`

### Adding New Features

1. Add new routes in `src/routes/`
2. Update database schema in `src/database/schema.ts`
3. Generate and run migrations
4. Update the UI in `public/` files

## Troubleshooting

### Common Issues

1. **Photos not displaying**: Check that the server is running and the uploads directory exists
2. **Upload fails**: Verify file type and size limits
3. **Database errors**: Run migrations with `npm run db:migrate`

### File Permissions

Make sure the `uploads/photos/` directory has write permissions for the server process.

## License

MIT
