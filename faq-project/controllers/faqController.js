import FAQ from '../models/faqModel.js';
import { translateText } from '../services/translationService.js';
import { cache, getFromCache } from '../utils/cache.js';

export const getFAQs = async (req, res) => {
  const { lang = 'en' } = req.query;
  const cacheKey = `faqs_${lang}`;

  const cachedData = await getFromCache(cacheKey);
  if (cachedData) return res.json(cachedData);

  const faqs = await FAQ.find();
  const translatedFAQs = faqs.map((faq) => ({
    question: faq.getTranslatedText(lang),
    answer: faq.answer,
  }));

  await cache(cacheKey, translatedFAQs);
  res.json(translatedFAQs);
};

export const createFAQ = async (req, res) => {
  const { question, answer } = req.body;
  const translations = await translateText(question, ['hi', 'bn']);

  const newFAQ = new FAQ({
    question,
    answer,
    translations,
  });

  await newFAQ.save();
  res.status(201).json(newFAQ);
};