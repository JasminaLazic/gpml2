import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SearchBar from './searchBar';
import Content from './Content';
import { getSearchParams } from '../../helpers/searchParams';
import { getCountryList, getGoalList, getTransnationalList, getLanguageList, searchDataset } from '../../api';
import { extracTagsByType } from './../../helpers/filtering';
import FilterAndPageingIndicator from './FilterAndPageingIndicator';

const Container = styled.div`
	background-color: #D3DEE726;
	flex: 1;
	display: flex;
	flex-direction: column;
`;

const PAGE_SIZE = 9;

const HomePage = ({ setDatasetList, datasetList }) => {
	const [searchFilterData, setSearchFilterData] = useState(getSearchParams());
	const [facets, setFacets] = useState({tags: [], countries: [], goals: [], formats: []});
	const [vocabulary, setVocabulary] = useState(null);
	const [pagingSize, setPaginSize] = useState(PAGE_SIZE);

	useEffect(() => {
		fetchFilteredDataList();
	}, [searchFilterData]);

	useEffect(() => {
		setPaginSize(PAGE_SIZE);
	}, [datasetList]);

	async function fetchFilteredDataList() {
		setDatasetList(null);
		let voabularyData = vocabulary;
		if (!vocabulary) {
			voabularyData = await fetchVocabularyAndTags();
		}

		const data = await searchDataset(searchFilterData);
		setDatasetList(data.result.results);
		
		organiseAndSetFacets(data.result.search_facets, voabularyData);
	}

	async function fetchVocabularyAndTags() {
		const countryList = await getCountryList();
		const goalList = await getGoalList();
		const languageList = await getLanguageList();
		const transnationalOrgsList = await getTransnationalList();
		const voabularyData = ({
			countryList: Array.from(new Set(countryList)),
			goalList: Array.from(new Set(goalList)),
			languageList: Array.from(new Set(languageList)),
			transnationalOrgsList: Array.from(new Set(transnationalOrgsList)),
		});
		setVocabulary(voabularyData);
		return voabularyData
	}

	function handlePagingIncrease() {
		setPaginSize((state) => state + PAGE_SIZE);
	}

	function organiseAndSetFacets(facets, vocabulary) {
		const { countries, tags, goals, multiCountry } = extracTagsByType({ tagList: facets.tags.items, ...vocabulary });

		const formats = facets.data_format.items;
		const categories = facets.category.items;
		const subcategories = facets.sub_category.items;

		setFacets({ countries, tags, goals, formats, categories, subcategories, multiCountry });
	}

	return (
		<Container>
			<SearchBar
				searchFilterData={searchFilterData}
				setSearchFilterData={setSearchFilterData}
				facets={facets}
			/>
			<FilterAndPageingIndicator
				searchFilterData={searchFilterData}
				setSearchFilterData={setSearchFilterData}
				datasetSize={datasetList?.length}
				pagingSize={pagingSize}
			/>
			<Content
				datasetList={datasetList}
				pagingSize={pagingSize}
				onLoadMore={handlePagingIncrease}
			/>
		</Container>
	);
};

export default HomePage;
