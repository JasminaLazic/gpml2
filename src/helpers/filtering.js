export const extracTagsByType = ({ tagList, countryList, goalList, languageList, transnationalOrgsList }) => {
	const transnationalOrganizationNameList = transnationalOrgsList.map((name) => name);
	const countriesFacets = tagList.filter(({ name }) => countryList.includes(name));
	const goalsFacets = tagList.filter(({ name }) => goalList.includes(name));
	const transnationalFacets = tagList.filter(({ name }) => transnationalOrganizationNameList.includes(name));
	const countryNameList = countriesFacets.map(({name}) => name);
	const goalNameList = goalsFacets.map(({name}) => name);

	const tagsFacets = tagList.filter(({ name }) => !countryNameList.includes(name) && !goalNameList.includes(name) && !transnationalOrganizationNameList.includes(name) && !languageList.includes(name));

	return ({
		countries: Array.from(new Set(countriesFacets)),
		tags: Array.from(new Set(tagsFacets)),
		goals: Array.from(new Set(goalsFacets)),
		multiCountry: Array.from(new Set(transnationalFacets)),
	});
};