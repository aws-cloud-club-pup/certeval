import { useNavigate } from '@tanstack/react-router'
import { useFlowStore } from '../../../store/flowStore'
import type { FlowState } from '../../../store/flowStore'

export default function EventSelection() {
	const navigate = useNavigate()
	const setEvent = useFlowStore((s: FlowState) => s.setEvent)
	// Placeholder events - will be replaced by API later
	const events = [
		{ id: '1', name: 'New Year, New Heights', date: 'Jan 15, 2025' },
		{ id: '2', name: 'AWSSports', date: 'Jan 20, 2025' },
		{ id: '3', name: 'SBD Launch', date: 'Jan 25, 2025' },
	]

	return (
		<section style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
			<h2 style={{ color: '#fff' }}>Step 2: Event Selection</h2>
			<label style={{ color: '#c7b8ff' }}>Today's Events</label>
			<div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
				{events.map((e) => (
					<button
						key={e.id}
						onClick={() => {
							setEvent(e.id)
							navigate({ to: '/survey' })
						}}
						style={{ textAlign: 'left', padding: '12px', borderRadius: 8 }}
					>
						<div style={{ color: '#fff' }}>{e.name}</div>
						<div style={{ color: '#c7b8ff', fontSize: 12 }}>{e.date}</div>
					</button>
				))}
			</div>
		</section>
	)
}

