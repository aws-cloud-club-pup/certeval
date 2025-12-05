import { create } from 'zustand'

type Identity = { type: 'member'; awsccId: string } | { type: 'guest'; guestName: string } | null

export type FlowState = {
  identity: Identity
  eventId: string | null
  proofFileName: string | null
  setMember: (awsccId: string) => void
  setGuest: (guestName: string) => void
  setEvent: (eventId: string) => void
  setProofName: (name: string | null) => void
  reset: () => void
}

export const useFlowStore = create<FlowState>((set) => ({
  identity: null,
  eventId: null,
  proofFileName: null,
  setMember: (awsccId) => set({ identity: { type: 'member', awsccId } }),
  setGuest: (guestName) => set({ identity: { type: 'guest', guestName } }),
  setEvent: (eventId) => set({ eventId }),
  setProofName: (name) => set({ proofFileName: name }),
  reset: () => set({ identity: null, eventId: null, proofFileName: null }),
}))
