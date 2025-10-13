import { useState } from "react";

export default function HelpPage() {
  const faqs = [
    { question: "How do I change my details?", answer: "Go to Settings -> Update Profile." },
    { question: "How to upload a profile photo?", answer: "Click 'Change Photo' in your profile modal and select a new image." },
    { question: "How do I logout?", answer: "Go to Settings -> Click the Logout button in the sidebar." },
    { question: "How do I write mail?", answer: "Click the compose button in the top left section of navbar." },
    { question: "How do I check for spam?", answer: "The system will automatically detect suspicious mails and allow you to verify if spam or not." },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-center text-3xl font-bold mb-6 text-primary">Help Center</h1>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-md overflow-hidden shadow-sm">
            {/* Question Button */}
            <button
              onClick={() => toggle(index)}
              className="w-full text-left px-4 py-3 bg-primary text-white font-medium flex justify-between items-center hover:bg-primary/80 transition-colors"
            >
              {faq.question}
              <span className="font-bold">{openIndex === index ? "-" : "+"}</span>
            </button>

            {/* Answer Box */}
            {openIndex === index && (
              <div className="px-4 py-3 bg-white text-primary">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
