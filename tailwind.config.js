/** @type {import('tailwindcss').Config} */
module.exports ={
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily:{
        raleway:['Raleway'],
        roboto:['Roboto'],
      },
      
      
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

