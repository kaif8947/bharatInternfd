// models/FAQ.js
import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  translations: {
    question_hi: { type: String },
    question_bn: { type: String },
    // Add other languages as needed
  },
  answer_translations: {
    answer_hi: { type: String },
    answer_bn: { type: String },
    // Add other languages as needed
  },
}, { timestamps: true });

faqSchema.methods.getTranslatedQuestion = function (lang) {
  return this.translations[`question_${lang}`] || this.question;
};

faqSchema.methods.getTranslatedAnswer = function (lang) {
  return this.answer_translations[`answer_${lang}`] || this.answer;
};

const FAQ = mongoose.model('FAQ', faqSchema);

export default FAQ;
