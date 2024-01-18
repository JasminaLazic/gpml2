import { sortOptionsData } from '../constants/sorting'

export const setSearchParams = ({ searchText, tags, countries, goals, format, category, subcategory, sort, multiCountry }) => {
	if ('URLSearchParams' in window) {
		const searchParams = new URLSearchParams(window.location.search);
		searchParams.set('q', searchText);
		searchParams.set('tags', JSON.stringify(tags));
		searchParams.set('countries', JSON.stringify(countries));
		searchParams.set('goals', JSON.stringify(goals));
		searchParams.set('format', format);
		searchParams.set('category', category);
		searchParams.set('subcategory', subcategory);
		searchParams.set('multi-country',JSON.stringify( multiCountry));
		searchParams.set('sort', sort);
		const newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
		window.history.pushState(null, '', newRelativePathQuery);
	}
};

export const getSearchParams = () => {
	const [defaultSortingOption] = sortOptionsData;
	
	if ('URL' in window) {
		const params = (new URL(document.location)).searchParams;
		const searchText = params.get('q');
		const format = params.get('format');
		const category = params.get('category');
		const subcategory = params.get('subcategory');
		const tags = params.get('tags');
		const goals = params.get('goals');
		const countries = params.get('countries');
		const multiCountry = params.get('multi-country');
		const sort = params.get('sort');

		return ({
			searchText: searchText ?? '',
			format: format ?? '',
			category: category ?? '',
			subcategory: subcategory ?? '',
			tags: tags ? JSON.parse(tags) : [],
			goals: goals ? JSON.parse(goals) : [],
			multiCountry: multiCountry ? JSON.parse(multiCountry) : [],
			countries: countries ? JSON.parse(countries) : [],
			sort: sort ? sort : defaultSortingOption.key,
		});
	}

	return  {
		searchText: '',
		format: '',
		category: '',
		subcategory: '',
		tags: [],
		goals: [],
		countries: [],
		multiCountry: [],
		sort: defaultSortingOption.key,
	};
};

	