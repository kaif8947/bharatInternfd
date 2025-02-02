// services/translationService.js
import axios from 'axios';
import redis from 'redis';

const redisClient = redis.createClient();
await redisClient.connect();
const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';
const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

redisClient.on('error', (err) => {
  console.log('Redis error:', err);
});

export const translateText = async (text, targetLang) => {
  const cacheKey = `${text}:${targetLang}`;
  return new Promise((resolve, reject) => {
    redisClient.get(cacheKey, async (err, cachedTranslation) => {
      if (cachedTranslation) {
        return resolve(cachedTranslation);
      }
      
      try {
        const response = await axios.post(GOOGLE_TRANSLATE_API_URL, null, {
          params: { q: text, target: targetLang, key: API_KEY }
        });
        const translatedText = response.data.data.translations[0].translatedText;
        redisClient.setex(cacheKey, 3600, translatedText); // Cache for 1 hour
        resolve(translatedText);
      } catch (error) {
        console.error('Error translating text:', error);
        resolve(text); // Fallback to original text if translation fails
      }
    });
  });
};
