import React, {useState} from 'react'
import {FilteredUser, User, Users} from '../../../types/user'
import style from './style.module.css'
import UIButton from '../../UI/UIButton'
import OneFilteredUser from './OneFilteredUser'
import calcSummaryDuration from '../../../lib/calcSummaryDuration'
import {TimeType} from '../../../enum/TimeType'
import {initialMinutesToFilter} from '../../../constants/constants'

const FilterByOverallTime = ({users}: Users) => {
	const [filteredUsers, setFilteredUsers] = useState<FilteredUser[]>([])
	const [filterTimeMin, setFilterTimeMin] = useState<string>(initialMinutesToFilter)
	const [filterTimeSec, setFilterTimeSec] = useState<string>('')
	const [showFiltered, setShowFiltered] = useState<boolean>(false)
	const [noUsersFound, setNoUsersFound] = useState<boolean>(false)

	const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		const name = event.target.name
		switch (name) {
			case TimeType.min: {
				setFilterTimeMin(value)
				break
			}
			case TimeType.sec: {
				setFilterTimeSec(value)
				break
			}
			default: {
				console.error('в inputHandler не отработал ни один кейс')
			}
		}
	}

	const createUnfilteredUser = ({username, intervals}: User): FilteredUser => ({
		username,
		duration: calcSummaryDuration(intervals)
	})

	const showList = () => {
		const filterByThisSeconds = Math.abs(Number(filterTimeMin) * 60 + Number(filterTimeSec))
		if (!filterByThisSeconds && filterByThisSeconds !== 0) throw new Error('введено не число')
		const unfilteredUsers = users.map((el) => createUnfilteredUser(el))
		const filterUsers = unfilteredUsers.filter((el) => el.duration >= filterByThisSeconds)
		setFilteredUsers(filterUsers)

		if (!filterUsers?.length) {
			setShowFiltered(false)
			setNoUsersFound(true)
			return
		}
		setShowFiltered(true)
		setNoUsersFound(false)
	}
	const hideList = () => {
		setShowFiltered(false)
		setNoUsersFound(false)
	}
	const showListOnPressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') showList()
	}

	return (
		<div className={style.container}>
			<p className={style.title}>Отфильтровать устастников по количеству проведенного времени</p>
			<p className={style.title}>и установить время "доверия" к пользователю</p>
			<div className={style.inputsButtons}>
				<label htmlFor="min">минут</label>
				<input
					className={style.input}
					name="min"
					value={filterTimeMin}
					onChange={inputHandler}
					onKeyDown={showListOnPressEnter}
				/>
				<label htmlFor="sec">секунд</label>
				<input
					className={style.input}
					name="sec"
					value={filterTimeSec}
					onChange={inputHandler}
					onKeyDown={showListOnPressEnter}
				/>
				<UIButton onClick={showList}>Показать</UIButton>
				<UIButton onClick={hideList}>Скрыть</UIButton>
			</div>
			{showFiltered && (
				<div className={style.list}>
					{'Общее количество: ' + filteredUsers?.length}
					{filteredUsers?.map(({username, duration}) => (
						<OneFilteredUser
							key={Math.random() * 100000}
							username={username}
							duration={duration}
						/>
					))}
				</div>
			)}
			{noUsersFound && <p className={style.list}>Участники не найдены</p>}
		</div>
	)
}

export default FilterByOverallTime
