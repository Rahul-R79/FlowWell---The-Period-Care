//redis configuration
import logger from '../config/logger.js';
import {createClient} from 'redis';

const redisClient = createClient();

redisClient.on('error', err => {
    logger.error('redis error' + err);
});

await redisClient.connect();

export default redisClient;