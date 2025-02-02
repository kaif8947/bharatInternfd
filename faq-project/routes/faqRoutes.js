// routes/faqRoutes.js
import express from 'express';
import FAQ from '../models/FAQ.js';
import { translateText } from '../services/translationService.js';

const router = express.Router();

// Get all FAQs with language support
router.get('/', async (req, res) => {
  const lang = req.query.lang || 'en';
  
  try {
    const faqs = await FAQ.find();
    const translatedFaqs = await Promise.all(faqs.map(async (faq) => {
      const translatedQuestion = await faq.getTranslatedQuestion(lang);
      const translatedAnswer = await faq.getTranslatedAnswer(lang);
      return { ...faq._doc, question: translatedQuestion, answer: translatedAnswer };
    }));

    res.json(translatedFaqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching FAQs' });
  }
});

// Add a new FAQ
router.post('/', async (req, res) => {
  const { question, answer, lang } = req.body;

  try {
    const faq = new FAQ({ question, answer });
    
    // Automatically translate question and answer
    faq.translations[`question_${lang}`] = await translateText(question, lang);
    faq.answer_translations[`answer_${lang}`] = await translateText(answer, lang);
    
    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating FAQ' });
  }
});

export default router;
