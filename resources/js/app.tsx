import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';

const appName = 'PainPoint';

createInertiaApp({
    title: (title) => (title ? `${title} — ${appName}` : `${appName} — Real Problems. Real People. Better Solutions.`),
    resolve: async (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx');
        const path = `./Pages/${name}.tsx`;
        if (!pages[path]) {
            console.error(`Page not found in glob: ${path}`, Object.keys(pages));
            throw new Error(`Page not found: ${path}`);
        }
        return (await pages[path]()) as any;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4F46E5',
        showSpinner: false,
    },
});
