// tailwind.config.js
module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx,vue}',
    ],
    darkMode: 'media', // or 'class' for manual dark mode toggling
    theme: {
        extend: {
            colors: {
                'primary': '#3B82F6',
                'secondary': '#10B981',
                'accent': '#F59E0B',
                'background': '#F3F4F6',
            },
            fontFamily: {
                'sans': ['Inter', 'sans-serif'],
            },
        },
        // You can add more theme customizations here
    },
    plugins: [],
}