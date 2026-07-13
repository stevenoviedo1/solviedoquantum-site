import { useState } from 'react';
import emailjs from '@emailjs/browser';

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState(''); // success | error
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    setStatusType('');

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus('Contact form is not configured. Please email me directly.');
      setStatusType('error');
      setLoading(false);
      return;
    }

    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
    };

    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then(() => {
        setStatus("Message sent successfully! 🚀 I'll reply soon.");
        setStatusType('success');
        setName('');
        setEmail('');
        setMessage('');
      })
      .catch((error) => {
        setStatus('Oops! Something went wrong. Try again or email me directly.');
        setStatusType('error');
        console.error('EmailJS error:', error?.text || error);
      })
      .finally(() => setLoading(false));
  };

  const fieldClass =
    'w-full px-4 sm:px-5 py-3 sm:py-3.5 text-base bg-black/50 border border-purple-800/50 rounded-xl focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition text-white placeholder:text-gray-600';

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-5 sm:space-y-6 text-left" noValidate={false}>
      <div>
        <label htmlFor="contact-name" className="block text-sm sm:text-base mb-1.5 text-cyan-300 font-medium">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your name"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm sm:text-base mb-1.5 text-cyan-300 font-medium">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm sm:text-base mb-1.5 text-cyan-300 font-medium">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          placeholder="Tell me about your project..."
          className={`${fieldClass} resize-y min-h-[120px]`}
        />
      </div>
      <div className="text-center pt-1">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-10 py-3.5 sm:py-4 text-base sm:text-lg font-bold bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full hover:scale-105 transition shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? 'Sending...' : 'Send Message →'}
        </button>
      </div>
      {status && (
        <p
          role="status"
          aria-live="polite"
          className={`text-center text-base sm:text-lg mt-2 ${
            statusType === 'error' ? 'text-rose-300' : 'text-cyan-300'
          }`}
        >
          {status}
        </p>
      )}
    </form>
  );
}

export default ContactForm;
