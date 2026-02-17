console.log('Starting...');
try {
    const express = require('express');
    console.log('Express loaded');
    const dotenv = require('dotenv');
    console.log('Dotenv loaded');
    const cors = require('cors');
    console.log('Cors loaded');
    const helmet = require('helmet');
    console.log('Helmet loaded');
    const morgan = require('morgan');
    console.log('Morgan loaded');
    const connectDB = require('./config/db');
    console.log('ConnectDB loaded');
} catch (e) {
    console.error('ERROR LOADING:', e);
}
