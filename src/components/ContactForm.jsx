import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

function ContactForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const formRef = useRef(); // Optional: for EmailJS form ref if you want

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
        };

        emailjs
            .send(
                'service_vf9k89o',     // Your Service ID
                'template_6m8uyjo',     // Your Template ID
                templateParams,
                'tMbBMZbyylJifJygD'     // Your Public Key
            )
            .then(
                () => {
                    setStatus('Message sent successfully! 🚀 I\'ll reply soon.');
                    setName('');
                    setEmail('');
                    setMessage('');
                    setLoading(false);
                },
                (error) => {
                    setStatus('Oops! Something went wrong. Try again or email me directly.');
                    console.error('EmailJS error:', error.text || error);
                    setLoading(false);
                }
            );
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-10">
            <div>
                <label className="block text-xl md:text-2xl mb-3 text-cyan-300 font-medium">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-black/50 border border-purple-800/50 rounded-lg focus:border-cyan-400 focus:outline-none transition"
                />
            </div>
            <div>
                <label className="block text-xl md:text-2xl mb-3 text-cyan-300 font-medium">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-black/50 border border-purple-800/50 rounded-lg focus:border-cyan-400 focus:outline-none transition"
                />
            </div>
            <div>
                <label className="block text-xl md:text-2xl mb-3 text-cyan-300 font-medium">Message</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows="6"
                    className="w-full px-6 py-4 bg-black/50 border border-purple-800/50 rounded-lg focus:border-cyan-400 focus:outline-none transition resize-none"
                />
            </div>
            <div className="text-center">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-12 py-6 text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full hover:scale-105 transition shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? 'Sending...' : 'Send Message →'}
                </button>
            </div>
            {status && (
                <p className="text-center text-2xl md:text-3xl mt-10 text-cyan-300 animate-pulse">
                    {status}
                </p>
            )}
        </form>
    );
}

export default ContactForm;