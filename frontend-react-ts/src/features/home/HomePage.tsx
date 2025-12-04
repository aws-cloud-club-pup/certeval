import { Link } from '@tanstack/react-router'
import type { CSSProperties } from 'react'
import alfAstronaut from '../../assets/alf/alf_astronaut.svg'
import planetLeft from '../../assets/planets/planet_left.svg'
import planetRight from '../../assets/planets/planet_right.svg'

const keyframes = `
@keyframes alf-rise {
	0% { transform: translateY(35%); opacity: 0; }
	60% { opacity: 1; }
	100% { transform: translateY(0); opacity: 1; }
}
@keyframes wobble-left {
	0% { transform: translateY(0) rotate(-2deg); }
	50% { transform: translateY(-8px) rotate(3deg); }
	100% { transform: translateY(0) rotate(-2deg); }
}
@keyframes wobble-right {
	0% { transform: translateY(0) rotate(2deg); }
	50% { transform: translateY(10px) rotate(-3deg); }
	100% { transform: translateY(0) rotate(2deg); }
}
`

const styles = {
	hero: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		textAlign: 'center' as const,
		gap: 'clamp(16px, 4vh, 32px)',
		padding: 'clamp(40px, 8vh, 96px) clamp(16px, 4vw, 48px) clamp(110px, 20vh, 220px)',
		color: '#fff',
		width: 'min(1100px, 100%)',
		margin: '0 auto',
		flex: 1,
		justifyContent: 'flex-start',
		position: 'relative' as const,
		paddingBottom: 'clamp(110px, 20vh, 220px)',
	},
	title: {
		fontSize: 'clamp(4rem, 6vw, 20rem)',
		fontWeight: 700,
		letterSpacing: '0.  ',
		margin: 0,
	},
	subtitle: {
		fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
		margin: 0,
		color: '#f2f0ff',
	},
	cta: {
		marginTop: '16px',
	},
	ctaLink: {
		textDecoration: 'none',
		color: '#fff',
		background: 'linear-gradient(90deg, #fe4cf7, #a16bff)',
		padding: '14px 32px',
		borderRadius: '999px',
		fontWeight: 600,
		boxShadow: '0 12px 30px rgba(161, 107, 255, 0.42)',
		display: 'inline-flex',
		alignItems: 'center',
		gap: '8px',
	},
	artWindow: {
		position: 'fixed' as const,
		left: '50%',
		transform: 'translateX(-50%)',
		bottom: 0,
		width: '100vw',
		maxWidth: '960px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex-end',
		pointerEvents: 'none' as const,
	},
	planet: {
		position: 'absolute' as const,
		width: 'clamp(120px, 18vw, 220px)',
		opacity: 0.9,
		zIndex: 0,
	},
	planetLeft: {
		left: 'clamp(-30px, -4vw, -10px)',
		bottom: '50%',
		animation: 'wobble-left 6s ease-in-out infinite',
	},
	planetRight: {
		right: 'clamp(-30px, -4vw, -10px)',
		bottom: '50%',
		animation: 'wobble-right 6s ease-in-out infinite',
	},
	alfLayer: {
		flex: '0 0 auto',
		width: 'min(640px, 90vw)',
        transform: 'translateY(40%)',
		position: 'relative' as const,
		zIndex: 1,
	},
	alfImg: {
		display: 'block',
		width: 'clamp(50%, 40vw, 100%)',
		filter: 'drop-shadow(0 18px 40px rgba(12, 0, 32, 0.6))',
		animation: 'alf-rise 1.25s ease-out forwards',
	},
} satisfies Record<string, CSSProperties>

export default function HomePage() {
	return (
		<>
			<style>{keyframes}</style>
			<section style={styles.hero}>
				<div>
					<h1 style={styles.title}>CERTEVAL</h1>
					<p style={styles.subtitle}>AWS Cloud Club PUP&apos;s Certificate and Evaluation Portal</p>
				</div>
				<div style={styles.cta}>
					<Link to="/verification" style={styles.ctaLink}>
						Get Certificate
						<span aria-hidden="true">→</span>
					</Link>
				</div>
				<div style={styles.artWindow}>
					<img src={planetLeft} alt="Planet on the left" style={{ ...styles.planet, ...styles.planetLeft }} />
					<div style={styles.alfLayer}>
						<img src={alfAstronaut} alt="Alf the astronaut" style={styles.alfImg} />
					</div>
					<img src={planetRight} alt="Planet on the right" style={{ ...styles.planet, ...styles.planetRight }} />
				</div>
			</section>
		</>
	)
}
