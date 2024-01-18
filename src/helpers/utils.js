export const sortGoals = (goalList) => {
	const goalNumberValueMap = {};

	goalList.forEach((goal) => {
		const [_, number] = goal.split(' ');
		goalNumberValueMap[number] = goal;
	});

	const keys = Object.keys(goalNumberValueMap).map((key) => parseInt(key, 10)).sort((a, b) => a > b ? 1 : -1);


	const sortedGoalList = keys.map((key) => goalNumberValueMap[`${key}`]);
	return sortedGoalList;
};