//redis configuration
import {createClient} from 'redis';

const redisClient = createClient();

redisClient.on('error', err => {
    alert('redis error');
});

await redisClient.connect();

export default redisClient;