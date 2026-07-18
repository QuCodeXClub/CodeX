import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { errorHandler } from "./middlewares/error.middleware.js";
import swaggerUi from "swagger-ui-express";

const app = express();

// Security Headers
app.use(helmet());

// Request Logging
app.use(morgan("dev"));

// Rate Limiting (limit repeated requests to public APIs and/or endpoints)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Limit each IP to 10000 requests per `window`
  message: { message: "Too many requests from this IP, please try again after 15 minutes" },
});
app.use("/api", limiter);

// Compression for better performance
app.use(compression());


app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Data Sanitization against NoSQL query injection (custom wrapper to bypass Express 4.19+ req.query getter bug)
app.use((req, res, next) => {
  ['body', 'params', 'headers', 'query'].forEach((k) => {
    if (req[k]) {
      const sanitized = mongoSanitize.sanitize(req[k]);
      if (k === 'query') {
        Object.defineProperty(req, 'query', {
          value: sanitized,
          writable: true,
          configurable: true,
          enumerable: true
        });
      } else {
        req[k] = sanitized;
      }
    }
  });
  next();
});

// routes import
import healthcheckRouter from "./routes/healthcheck.routes.js";
import adminRouter from "./routes/admin.routes.js";
import studentRouter from "./routes/student.routes.js";
import registrationRouter from "./routes/registration.routes.js";
import eventRouter from "./routes/event.routes.js";
import teamRouter from "./routes/team.routes.js";
import certificateRouter from "./routes/certificate.routes.js";
import boardingPassRouter from "./routes/boardingPass.routes.js";
import contactRouter from "./routes/contact.routes.js";
import qrRouter from "./routes/qr.routes.js";

// routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/registrations", registrationRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/teams", teamRouter);
app.use("/api/v1/certificates", certificateRouter);
app.use("/api/v1/boarding-passes", boardingPassRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/qr", qrRouter);

// swagger api documentation (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use("/docs", express.static("docs"));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(null, {
    swaggerOptions: {
      url: '/docs/openapi.yaml'
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "CodeX API Documentation"
  }));
}

// error handling middleware (should be added after all routes)
app.use(errorHandler);

export default app;
