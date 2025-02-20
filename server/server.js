const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const CLIENT_PATH = path.join(__dirname, '../client');
const SERVER_PATH = path.join(__dirname, '../server');

const UPLOADS_DIR = path.join(SERVER_PATH, 'uploads');
const EXPIRATION_TIME = 30 * 86400000 ; // 30 days in milliseconds

// Middleware for the gallery
async function getGalleryImages(folderPath, numImages) {
    try {
        const resolvedPath = path.resolve(folderPath);
        console.log('Resolved path:', resolvedPath);

        const files = await fs.readdir(resolvedPath);
        console.log('Files in folder:', files);

        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

        const imageFiles = files
            .reverse()
            .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
            .slice(0, numImages)
            .map(file => path.join(folderPath, file));

        console.log('Filtered images:', imageFiles);
        return imageFiles;
    } catch (error) {
        console.error('Error reading directory:', error);
        return [];
    }
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        try {
            await fs.mkdir(UPLOADS_DIR, { recursive: true });
            cb(null, UPLOADS_DIR);
        } catch (error) {
            console.error('Error creating uploads folder:', error);
            cb(error, null);
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Set up EJS
app.set('views', path.join(CLIENT_PATH, 'views'));
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(CLIENT_PATH, 'public')));
app.use('/uploads', express.static(UPLOADS_DIR, { extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }))

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const userToken = req.body.userToken;

        if(!userToken) return res.status(401).send('Missing User');
        if (!req.file) return res.status(400).send('No file uploaded.');

         // Define user-specific folder inside 'uploads'
        const userFolder = path.join(UPLOADS_DIR, userToken);
        console.log('User folder:', userFolder);

        await fs.mkdir(userFolder, { recursive: true });

        // Move uploaded file to user-specific folder
        const newFilePath = path.join(userFolder, req.file.filename);
        await fs.rename(req.file.path, newFilePath);

        // The user just sees his own images
        res.json({ success: true, imagePath: `/uploads/${userToken}/${req.file.filename}` });

    } catch (error) {
        console.error('Error in /upload route:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Apply the function to get the first 9 images of the uploads folder
app.get('/api/uploads', async (req, res) => {
    try {
        // Define the limit to load images. By default, it loads 9 images
        const limit = parseInt(req.query.limit) || 9;

        // Define user-specific folder inside 'uploads'. So it's uploads/userToken
        const folder = req.query.folder
        const images = await getGalleryImages(UPLOADS_DIR, limit);
        const urlImages = images.map(image => `/${folder}/${path.basename(image)}`);
        
        res.json(urlImages);
    } catch (error) {
        res.status(500).json({ error: `Error getting gallery images: ${error}` });
    }
});

// 🧹 Cleanup Function: Delete expired files every 1 hour
setInterval(async () => {
    try {
        const files = await fs.readdir(UPLOADS_DIR);
        const now = Date.now();

        for (const file of files) {
            const filePath = path.join(UPLOADS_DIR, file);
            const stats = await fs.stat(filePath);

            if (now - stats.mtimeMs > EXPIRATION_TIME) {
                await fs.unlink(filePath);
                console.log(`🗑️ Deleted expired file: ${file}`);
            }
        }
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}, 60 * 60 * 1000); // Runs every 1 hour

// 🚀 Cleanup on server restart (deletes all files on startup)
async function cleanUploadsOnStartup() {
    try {
        // Read all files in the uploads folder and unlink them.
        const files = await fs.readdir(UPLOADS_DIR);
        for (const file of files) {
            await fs.unlink(path.join(UPLOADS_DIR, file));
        }
        console.log('🗑️ All uploaded files deleted on startup');
    } catch (error) {
        console.error('Error cleaning uploads on startup:', error);
    }
}

// Function to get your local IP address
function getLocalIP() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
}

// Start server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', async () => {
    await cleanUploadsOnStartup(); // Clean files when server starts
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Access from other devices: http://${getLocalIP()}:${PORT}`);
});


