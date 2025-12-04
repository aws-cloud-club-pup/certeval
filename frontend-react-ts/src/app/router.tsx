import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import React from 'react'
import { AppLayout } from './layout'
import MemberVerification from '../features/user-flow/pages/1_MemberVerification'
import EventSelection from '../features/user-flow/pages/2_EventSelection'
import CompleteSurvey from '../features/user-flow/pages/3_CompleteSurvey'
import UploadProof from '../features/user-flow/pages/4_UploadProof'
import Congratulations from '../features/user-flow/pages/5_Congratulations'
import HomePage from '../features/home/HomePage'

const rootRoute = createRootRoute({
	component: () => <AppLayout />,
})

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/',
	component: HomePage,
})

const verificationRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/verification',
	component: MemberVerification,
})

const eventRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/events',
	component: EventSelection,
})

const surveyRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/survey',
	component: CompleteSurvey,
})

const uploadRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/upload',
	component: UploadProof,
})

const doneRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/done',
	component: Congratulations,
})

const routeTree = rootRoute.addChildren([indexRoute, verificationRoute, eventRoute, surveyRoute, uploadRoute, doneRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

