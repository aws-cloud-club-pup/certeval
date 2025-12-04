import { useNavigate } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { useFlowStore } from '../../../store/flowStore'
import type { FlowState } from '../../../store/flowStore'

export default function UploadProof() {
	const navigate = useNavigate()
	const fileRef = useRef<HTMLInputElement | null>(null)
	const [fileName, setFileName] = useState<string>('')
	const setProofName = useFlowStore((s: FlowState) => s.setProofName)

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0]
		const name = f ? f.name : ''
		setFileName(name)
		setProofName(name || null)
	}

	return (
		<section style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
			<h2 style={{ color: '#fff' }}>Step 4: Upload Proof of Completion</h2>
			<p style={{ color: '#c7b8ff' }}>Upload a screenshot of your survey completion page (PNG/JPG up to 5MB)</p>

			<div style={{ display: 'grid', gap: 12 }}>
				<input ref={fileRef} type="file" accept=".png,.jpg,.jpeg" onChange={onFileChange} />
				<div style={{ color: '#c7b8ff' }}>{fileName ? `Upload Successful: ${fileName}` : 'No file selected'}</div>
				<button disabled={!fileName} onClick={() => navigate({ to: '/done' })} style={{ padding: '10px 16px', borderRadius: 8 }}>Submit & Generate Certificate</button>
			</div>
		</section>
	)
}

