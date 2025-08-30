const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const winston = require('winston');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Logging configuration
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'sellsight-scraper' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });
    next();
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sellsight';

mongoose.connect(MONGODB_URI)
    .then(() => logger.info('Connected to MongoDB'))
    .catch(err => logger.error('MongoDB connection error:', err));

// JSON Schema for scraped product data
const productSchema = {
    type: "object",
    required: ["id", "title", "category", "price", "sales", "rating", "lastUpdate"],
    properties: {
        id: { type: "string", description: "Unique product identifier" },
        title: { type: "string", description: "Product title/name" },
        category: { type: "string", description: "Product category" },
        price: { type: "number", minimum: 0, description: "Product price in USD" },
        sales: { type: "integer", minimum: 0, description: "Total number of sales" },
        rating: { type: "number", minimum: 0, maximum: 5, description: "Product rating (0-5)" },
        lastUpdate: { type: "string", format: "date", description: "Last update date (YYYY-MM-DD)" },
        tags: { type: "array", items: { type: "string" }, description: "Product tags/keywords" },
        description: { type: "string", description: "Product description" },
        author: { type: "string", description: "Product author/creator" },
        thumbnail: { type: "string", format: "uri", description: "Product thumbnail URL" },
        livePreview: { type: "string", format: "uri", description: "Live preview URL" },
        downloads: { type: "integer", minimum: 0, description: "Number of downloads" },
        reviews: { type: "integer", minimum: 0, description: "Number of reviews" },
        createdDate: { type: "string", format: "date", description: "Product creation date" },
        lastSale: { type: "string", format: "date", description: "Last sale date" },
        priceHistory: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    date: { type: "string", format: "date" },
                    price: { type: "number", minimum: 0 }
                }
            }
        }
    }
};

// MongoDB Models
const ProductSchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    sales: { type: Number, required: true },
    rating: { type: Number, required: true },
    lastUpdate: { type: Date, required: true },
    tags: [String],
    description: String,
    author: String,
    thumbnail: String,
    livePreview: String,
    downloads: Number,
    reviews: Number,
    createdDate: Date,
    lastSale: Date,
    priceHistory: [{
        date: Date,
        price: Number
    }],
    scrapedAt: { type: Date, default: Date.now },
    analysisScore: Number,
    trendScore: Number
}, { timestamps: true });

const ScrapeLogSchema = new mongoose.Schema({
    scrapeId: { type: String, required: true, unique: true },
    startTime: { type: Date, required: true },
    endTime: Date,
    status: { type: String, enum: ['running', 'completed', 'failed'], default: 'running' },
    productsScraped: { type: Number, default: 0 },
    errors: [String],
    metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
const ScrapeLog = mongoose.model('ScrapeLog', ScrapeLogSchema);

// Mock data for development
const generateMockProducts = () => {
    const categories = ['Electronics', 'Books', 'Sports', 'Home & Garden', 'Beauty', 'Toys'];
    const products = [];

    for (let i = 1; i <= 50; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const product = {
            productId: `product-${i}`,
            title: `Product ${i} - ${category.includes('Electronics') ? 'Premium' : category.includes('Books') ? 'Deluxe' : 'Standard'} ${category.slice(0, -1)}`,
            category,
            price: Math.round((Math.random() * 200 + 50) * 100) / 100,
            sales: Math.floor(Math.random() * 15000 + 1000),
            rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
            lastUpdate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
            tags: [`tag-${i}`, `category-${category.toLowerCase()}`],
            description: `High-quality ${category.slice(0, -1).toLowerCase()} with premium features`,
            author: `Author${i}`,
            thumbnail: `https://example.com/thumb-${i}.jpg`,
            downloads: Math.floor(Math.random() * 50000),
            reviews: Math.floor(Math.random() * 1000),
            analysisScore: Math.random(),
            trendScore: Math.random()
        };
        products.push(product);
    }

    return products;
};

// Analysis Service (Mock Implementation)
class AnalysisService {
    static calculateTrendScore(product) {
        // Mock trend calculation based on sales, rating, and recency
        const salesWeight = Math.min(product.sales / 10000, 1) * 0.4;
        const ratingWeight = (product.rating / 5) * 0.3;
        const recencyWeight = Math.max(0, 1 - (Date.now() - new Date(product.lastUpdate)) / (365 * 24 * 60 * 60 * 1000)) * 0.3;

        return Math.round((salesWeight + ratingWeight + recencyWeight) * 100) / 100;
    }

    static calculateMarketGrowth(products) {
        // Mock market growth calculation
        const totalSales = products.reduce((sum, p) => sum + p.sales, 0);
        const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;

        return {
            growthRate: Math.round((totalSales / 1000000) * 100) / 100,
            quarterGrowth: Math.round((avgRating - 3.5) * 2 * 100) / 100
        };
    }

    static getCategoryInsights(products) {
        const categoryStats = {};

        products.forEach(product => {
            if (!categoryStats[product.category]) {
                categoryStats[product.category] = {
                    totalSales: 0,
                    count: 0,
                    avgPrice: 0,
                    avgRating: 0
                };
            }

            const cat = categoryStats[product.category];
            cat.totalSales += product.sales;
            cat.count += 1;
            cat.avgPrice += product.price;
            cat.avgRating += product.rating;
        });

        Object.keys(categoryStats).forEach(category => {
            const cat = categoryStats[category];
            cat.avgSales = Math.round(cat.totalSales / cat.count);
            cat.avgPrice = Math.round((cat.avgPrice / cat.count) * 100) / 100;
            cat.avgRating = Math.round((cat.avgRating / cat.count) * 10) / 10;
        });

        return categoryStats;
    }

    static generateSalesTrend() {
        // Mock sales trend data for the chart
        const months = ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024',
            'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Dec 2024'];

        let sales = 12000;
        return months.map(month => {
            sales += Math.floor(Math.random() * 2000 - 500); // Random walk
            return { date: month, sales: Math.max(sales, 8000) };
        });
    }
}

// Scraper Service (Mock Implementation)
class ScraperService {
    static async processRawHTML(htmlData, scrapeId) {
        logger.info(`Processing raw HTML data for scrape: ${scrapeId}`);

        // This is where you'll integrate with LLM to parse HTML
        // For now, returning mock data structure

        const mockParsedData = {
            products: generateMockProducts().slice(0, 10),
            totalFound: 10,
            processingTime: Math.floor(Math.random() * 5000 + 1000),
            errors: []
        };

        logger.info(`Processed ${mockParsedData.totalFound} products in ${mockParsedData.processingTime}ms`);
        return mockParsedData;
    }

    static async scrapeCodeCanyon(options = {}) {
        const scrapeId = `scrape-${Date.now()}`;
        logger.info(`Starting scrape session: ${scrapeId}`, options);

        try {
            // Create scrape log
            const scrapeLog = new ScrapeLog({
                scrapeId,
                startTime: new Date(),
                status: 'running',
                metadata: options
            });
            await scrapeLog.save();

            // Mock scraping process
            const products = generateMockProducts();

            // Save products to database
            for (const productData of products) {
                await Product.findOneAndUpdate(
                    { productId: productData.productId },
                    {
                        ...productData,
                        trendScore: AnalysisService.calculateTrendScore(productData)
                    },
                    { upsert: true, new: true }
                );
            }

            // Update scrape log
            await ScrapeLog.findOneAndUpdate(
                { scrapeId },
                {
                    endTime: new Date(),
                    status: 'completed',
                    productsScraped: products.length
                }
            );

            logger.info(`Scrape completed: ${scrapeId}, products: ${products.length}`);

            return {
                scrapeId,
                productsScraped: products.length,
                status: 'completed'
            };

        } catch (error) {
            logger.error(`Scrape failed: ${scrapeId}`, error);

            await ScrapeLog.findOneAndUpdate(
                { scrapeId },
                {
                    endTime: new Date(),
                    status: 'failed',
                    errors: [error.message]
                }
            );

            throw error;
        }
    }
}

// API Routes

// Dashboard endpoint
app.get('/api/dashboard', async (req, res) => {
    try {
        logger.info('Fetching dashboard data');

        const products = await Product.find().limit(1000);
        const totalProducts = await Product.countDocuments();

        if (products.length === 0) {
            // Generate and save mock data if no products exist
            const mockProducts = generateMockProducts();
            await Product.insertMany(mockProducts.map(p => ({
                ...p,
                trendScore: AnalysisService.calculateTrendScore(p)
            })));
            logger.info('Generated mock data for empty database');
            return res.json(await getDashboardData());
        }

        const categoryInsights = AnalysisService.getCategoryInsights(products);
        const marketGrowth = AnalysisService.calculateMarketGrowth(products);
        const salesTrend = AnalysisService.generateSalesTrend();

        const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
        const lastScrapeDate = await ScrapeLog.findOne().sort({ createdAt: -1 });

        // Prepare category sales data for bar chart
        const categorySales = Object.entries(categoryInsights)
            .map(([category, stats]) => ({
                category,
                avgSales: stats.avgSales
            }))
            .sort((a, b) => b.avgSales - a.avgSales);

        const dashboardData = {
            overview: {
                totalProducts,
                lastScrapeDate: lastScrapeDate ? lastScrapeDate.createdAt : new Date(),
                avgPrice: Math.round(avgPrice * 100) / 100,
                marketGrowth: marketGrowth.growthRate,
                quarterGrowth: marketGrowth.quarterGrowth
            },
            categorySales,
            salesTrend,
            recentActivity: await ScrapeLog.find().sort({ createdAt: -1 }).limit(5)
        };

        logger.info('Dashboard data fetched successfully');
        res.json(dashboardData);

    } catch (error) {
        logger.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// Helper function for consistent dashboard data
async function getDashboardData() {
    const products = await Product.find().limit(1000);
    const totalProducts = await Product.countDocuments();
    const categoryInsights = AnalysisService.getCategoryInsights(products);
    const marketGrowth = AnalysisService.calculateMarketGrowth(products);
    const salesTrend = AnalysisService.generateSalesTrend();
    const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
    const lastScrapeDate = await ScrapeLog.findOne().sort({ createdAt: -1 });

    const categorySales = Object.entries(categoryInsights)
        .map(([category, stats]) => ({
            category,
            avgSales: stats.avgSales
        }))
        .sort((a, b) => b.avgSales - a.avgSales);

    return {
        overview: {
            totalProducts,
            lastScrapeDate: lastScrapeDate ? lastScrapeDate.createdAt : new Date(),
            avgPrice: Math.round(avgPrice * 100) / 100,
            marketGrowth: marketGrowth.growthRate,
            quarterGrowth: marketGrowth.quarterGrowth
        },
        categorySales,
        salesTrend,
        recentActivity: await ScrapeLog.find().sort({ createdAt: -1 }).limit(5)
    };
}

// Products listing endpoint
app.get('/api/products', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            sortBy = 'sales',
            sortOrder = 'desc',
            search,
            minPrice,
            maxPrice,
            minRating,
            showRecent
        } = req.query;

        logger.info('Fetching products with filters:', req.query);

        // Build query
        const query = {};

        if (category && category !== 'All Categories') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        if (minRating) {
            query.rating = { $gte: parseFloat(minRating) };
        }

        if (showRecent === 'true') {
            const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
            query.lastUpdate = { $gte: oneYearAgo };
        }

        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            Product.find(query)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit)),
            Product.countDocuments(query)
        ]);

        logger.info(`Found ${total} products, returning page ${page}`);

        res.json({
            products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            },
            filters: {
                categories: await Product.distinct('category'),
                priceRange: {
                    min: await Product.findOne().sort({ price: 1 }).select('price'),
                    max: await Product.findOne().sort({ price: -1 }).select('price')
                }
            }
        });

    } catch (error) {
        logger.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Start scraping endpoint
app.post('/api/scrape/start', async (req, res) => {
    try {
        const { options = {} } = req.body;

        logger.info('Starting new scrape session', options);

        // Start scraping process (async)
        ScraperService.scrapeCodeCanyon(options)
            .then(result => {
                logger.info('Scrape completed successfully', result);
            })
            .catch(error => {
                logger.error('Scrape failed:', error);
            });

        res.json({
            message: 'Scraping started',
            scrapeId: `scrape-${Date.now()}`,
            estimatedTime: '5-10 minutes'
        });

    } catch (error) {
        logger.error('Error starting scrape:', error);
        res.status(500).json({ error: 'Failed to start scraping' });
    }
});

// Process raw HTML data endpoint
app.post('/api/scrape/process-html', async (req, res) => {
    try {
        const { htmlData, scrapeId } = req.body;

        if (!htmlData) {
            return res.status(400).json({ error: 'HTML data is required' });
        }

        logger.info(`Processing HTML data for scrape: ${scrapeId}`);

        const result = await ScraperService.processRawHTML(htmlData, scrapeId);

        // Save processed products
        if (result.products && result.products.length > 0) {
            for (const productData of result.products) {
                await Product.findOneAndUpdate(
                    { productId: productData.productId },
                    {
                        ...productData,
                        trendScore: AnalysisService.calculateTrendScore(productData)
                    },
                    { upsert: true, new: true }
                );
            }
        }

        res.json({
            message: 'HTML processed successfully',
            productsExtracted: result.products.length,
            processingTime: result.processingTime,
            errors: result.errors
        });

    } catch (error) {
        logger.error('Error processing HTML:', error);
        res.status(500).json({ error: 'Failed to process HTML data' });
    }
});

// Get scrape status endpoint
app.get('/api/scrape/status/:scrapeId', async (req, res) => {
    try {
        const { scrapeId } = req.params;

        const scrapeLog = await ScrapeLog.findOne({ scrapeId });

        if (!scrapeLog) {
            return res.status(404).json({ error: 'Scrape session not found' });
        }

        res.json(scrapeLog);

    } catch (error) {
        logger.error('Error fetching scrape status:', error);
        res.status(500).json({ error: 'Failed to fetch scrape status' });
    }
});

// Get analysis insights endpoint
app.get('/api/analysis/insights', async (req, res) => {
    try {
        const { category, timeframe = '30d' } = req.query;

        logger.info(`Fetching analysis insights for category: ${category}, timeframe: ${timeframe}`);

        const query = {};
        if (category && category !== 'all') {
            query.category = category;
        }

        // Add timeframe filter
        if (timeframe !== 'all') {
            const days = parseInt(timeframe.replace('d', ''));
            const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
            query.lastUpdate = { $gte: cutoffDate };
        }

        const products = await Product.find(query);

        const insights = {
            totalProducts: products.length,
            avgPrice: products.reduce((sum, p) => sum + p.price, 0) / products.length,
            avgSales: products.reduce((sum, p) => sum + p.sales, 0) / products.length,
            avgRating: products.reduce((sum, p) => sum + p.rating, 0) / products.length,
            topPerformers: products
                .sort((a, b) => (b.sales * b.rating) - (a.sales * a.rating))
                .slice(0, 5),
            trendingCategories: AnalysisService.getCategoryInsights(products),
            recommendations: await generateRecommendations(products)
        };

        res.json(insights);

    } catch (error) {
        logger.error('Error fetching analysis insights:', error);
        res.status(500).json({ error: 'Failed to fetch analysis insights' });
    }
});

// Generate product recommendations
async function generateRecommendations(products) {
    // Mock recommendation algorithm
    const categoryPerformance = AnalysisService.getCategoryInsights(products);

    const recommendations = Object.entries(categoryPerformance)
        .sort((a, b) => (b[1].avgSales * b[1].avgRating) - (a[1].avgSales * a[1].avgRating))
        .slice(0, 3)
        .map(([category, stats]) => ({
            category,
            confidence: Math.round(Math.random() * 30 + 70), // 70-100%
            reason: `High performance with ${stats.avgSales} avg sales and ${stats.avgRating} rating`,
            suggestedPriceRange: {
                min: Math.round(stats.avgPrice * 0.8),
                max: Math.round(stats.avgPrice * 1.2)
            },
            marketGap: `Consider products under $${Math.round(stats.avgPrice * 0.5)}`
        }));

    return recommendations;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// JSON Schema endpoint
app.get('/api/schema/product', (req, res) => {
    res.json({
        schema: productSchema,
        description: 'JSON schema for scraped product data',
        version: '1.0.0'
    });
});

// Get scrape logs endpoint
app.get('/api/scrape/logs', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const logs = await ScrapeLog.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await ScrapeLog.countDocuments();

        res.json({
            logs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        logger.error('Error fetching scrape logs:', error);
        res.status(500).json({ error: 'Failed to fetch scrape logs' });
    }
});

// Export data endpoint
app.get('/api/export/products', async (req, res) => {
    try {
        const { format = 'json', category } = req.query;

        const query = {};
        if (category && category !== 'all') {
            query.category = category;
        }

        const products = await Product.find(query).select('-_id -__v');

        logger.info(`Exporting ${products.length} products in ${format} format`);

        if (format === 'csv') {
            // Convert to CSV format
            const csv = products.map(p => Object.values(p.toObject()).join(',')).join('\n');
            const headers = Object.keys(products[0].toObject()).join(',');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
            res.send(headers + '\n' + csv);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename=products.json');
            res.json(products);
        }

    } catch (error) {
        logger.error('Error exporting products:', error);
        res.status(500).json({ error: 'Failed to export products' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    logger.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    logger.warn(`404 - Route not found: ${req.method} ${req.path}`);
    res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    await mongoose.connection.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    logger.info('SIGINT received, shutting down gracefully');
    await mongoose.connection.close();
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    logger.info(`SellSight Scraper Server running on port ${PORT}`);
    logger.info(`MongoDB URI: ${MONGODB_URI}`);
    logger.info('Available endpoints:');
    logger.info('  GET  /api/health - Health check');
    logger.info('  GET  /api/dashboard - Dashboard data');
    logger.info('  GET  /api/products - Products listing');
    logger.info('  POST /api/scrape/start - Start scraping');
    logger.info('  POST /api/scrape/process-html - Process raw HTML');
    logger.info('  GET  /api/scrape/status/:id - Get scrape status');
    logger.info('  GET  /api/scrape/logs - Get scrape logs');
    logger.info('  GET  /api/analysis/insights - Get analysis insights');
    logger.info('  GET  /api/export/products - Export products data');
    logger.info('  GET  /api/schema/product - Get product JSON schema');
});

// Initialize with mock data if database is empty
mongoose.connection.once('open', async () => {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            logger.info('Database is empty, generating mock data...');
            const mockProducts = generateMockProducts();
            await Product.insertMany(mockProducts.map(p => ({
                ...p,
                trendScore: AnalysisService.calculateTrendScore(p)
            })));
            logger.info(`Generated ${mockProducts.length} mock products`);
        }
    } catch (error) {
        logger.error('Error initializing mock data:', error);
    }
});

module.exports = app;