import { Outlet } from '@tanstack/react-router'
import './layout.css'

export function AppLayout() {
	return (
		<div className="app-shell">
			<nav className="app-nav">
				<div className="app-nav__brand">AWS Cloud Club PUP</div>
			</nav>
			<main className="app-main">
				<Outlet />
			</main>
		</div>
	)
}

