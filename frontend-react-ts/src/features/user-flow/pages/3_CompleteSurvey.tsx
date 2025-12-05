import { useNavigate } from '@tanstack/react-router'

export default function CompleteSurvey() {
	const navigate = useNavigate()
	const pulseLink = 'https://example.com/pulse-survey'

	return (
		<section style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
			<h2 style={{ color: '#fff' }}>Step 3: Complete AWS Pulse Survey</h2>
			<div style={{ display: 'grid', gap: 16 }}>
				<div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8 }}>
					<h3 style={{ color: '#fff', marginTop: 0 }}>Direct Link</h3>
					<p style={{ color: '#c7b8ff' }}>Click to open the survey in a new tab</p>
					<a href={pulseLink} target="_blank" rel="noreferrer" style={{ color: '#aaf' }}>{pulseLink}</a>
				</div>
				<div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8 }}>
					<h3 style={{ color: '#fff', marginTop: 0 }}>Required Survey Info</h3>
					<ul style={{ color: '#c7b8ff' }}>
						<li>Venue Code: MANILA</li>
						<li>Event ID: 123</li>
					</ul>
				</div>
			</div>

			<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
				<button onClick={() => navigate({ to: '/upload' })} style={{ padding: '10px 16px', borderRadius: 8 }}>Survey Completed</button>
			</div>
		</section>
	)
}

