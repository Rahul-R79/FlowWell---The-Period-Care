import {createClient} from 'redis';

const redisClient = createClient();

redisClient.on('error', err => {
    console.error('redis error', err)
});

await redisClient.connect();

export default redisClient;