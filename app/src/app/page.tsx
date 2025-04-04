import { ExempleNoProps } from './components/ExempleNoProps'
import { Exemple } from './components/Exemple'

export default function Home() {
	return (
		<div className='space-y-10'>
			<Exemple />
			<ExempleNoProps />
		</div>
	)
}
