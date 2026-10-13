import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(env.PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 CertiVerify API running on port ${env.PORT}`);
      console.log(`🌍 Environment: ${env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${env.PORT}/api/health`);
      console.log(`===============================================`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`\n[Server Error] Port ${env.PORT} is already in use.`);
        if (env.PORT === 5000) {
          console.error(`On macOS, port 5000 is occupied by Apple's AirPlay Receiver (Control Center).`);
          console.error(`To free port 5000:`);
          console.error(`  Open macOS System Settings > General > AirDrop & AirPlay > Toggle off "AirPlay Receiver".`);
          console.error(`Alternatively, set PORT in your .env file.\n`);
        }
      } else {
        console.error('Server error:', error.message);
      }
      process.exit(1);
    });

    // Graceful shutdown handling
    const shutdown = () => {
      console.log('Shutting down gracefully...');
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Only start standalone HTTP server in local development.
// In production or on Vercel, requests are handled directly by the exported Express app without app.listen().
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  startServer();
}

export default app;
