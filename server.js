const express = require('express');
const cors = require('cors');
const multer = require('multer'); // For handling file uploads
const path = require('path');
const fs = require('fs'); // For file system operations (saving images)
const app = express(); 
const PORT = 3000; // This is the port your frontend expects (localhost:3000)

app.use(cors()); // Allows requests from your frontend

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // To parse JSON bodies from requests
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use('/uploads', express.static(path.join(__dirname, 'uploads',))); // Serve uploaded images statically


// Ensure 'uploads' directory exists for images
const uploadsDir = path.join(__dirname, 'uploads',);
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Multer storage configuration for images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Images will be saved in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        // Create a unique filename based on current timestamp and original name
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// --- In-memory Data Store (for demonstration) ---
// In a real application, you'd use a database (e.g., MongoDB, PostgreSQL, SQLite)
let newsData = [
    { id: 'feature1', category: 'Technology', title: 'Breakthrough in Quantum Computing Announced', fullContent: 'Scientists have achieved a major milestone in quantum computing that could revolutionize how we process information and solve complex problems, opening up new frontiers in cryptography, drug discovery, and artificial intelligence.\n\nThis breakthrough could accelerate the development of next-generation technologies.', imageUrl: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', author: 'Robert Chen', authorImage: 'https://randomuser.me/api/portraits/men/32.jpg', publishDate: 'July 5, 2025 at 10:00 AM', isFeatured: true, authorId: 'admin', comments: [] },
    { id: 'sidefeature1', category: 'Business', title: 'Global Markets React to New Economic Policies', fullContent: 'Global markets are showing significant volatility as new economic policies are introduced. Analysts are closely watching how these changes will impact various sectors and international trade agreements.\n\nEconomic forecasts suggest potential shifts in investment strategies.', imageUrl: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', author: 'Emily White', authorImage: 'https://randomuser.me/api/portraits/women/67.jpg', publishDate: 'July 5, 2025 at 1:00 PM', isFeatured: true, isSideFeature: true, authorId: 'admin', comments: [] },
    { id: 'sidefeature2', category: 'Sports', title: 'National Team Qualifies for Finals', fullContent: 'In an exhilarating display of skill and determination, the national team has successfully secured its spot in the championship finals after a series of intense matches against top-ranked opponents.\n\nFans are eagerly anticipating the final showdown.', imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', author: 'David Lee', authorImage: 'https://randomuser.me/api/portraits/men/22.jpg', publishDate: 'July 5, 2025 at 11:30 AM', isFeatured: true, isSideFeature: true, authorId: 'admin', comments: [] },
    { id: 'sidefeature3', category: 'Automotive', title: 'Electric Vehicle Sales Surpass Traditional Models', fullContent: 'For the first time in history, sales of electric vehicles have officially surpassed traditional gasoline-powered models, signaling a significant shift in consumer preferences and the automotive industry\'s future.\n\nThis trend is expected to continue as infrastructure improves.', imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', author: 'Olivia Clark', authorImage: 'https://randomuser.me/api/portraits/women/55.jpg', publishDate: 'July 5, 2025 at 9:15 AM', isFeatured: true, isSideFeature: true, authorId: 'admin', comments: [] },
    { id: 'news1', category: 'Environment', title: 'New Climate Agreement Signed by 40 Nations', fullContent: 'Global leaders from 40 nations have signed a landmark climate agreement, committing to ambitious targets aimed at significantly reducing carbon emissions by the year 2030, marking a crucial step towards combating climate change.\n\nThe agreement emphasizes renewable energy investments and sustainable practices.', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', author: 'Sarah Johnson', authorImage: 'https://randomuser.me/api/portraits/women/44.jpg', publishDate: 'July 4, 2025 at 3:00 PM', isFeatured: false, authorId: 'admin', comments: [] },
    { id: 'news2', category: 'Sports', title: 'Underdog Team Advances to Championship Finals', fullContent: 'In a stunning upset, the underdog team defeats the reigning champions in a nail-biting finish, securing their spot in the championship finals and thrilling fans worldwide.\n\nTheir journey has captured the hearts of many.', imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', author: 'Michael Torres', authorImage: 'https://randomuser.me/api/portraits/men/22.jpg', publishDate: 'July 4, 2025 at 6:45 PM', isFeatured: false, authorId: 'admin', comments: [] },
    { id: 'news3', category: 'Finance', title: 'Central Bank Announces Interest Rate Changes', fullContent: 'In response to recent economic indicators and inflation concerns, the central bank has announced a series of interest rate adjustments, a move that is expected to have a significant impact on borrowing costs and investment across the country.\n\nAnalysts predict a period of market adjustment.', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', author: 'David Kim', authorImage: 'https://randomuser.me/api/portraits/men/65.jpg', publishDate: 'July 4, 2025 at 1:00 PM', isFeatured: false, authorId: 'admin', comments: [] }
];

// Ensure all existing news items have a 'comments' array
newsData = newsData.map(news => ({ ...news, comments: news.comments || [] }));

// Utility to format date (optional, for consistent display)
const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleString('en-US', options);
};

// --- API Endpoints for News ---

// GET all news

// ✅ Serve data.json explicitly
app.get('/data.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'data.json'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/news', (req, res) => {
    let filteredNews = [...newsData];
    const { category, search, authorId } = req.query;

    // Apply filters
    if (category && category !== 'all' && category !== 'my-posts') {
        filteredNews = filteredNews.filter(news => news.category === category);
    }
    if (search) {
        const searchTerm = search.toLowerCase();
        filteredNews = filteredNews.filter(news =>
            news.title.toLowerCase().includes(searchTerm) ||
            news.fullContent.toLowerCase().includes(searchTerm) ||
            news.category.toLowerCase().includes(searchTerm) ||
            news.author.toLowerCase().includes(searchTerm)
        );
    }
    if (authorId) {
        filteredNews = filteredNews.filter(news => news.authorId === authorId);
    }

    // Sort by publishDate (newest first)
    filteredNews.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

    res.json(filteredNews);
});

// GET single news item by ID
app.get('/api/news/:id', (req, res) => {
    const newsItem = newsData.find(news => news.id === req.params.id);
    if (newsItem) {
        res.json(newsItem);
    } else {
        res.status(404).json({ message: 'News item not found' });
    }
});

// POST a new news item
app.post('/api/news', upload.single('image'), (req, res) => {
    const { title, category, fullContent, author, authorImage, authorId } = req.body;
    // Determine image URL: if a file was uploaded, use its path; otherwise, use existing or a placeholder.
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image');

    const newNews = {
        id: `news-${Date.now()}`, // Simple unique ID
        category,
        title,
        fullContent,
        imageUrl,
        author: author || 'Unknown Author',
        authorImage: authorImage || 'https://via.placeholder.com/28x28?text=A',
        publishDate: formatDate(new Date()),
        isFeatured: false, // New posts are generally not featured by default
        isSideFeature: false, // New posts are generally not side featured by default
        authorId: authorId || 'admin', // Default author ID
        comments: [] // Initialize with empty comments array
    };
    newsData.push(newNews);
    res.status(201).json(newNews);
});

// PUT/PATCH (Update) an existing news item
app.put('/api/news/:id', upload.single('image'), (req, res) => {
    const newsId = req.params.id;
    const newsIndex = newsData.findIndex(news => news.id === newsId);

    if (newsIndex > -1) {
        const existingNews = newsData[newsIndex];
        const { title, category, fullContent, author, authorImage, authorId } = req.body;
        let imageUrl = req.body.imageUrl; // Expect existing URL if no new file

        if (req.file) {
            // New image uploaded, delete old local image if it exists
            if (existingNews.imageUrl && existingNews.imageUrl.startsWith('/uploads/')) {
                const oldImagePath = path.join(__dirname, existingNews.imageUrl);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlink(oldImagePath, (err) => {
                        if (err) console.error("Error deleting old image:", err);
                    });
                }
            }
            imageUrl = `/uploads/${req.file.filename}`; // Set new local image URL
        } else if (!imageUrl && !req.file) {
            // If no new file and imageUrl is empty, use placeholder
            imageUrl = 'https://via.placeholder.com/600x400?text=No+Image';
        } else if (!imageUrl && existingNews.imageUrl && !existingNews.imageUrl.startsWith('/uploads/')) {
            // If imageUrl is empty from request, but old image was a remote URL, keep it
            imageUrl = existingNews.imageUrl;
        }


        const updatedNews = {
            ...existingNews,
            title: title || existingNews.title,
            category: category || existingNews.category,
            fullContent: fullContent || existingNews.fullContent,
            imageUrl: imageUrl || existingNews.imageUrl, // Use updated or existing
            author: author || existingNews.author,
            authorImage: authorImage || existingNews.authorImage,
            authorId: authorId || existingNews.authorId,
            // publishDate remains original or is updated explicitly if needed
        };
        newsData[newsIndex] = updatedNews;
        res.json(updatedNews);
    } else {
        res.status(404).json({ message: 'News item not found' });
    }
});


// DELETE a news item
app.delete('/api/news/:id', (req, res) => {
    const newsId = req.params.id;
    const newsIndex = newsData.findIndex(news => news.id === newsId);

    if (newsIndex > -1) {
        const deletedNews = newsData.splice(newsIndex, 1)[0]; // Remove and get the deleted item
        // If the deleted news had a locally uploaded image, delete the file
        if (deletedNews.imageUrl && deletedNews.imageUrl.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, deletedNews.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) console.error("Error deleting image file:", err);
                });
            }
        }
        res.status(200).json({ message: 'News item deleted successfully' });
    } else {
        res.status(404).json({ message: 'News item not found' });
    }
});

// --- API Endpoints for Comments ---

// GET comments for a specific news item
app.get('/api/news/:newsId/comments', (req, res) => {
    const newsItem = newsData.find(news => news.id === req.params.newsId);
    if (newsItem) {
        const sortedComments = [...newsItem.comments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        res.json(sortedComments);
    } else {
        res.status(404).json({ message: 'News item not found' });
    }
});

// POST a new comment to a news item
app.post('/api/news/:newsId/comments', (req, res) => {
    const newsItem = newsData.find(news => news.id === req.params.newsId);
    if (newsItem) {
        const { author, authorId, avatar, text } = req.body;
        const newComment = {
            id: `comment-${Date.now()}`,
            author: author || 'Anonymous',
            authorId: authorId || 'guest',
            avatar: avatar || 'https://via.placeholder.com/45x45?text=U',
            text,
            timestamp: formatDate(new Date())
        };
        newsItem.comments.push(newComment);
        res.status(201).json(newComment);
    } else {
        res.status(404).json({ message: 'News item not found' });
    }
});

// PUT/PATCH (Update) a comment
app.put('/api/news/:newsId/comments/:commentId', (req, res) => {
    const newsItem = newsData.find(news => news.id === req.params.newsId);
    if (newsItem) {
        const commentIndex = newsItem.comments.findIndex(c => c.id === req.params.commentId);
        if (commentIndex > -1) {
            newsItem.comments[commentIndex].text = req.body.text || newsItem.comments[commentIndex].text;
            res.json(newsItem.comments[commentIndex]);
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } else {
        res.status(404).json({ message: 'News item not found' });
    }
});

// DELETE a comment
app.delete('/api/news/:newsId/comments/:commentId', (req, res) => {
    const newsItem = newsData.find(news => news.id === req.params.newsId);
    if (newsItem) {
        const initialLength = newsItem.comments.length;
        newsItem.comments = newsItem.comments.filter(c => c.id !== req.params.commentId);
        if (newsItem.comments.length < initialLength) {
            res.status(200).json({ message: 'Comment deleted successfully' });
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } else {
        res.status(404).json({ message: 'News item not found' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

