import type { Config } from "tailwindcss";
import colors from 'tailwindcss/colors';

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				md: '2rem',
			},
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
				serif: ['Newsreader', 'Georgia', 'serif'],
				sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				"brand-blue": "#0a0a0a",
				"brand-teal": "#00b67a",
				black: {
					DEFAULT: '#0a0a0a',
					soft: '#141414',
				},
				cream: {
					DEFAULT: '#f7f6f3',
					dark: '#efeee9',
				},
				green: {
					DEFAULT: '#00b67a',
					dark: '#009562',
					light: '#e6f9f2',
					muted: '#c2f0dd',
				},
				orange: {
					DEFAULT: '#ff6b35',
					dark: '#e55520',
					light: '#fff0eb',
				},
				ink: {
					DEFAULT: 'hsl(var(--lg-ink))',
					2: 'hsl(var(--lg-ink-2))',
					3: 'hsl(var(--lg-ink-3))',
				},
				aqua: {
					DEFAULT: 'hsl(var(--lg-aqua))',
					soft: 'hsl(var(--lg-aqua-soft))',
					dark: 'hsl(var(--lg-aqua-2))',
				},
				blue: {
					DEFAULT: 'hsl(var(--lg-blue))',
					dark: 'hsl(var(--lg-blue-2))',
					light: 'hsl(var(--lg-blue-3))',
					accent: '#4c7cf5',
				},
				sand: {
					DEFAULT: 'hsl(var(--lg-sand))',
					2: 'hsl(var(--lg-sand-2))',
				},
				line: 'hsl(var(--lg-line))',
				"mint": {
					DEFAULT: "hsl(var(--lg-mint))",
					soft: "hsl(var(--lg-mint-soft))",
					2: "hsl(var(--lg-mint-2))",
					50: "#e6f9f2",
					100: "#c2f0dd",
					200: "#9fe7ca",
					300: "#66d9ae",
					400: "#33c894",
					500: "#00b67a",
					600: "#009562",
					700: "#00784f",
					800: "#005c3d",
					900: "#00402a",
					950: "#002a1c",
				},

				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			fontSize: {
				'2xs': ['0.625rem', { lineHeight: '1rem' }], // 10px
			},
			spacing: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			},
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
