/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    500: '#0ea5e9',
                    600: '#0284c7',
                },
                navy: {
                    900: '#0a192f', // Dark Navy
                    800: '#112240', // Lighter Navy
                },
                sage: {
                    50: '#f6fbf7',
                    100: '#ecfdf5',
                    500: '#10b981',
                },
                lavender: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    500: '#8b5cf6',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
