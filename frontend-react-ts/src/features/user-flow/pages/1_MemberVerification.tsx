import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useFlowStore } from '../../../store/flowStore'
import type { FlowState } from '../../../store/flowStore'

export default function MemberVerification() {
	const navigate = useNavigate()
	const [isMember, setIsMember] = useState<boolean | null>(null)
	const [awsccId, setAwsccId] = useState('')
	const [guestName, setGuestName] = useState('')
	const setMember = useFlowStore((s: FlowState) => s.setMember)
	const setGuest = useFlowStore((s: FlowState) => s.setGuest)

	const canContinue = isMember === true ? awsccId.trim().length > 0 : isMember === false ? guestName.trim().length > 0 : false

	return (
		<section style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
			<h2 style={{ color: '#fff' }}>Step 1: Membership Verification</h2>
			<p style={{ color: '#c7b8ff' }}>Are you a member?</p>

			<div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
				<button onClick={() => setIsMember(true)} style={{ padding: '10px 16px', borderRadius: 8 }}>Yes, I am a cloud buddy!</button>
				<button onClick={() => setIsMember(false)} style={{ padding: '10px 16px', borderRadius: 8 }}>No, I am a guest/participant</button>
			</div>

			{isMember === true && (
				<input
					placeholder="AWS-00-0000-0000"
					value={awsccId}
					onChange={(e) => setAwsccId(e.target.value)}
					style={{ width: '100%', padding: '12px', borderRadius: 8, marginBottom: 16 }}
				/>
			)}

			{isMember === false && (
				<input
					placeholder="Full Name"
					value={guestName}
					onChange={(e) => setGuestName(e.target.value)}
					style={{ width: '100%', padding: '12px', borderRadius: 8, marginBottom: 16 }}
				/>
			)}

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<span style={{ color: '#c7b8ff' }}>Progress</span>
				<button
					disabled={!canContinue}
					onClick={() => {
						if (isMember) setMember(awsccId)
						else setGuest(guestName)
						navigate({ to: '/events' })
					}}
					style={{ padding: '10px 16px', borderRadius: 8 }}
				>
					Next
				</button>
			</div>
		</section>
	)
}

