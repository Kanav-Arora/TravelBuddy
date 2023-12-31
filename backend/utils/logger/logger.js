/* eslint-disable import/no-dynamic-require */
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');
const { createLogger, transports, format } = require('winston');

const config = require(path.resolve(__dirname, '../../config'));

const colorizer = format.colorize();
const logDir = path.join(__dirname);
const customFormat = (ts) => {
    const formattedTimestamp = new Date(ts).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return `${formattedTimestamp}`;
};

const serverLogTransport = new transports.File({
    filename: path.join(logDir, 'server.log'),
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf((log) => `${customFormat(log.timestamp)} ${log.level}: ${log.message}`),
    ),
});

const errorLogTransport = new transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    format: format.combine(
        format.timestamp(),
        format.printf((log) => `${customFormat(log.timestamp)} ${log.level}: ${log.message}`),
    ),
});

const consoleTransport = new transports.Console({
    format: format.combine(
        format.timestamp(),
        format.printf((log) => colorizer.colorize(log.level, `${customFormat(log.timestamp)} ${log.level}: ${log.message}`)),
    ),
});

const logger = createLogger({
    transports: config.NodeEnv === 'development'
        ? [serverLogTransport, errorLogTransport, consoleTransport]
        : [consoleTransport]
    ,
});

module.exports = logger;
