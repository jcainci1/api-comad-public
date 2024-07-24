const path = require("path");
const express = require("express");
const http = require("http");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
const methodOverride = require("method-override");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const jackrabbitRouter = require("./routes/jackrabbitRoutes");
const musicRouter = require("./routes/musicRoutes");

// Start express app
const app = express();

const serve = http.createServer(app);

// 1) GLOBAL MIDDLEWARES

// Determine allowed origins based on the environment
const allowedOrigins =
  process.env.NODE_ENV === "development"
    ? [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8080",
      ]
    : [
        "http://comad-site.s3-website.us-east-2.amazonaws.com",
        "https://comad.net",
      ];

// Implement CORS
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.options("*", cors()); // Enable pre-flight across all routes

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Set security HTTP headers
app.use(helmet({ crossOriginEmbedderPolicy: false, originAgentCluster: true }));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data: blob:"],
    },
  })
);

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(methodOverride("_method"));

// 3) ROUTES
app.use("/api/v1/jackrabbit", jackrabbitRouter);
app.use("/api/v1/music", musicRouter);
// app.get("/", (req, res) => res.json("I love coding"));

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = { app, serve };
