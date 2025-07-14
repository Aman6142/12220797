import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';

// Custom Logger Middleware Hook
const useLogger = (tag) => {
    return (message, data) => {
        const logEntry = { tag, message, data, timestamp: new Date().toISOString() };
        fetch('/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logEntry),
        });
    };
};

// URL Shortener Page
const Shortener = () => {
    const [url, setUrl] = useState('');
    const [shortcode, setShortcode] = useState('');
    const [validity, setValidity] = useState('');
    const [result, setResult] = useState(null);
    const logger = useLogger('Shortener');

    const handleShorten = async () => {
        try {
            const payload = {
                originalUrl: url,
                customShortcode: shortcode || undefined,
                validityPeriod: validity ? parseInt(validity) : undefined,
            };
            logger('Attempting URL Shorten', payload);
            const res = await axios.post('/api/shorten', payload);
            setResult(res.data);
            logger('Shorten Success', res.data);
        } catch (err) {
            logger('Shorten Error', err.response?.data || err.message);
            alert('Error shortening URL. Check your input.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">React URL Shortener</h1>
            <input
                type="text"
                placeholder="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="border p-2 w-full rounded mb-2"
            />
            <input
                type="text"
                placeholder="Custom shortcode (optional)"
                value={shortcode}
                onChange={(e) => setShortcode(e.target.value)}
                className="border p-2 w-full rounded mb-2"
            />
            <input
                type="number"
                placeholder="Validity in minutes (optional, default 30)"
                value={validity}
                onChange={(e) => setValidity(e.target.value)}
                className="border p-2 w-full rounded mb-2"
            />
            <button
                onClick={handleShorten}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Shorten URL
            </button>

            {result && (
                <div className="mt-4 p-2 border rounded bg-gray-50">
                    <p>Shortened URL:</p>
                    <a
                        href={result.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        {result.shortUrl}
                    </a>
                </div>
            )}
        </div>
    );
};

// Placeholder for Analytics (Insights)
const Analytics = () => {
    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">URL Shortener Analytics</h1>
            <p>Insights on clicks, expiry, top links will be displayed here (to be integrated with backend).</p>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <div className="p-4">
                <nav className="mb-4 flex space-x-4">
                    <Link to="/" className="text-blue-700 underline">Shortener</Link>
                    <Link to="/analytics" className="text-blue-700 underline">Analytics</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<Shortener />} />
                    <Route path="/analytics" element={<Analytics />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;