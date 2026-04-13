import { useState, useRef, useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion'
import './App.css'

const baseUrl = import.meta.env.BASE_URL

function Randomizer({ currentPool, setDisplayModal }) {
	const [highlighted, setHighlight] = useState(0)
	let deltaTime = useRef(2)
	let counter = useRef(1)
	let iterations = useRef(1)
	let isRunning = useRef(false)
	function roll() {
		if (isRunning.current == false) {
			// eslint-disable-next-line react-hooks/purity
			iterations.current = Math.floor((Math.random() * 4) + 2)
			counter.current = 1
			isRunning.current = true
			highlightIndex()
		}
	}
	function highlightIndex() {
		/* Option random */
		// setTimeout(()=>{
		// 	setHighlight((prev) => {
		// 		let value = Math.floor(Math.random() * currentPool.length)
		// 		while (value == prev) {
		// 			value = Math.floor(Math.random() * currentPool.length)
		// 		};
		// 		return value
		// 	})
		// 	console.log(`Counter: ${counter.current}, deltaTime: ${deltaTime.current}, highlighted: ${highlighted}`);

		// 	if (deltaTime.current == 512) {
		// 		deltaTime.current = 2
		// 		counter.current = 1
		// 		return
		// 	}

		// 	if (counter.current % iterations.current == 0) {
		// 		deltaTime.current = (deltaTime.current * 2)
		// 		counter.current = 0
		// 	}
		// 	counter.current++;
		// 	highlightIndex()
		// }, deltaTime.current) 
		/* Option row */
		setTimeout(() => {
			setHighlight((prev) => (prev + 1) % currentPool.length)
			if (deltaTime.current == 512) {
				deltaTime.current = 2
				isRunning.current = false
				return
			}

			if (counter.current % iterations.current == 0) {
				deltaTime.current = (deltaTime.current * 2)
				counter.current = 0
			}
			counter.current++;
			highlightIndex()
		}, deltaTime.current)
	}
	return (
		<div className="main-flex-or-whatever-man">
			<div className="randomizer-container">
				<div className="pool-view">
					<img src={`${baseUrl}public/img/ui/frame.png`} className="frame-top" />
					<img src={`${baseUrl}public/img/ui/frame.png`} className="frame-bottom" />
					{
						currentPool.map(({ nightfarer, icon }, index) => {
							return (
								<div key={index} className="character-icon-container-pool">
									<img src={`${baseUrl}public/img/Portraits/ERN_Icon_Menu_Character_${nightfarer}.webp`} className={`character-icon-img ${index == highlighted ? 'highlight' : ''}`} />
									{icon == 'None' ? '' : <img src={`${baseUrl}public/img/extras/${icon}.png`} className="character-icon-extra" />}
								</div>
							)
						})
					}
				</div>
				<div className="buttons-container">
					<motion.button
						whileHover={{ backgroundColor: 'rgb(7, 65, 86)' }} className="button-ui" onClick={() => { setDisplayModal(true) }}>Edit</motion.button>
					<motion.button
						whileHover={{ backgroundColor: 'rgb(7, 65, 86)' }}
						className="button-ui" onClick={roll}>Roll</motion.button>
				</div>
			</div>
		</div>
	)
}
function EditPool({ currentPool, setPool, displayModal, setDisplayModal, modalRef }) {
	const [editItem, setEditItem] = useState({ nightfarer: 'Wylder', icon: 'None' })
	const nightfarers = [
		'Wylder',
		'Guardian',
		'Ironeye',
		'Duchess',
		'Raider',
		'Revenant',
		'Recluse',
		'Executor',
		'Scholar',
		'Undertaker'
	]
	const icons = [
		'None',
		'Melee',
		'Casting',
		'Skill Attack',
		'Damage Negation',
		'Block',
		'Focus Points',
		'Stamina',
		'Status effects',
		'Critical Hits',
		'Bleed',
		'HP',
		'Shabriri'
	]

	const [nightfarerMenu, setNightfarerMenu] = useState(false)
	let nightfarerMenuRef = useRef(null)

	const [iconMenu, setIconMenu] = useState(false)
	let iconMenuRef = useRef(null)

	function deleteItem(e) {
		e.preventDefault()
		const target = e.currentTarget.dataset.id
		setPool(prev => prev.toSpliced(target, 1))
	}
	function useCrearMenuDesplegable(ref, setter, showing) {
		useEffect(() => {
			function desmontador(e) {
				if (!ref.current.contains(e.target))
					setter(false)
			}
			if (showing) {
				document.addEventListener('mousedown', desmontador)
			}
			return () => {
				document.removeEventListener('mousedown', desmontador);
			}
		}, [ref, showing, setter])
	}
	useCrearMenuDesplegable(nightfarerMenuRef, setNightfarerMenu, nightfarerMenu)
	useCrearMenuDesplegable(iconMenuRef, setIconMenu, iconMenu)

	const finalElement = (
		<motion.div 
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className='overlay'>
			<div className="edit-pool-modal" ref={modalRef}>
				<div className="exit-button" onClick={() => { setDisplayModal(false) }}>
					<svg viewBox="0 0 16 16" className="exit-svg">
						<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
					</svg>
				</div>
				<div className="add-element-label">
					<img src={`${baseUrl}public/img/ui/ornament.png`} className="ornament" />
					- Current Pool -
					<img src={`${baseUrl}public/img/ui/ornament.png`} className="ornament" />
				</div>
				<div className="pool-view-edit-container">
					<div className="pool-view-edit">
						{currentPool.map(({ nightfarer, icon }, index) => {
							return (
								<div className="pool-view-container-pool" key={index}>
									<img src={`${baseUrl}public/img/Portraits/ERN_Icon_Menu_Character_${nightfarer}.webp`} className="pool-view-character-icon-img" />
									<svg data-id={index} className="pool-view-character-icon-delete" viewBox="0 0 16 16" onClick={deleteItem}>
										<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z" />
									</svg>
									<img src={`${baseUrl}public/img/extras/${icon}.png`} alt="" className="pool-view-icon" />
								</div>
							)
						})}
					</div>
				</div>

				<div className="add-element-label">
					<img src={`${baseUrl}public/img/ui/ornament.png`} className="ornament" />
					- Add Element -
					<img src={`${baseUrl}public/img/ui/ornament.png`} className="ornament" />
				</div>

				<div className="add-character-container">
					<div className="preview">
						<div className="character-icon-preview">
							<img src={`${baseUrl}public/img/Portraits/ERN_Icon_Menu_Character_${editItem.nightfarer}.webp`} className="character-icon-img-preview" />
							{editItem.icon == 'None' ? '' : <img src={`${baseUrl}public/img/extras/${editItem.icon}.png`} className="character-icon-extra" />}
						</div>
					</div>
					<div className="entry-details-form">
						<div className="custom-options">
							<label htmlFor="nightfarer" className="label-entry">Select a Nightfarer</label>
							<span className="custom-button" ref={nightfarerMenuRef} onClick={(e) => { setNightfarerMenu(prev => !prev); e.preventDefault(); }}>
								<div className="selected">
									<img src={`${baseUrl}public/img/icons/${editItem.nightfarer}-icon.png`} />
									<span className="name">
										{editItem.nightfarer}
									</span>
								</div>
								<span className="arrow">
									<svg className="arrow" viewBox="0 0 16 16">
										<path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
									</svg>
								</span>
								<ul className={`options-list ${nightfarerMenu ? 'show' : ''}`}>
									{nightfarers.map((n) => {
										return (
											<li
												key={n}
												onClick={() => { setEditItem(prev => ({ ...prev, nightfarer: n })); }}>
												<img
													src={`${baseUrl}public/img/icons/${n}-icon.png`} />
												{n}
											</li>)
									})
									}
								</ul>
							</span>
						</div>
						<div className="custom-options">
							<label htmlFor="nightfarer" className="label-entry">Select an icon (optional)</label>
							<span className="custom-button" ref={iconMenuRef} onClick={(e) => { setIconMenu(prev => !prev); e.preventDefault(); }}>
								<div className="selected">
									{editItem.icon == 'None' ? '' : <img src={`${baseUrl}public/img/extras/${editItem.icon}.png`} />}
									<span className="name">
										{editItem.icon}
									</span>
								</div>
								<span className="arrow">
									<svg className="arrow" viewBox="0 0 16 16">
										<path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
									</svg>
								</span>
								<ul className={`options-list ${iconMenu ? 'show' : ''}`}>
									{icons.map(i => {
										return (
											<li key={i} onClick={() => { setEditItem(prev => ({ ...prev, icon: i })); }}>{i == 'None' ? '' : <img src={`${baseUrl}public/img/extras/${i}.png`} />}{i}</li>
										)
									})}
								</ul>
							</span>
						</div>
					</div>
				</div>
				<div className="buttons-container">
					<button className="button-ui" onClick={() => { setEditItem({ nightfarer: 'Wylder', icon: 'None' }) }}>Reset</button>
					<button className="button-ui" onClick={() => { setPool(prev => ([...prev, editItem])) }}>Add</button>
				</div>
			</div>
		</motion.div>
	)

	return (
		<AnimatePresence>
			{displayModal && finalElement}
		</AnimatePresence>
	)
}
function App() {
	const [currentPool, setPool] = useState([
		{ nightfarer: 'Wylder', icon: 'None' },
		{ nightfarer: 'Guardian', icon: 'None' },
		{ nightfarer: 'Ironeye', icon: 'None' },
		{ nightfarer: 'Duchess', icon: 'None' },
		{ nightfarer: 'Raider', icon: 'None' },
		{ nightfarer: 'Revenant', icon: 'None' },
		{ nightfarer: 'Recluse', icon: 'None' },
		{ nightfarer: 'Executor', icon: 'None' },
		{ nightfarer: 'Scholar', icon: 'None' },
		{ nightfarer: 'Undertaker', icon: 'None' }
	]);
	let modalRef = useRef(null)
	const [displayModal, setDisplayModal] = useState(false)
	useEffect(() => {
		function desmontador(e) {
			e.preventDefault()
			const target = e.target
			if (!modalRef.current.contains(target)) {
				setDisplayModal(false)
			}
		}
		if (displayModal) {
			document.addEventListener('mousedown', desmontador)
		}
		return () => {
			document.removeEventListener('mousedown', desmontador);
		}
	}, [displayModal])
	return (
		<>
			<Randomizer currentPool={currentPool} setDisplayModal={setDisplayModal} />
			<EditPool currentPool={currentPool} setPool={setPool} displayModal={displayModal} setDisplayModal={setDisplayModal} modalRef={modalRef} />
		</>
	)
}


export default App
