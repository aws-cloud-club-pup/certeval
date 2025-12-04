export default function Congratulations() {
	const shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent('https://aws-cloud-club-pup.example.com/cert')
	return (
		<section style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
			<h2 style={{ color: '#fff' }}>Congratulations!</h2>
			<p style={{ color: '#c7b8ff' }}>Your certificate is ready.</p>
			<div style={{ background: 'white', borderRadius: 12, padding: 16, textAlign: 'center' }}>
				<div style={{ fontWeight: 700 }}>Certificate of Participation</div>
				<div style={{ marginTop: 8 }}>Alf Zaragoza</div>
				<div style={{ marginTop: 8, fontSize: 12 }}>December 4, 2025</div>
			</div>
			<div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
				<button style={{ padding: '10px 16px', borderRadius: 8 }}>Download Certificate</button>
				<a href={shareUrl} target="_blank" rel="noreferrer" style={{ padding: '10px 16px', borderRadius: 8, background: '#0A66C2', color: '#fff' }}>Share on LinkedIn</a>
			</div>
		</section>
	)
}

