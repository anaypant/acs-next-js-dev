import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          light: 'hsl(var(--secondary-light))',
          dark: 'hsl(var(--secondary-dark))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        border: 'hsl(var(--border))',
        status: {
          success: 'var(--status-success)',
          warning: 'var(--status-warning)',
          error: 'var(--status-error)',
          info: 'var(--status-info)',
        },
        chart: {
          '1': 'var(--chart-1)',
          '2': 'var(--chart-2)',
          '3': 'var(--chart-3)',
          '4': 'var(--chart-4)',
          '5': 'var(--chart-5)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        'text-gradient': 'hsl(var(--text-gradient))',
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'arial'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        montserrat: ['var(--font-montserrat)', 'system-ui', 'arial'],
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'text-gradient': 'text-gradient 8s linear infinite',
        'gradient-bg': 'gradient-bg 8s ease-in-out infinite',
        'float-1': 'float-1 10s ease-in-out infinite',
        'float-2': 'float-2 12s ease-in-out infinite',
        'float-3': 'float-3 8s ease-in-out infinite',
        'slide-gradient': 'slide-gradient 3s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': '0% 50%',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': '100% 50%',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'text-gradient': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': '0% center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': '100% center',
          },
        },
        'gradient-bg': {
          '0%, 100%': { 
            opacity: '1',
            transform: 'scale(1)',
            'background-position': '0% 50%'
          },
          '50%': { 
            opacity: '1',
            transform: 'scale(1.02)',
            'background-position': '100% 50%'
          },
        },
        'float-1': {
          '0%, 100%': { 
            transform: 'translate(0, 0) scale(1)',
            opacity: '0.6'
          },
          '50%': { 
            transform: 'translate(60px, -40px) scale(1.2)',
            opacity: '0.8'
          },
        },
        'float-2': {
          '0%, 100%': { 
            transform: 'translate(0, 0) scale(1)',
            opacity: '0.6'
          },
          '50%': { 
            transform: 'translate(-50px, 35px) scale(0.8)',
            opacity: '0.8'
          },
        },
        'float-3': {
          '0%, 100%': { 
            transform: 'translate(0, 0) scale(1)',
            opacity: '0.4'
          },
          '33%': { 
            transform: 'translate(30px, -20px) scale(1.1)',
            opacity: '0.6'
          },
          '66%': { 
            transform: 'translate(-20px, 30px) scale(0.9)',
            opacity: '0.4'
          },
        },
        'slide-gradient': {
          '0%': {
            'background-position': '-150% 50%',
          },
          '50%': {
            'background-position': '250% 50%',
          },
          '100%': {
            'background-position': '-150% 50%',
          },
        },
      },
      height: {
        'screen-dynamic': '100dvh',
      },
      minHeight: {
        'screen-dynamic': '100dvh',
      },
      maxHeight: {
        'screen-dynamic': '100dvh',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
    },
  },
  plugins: [],
}

export default config 