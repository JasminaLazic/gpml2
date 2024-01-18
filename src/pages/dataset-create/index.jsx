import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Input, Select, DatePicker, Radio, Space, Popover, Form, message } from 'antd';
import 'react-quill/dist/quill.snow.css';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Formik } from 'formik';
import TopBar from './TopBar';
import { categories, subCategories, geoCoverage, dataType as dataTypeList, format as formatList, transnationalOrganizations } from '../../constants/dataSetForm';
import { getTagList, getCountryList, getGoalList, getTransnationalList, getLanguageList, createDataset, getLicenseList, getStakeholdersList } from '../../api';
import { isValidUrl } from '../../helpers/validation';
import EntityAccordion from '../../components/entityAccordion/index';
import RichTextEditor from '../../components/common/RichTextEditor';
import { sortGoals } from '../../helpers/utils';

const { Option } = Select;

const OTHER_GEO_OPTION = 'Other';

const Container = styled.div`
	padding-bottom: 110px;
`;
const FormWrapper = styled.div``;

const FormContainer = styled.div`
	margin: 25px 0px;
`;

const FormLabel = styled.span`
	font-style: normal;
	font-weight: normal;
	font-size: 18px;
	margin-bottom: 4px;
	display: block;
	line-height: 25px;
	color: #000000;
`;

const StyledInput = styled(Input)`
	background: #EDF2F7;

	&::placeholder {
		color: #A5B0C9;
	}

	& .ant-input {
		background: #EDF2F7;
	}
`;

const RowDiv = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const StyledSelect = styled(Select)`
	width: 100%;
	border-radius: 8px;

	& .ant-select-selector {
		background: ${props => props.$isMultiple ? '#EDF2F7' : '#FFF'} !important;
	}

	& .ant-select-selection-placeholder {
		color: #A5B0C9 !important;
	}

	& .ant-select-selection-item {
		background-color: white !important;
	}
`;

const StyledDatePicker = styled(DatePicker.RangePicker)`
	width: 100%;
	background: #EDF2F7;

	& input {
		&::placeholder {
			color: #A5B0C9;
		}
	}
`;

const PopoverContainer = styled.div`
	max-height: 50vh;
    padding: 0 12px;
	width: 280px;
    overflow: auto;

	/* width */
	&::-webkit-scrollbar {
		width: 3px;
	}

	/* Track */
	&::-webkit-scrollbar-track {
		background: #f1f1f1; 
	}
	
	/* Handle */
	&::-webkit-scrollbar-thumb {
		background: #346896; 
	}

	/* Handle on hover */
	&::-webkit-scrollbar-thumb:hover {
		background: #1890ff;
	}
`;

const StyledInfoIcon = styled(InfoCircleOutlined)`
	color: #036799;
	margin-left: 5px;
`;

const RequiredFieldMessage = styled.span`
	font-style: normal;
	font-weight: normal;
	font-size: 17px;
	margin-left: 5px;
	color: #ED4337;
	display: block;
	line-height: 25px;
`;

const defaultEntity = {
	entityType: '',
	entityOrganizationId: '',
	id: `${Date.now()}`
};

const CreateDatasetPage = () => {
	const [tagList, setTagList] = useState([]);
	const [vocabulary, setVocabulary] = useState({
		countryList: [],
		goalList: [],
		languageList: [],
		transnationalOrgsList: [],
		licenseList: [],
		stakeholders: [],
	});
	const [requiredFieldsHighlited, setRequiredFieldsHighlited] = useState(true);
	const descriptionRef = useRef();
	const infoRef = useRef();

	useEffect(() => {
		fetchVocabularyAndTags();
	}, []);

	async function fetchVocabularyAndTags() {
		const tagList = await getTagList();
		const countryList = await getCountryList();
		const goalList = await getGoalList();
		const languageList = await getLanguageList();
		const transnationalOrgsList = await getTransnationalList();
		const licenseList = await getLicenseList();
		const stakeholdersList = await getStakeholdersList();
		const filteredTagList = tagList.filter((tagName) => !countryList.includes(tagName) && !goalList.includes(tagName) && !languageList.includes(tagName) && !transnationalOrgsList.includes(tagName));

		setTagList(Array.from(new Set(filteredTagList)));
		setVocabulary({
			countryList: Array.from(new Set(countryList)),
			goalList: sortGoals(Array.from(new Set(goalList))),
			languageList: Array.from(new Set(languageList)),
			transnationalOrgsList: Array.from(new Set([...transnationalOrgsList, OTHER_GEO_OPTION])),
			licenseList,
			stakeholders: stakeholdersList.map(([id, name, bool]) => ({ name, id })),
		});
	}

	function getCategoryOption() {
		const options = categories.map((category) => <Option key={category}>{category}</Option>);
		return options;
	}

	function getSubCategoryOptions(category) {
		if (category) {
			const options = subCategories[category].map((subCategory) => <Option key={subCategory}>{subCategory}</Option>);

			return options;
		}

		return [];
	}

	function getTagOptionList() {
		const options = tagList.map((item) => <Option key={item}>{item}</Option>);
		return options;
	}

	function getGoalsOptionList() {
		const options = vocabulary.goalList.map((item) => <Option key={item}>{item}</Option>);
		return options;
	}

	function getLanguagesOptionList() {
		const options = vocabulary.languageList.map((item) => <Option key={item}>{item}</Option>);
		return options;
	}

	function getFormatOptionList() {
		const options = formatList.map((item) => <Option key={item}>{item}</Option>);
		return options;
	}

	function getDatatypeOptionList() {
		const options = dataTypeList.map((item) => <Option key={item}>{item}</Option>);
		return options;
	}

	function getLicenseOptionList() {
		const options = vocabulary.licenseList.map((item) => <Option key={item.id}>{item.title}</Option>);
		return options;
	}

	async function handleCreateDataset(values) {
		let createData = values;

		if (createData.geoCoverageType === geoCoverage.global) {
			createData = {...createData, transnationals:[], countries: [], countryArea: ''  };
		} else if (createData.geoCoverageType === geoCoverage.transnational){
			if (createData.transnationals.includes(OTHER_GEO_OPTION)) {
				createData = {...createData, transnationals: createData.transnationals.filter((item) => item !== OTHER_GEO_OPTION), countryArea: ''};
			} else {
				createData = {...createData, countries: [], countryArea: ''};
			}
		} else if (createData.geoCoverageType === geoCoverage.national){
			createData = {...createData, transnationals:[], countryArea: ''  };
		} else if (createData.geoCoverageType === geoCoverage.subnational){
			createData = {...createData, transnationals:[]  };
		}

		
		const [err, result] = await createDataset({ ...createData });

		return [err, result];
	}

	function handleValidate(values) {
		const errors = {};

		if (!values.title) {
			errors.title = 'Required';
		}

		if (!values.dataType) {
			errors.dataType = 'Required';
		}

		if (!values.format) {
			errors.format = 'Required';
		}

		if (!values.license) {
			errors.license = 'Required';
		}

		if (!values.category) {
			errors.category = 'Required';
		}

		if (!values.subCategory) {
			errors.subCategory = 'Required';
		}

		if (!values.description) {
			errors.description = 'Required';
		}

		if (!values.dataSource) {
			errors.dataSource = 'Required';
		}

		if (values.dataSource && !isValidUrl(values.dataSource)) {
			errors.dataSource = 'Should be valid url';
		}

		if (!values.tags.length) {
			errors.tags = 'At least one tag should be selected';
		}

		if (!values.entityList || values.entityList.length === 0) {
			errors.entityList = 'At least one entity connection is required';
		} else if (values.entityList.some((entityItem) => !entityItem.entityOrganizationId || !entityItem.entityType)) {
			errors.entityList = 'Please fill all entity role and entity fields';
		}

		if (!values.languages.length) {
			errors.languages = 'At least one language should be selected';
		}

		if (!values.goals.length) {
			errors.goals = 'At least one goal should be selected';
		}

		if (values.geoCoverageType === geoCoverage.transnational) {
			if (!values.transnationals.length) {
				errors.transnationals = 'At least one transnational organization should be selected';
			}
		}

		if (values.geoCoverageType === geoCoverage.national) {
			if (!values.countries.length) {
				errors.countries = 'At least one country organization should be selected';
			}
		}

		if (values.geoCoverageType === geoCoverage.subnational) {
			if (!values.country) {
				errors.country = 'Required';
			}
		}

		return errors;
	};

	function renderMultiCountrySelector(values, setFieldValue, touched, errors) {
		function generatePopoverContent(oraganizationName) {
			const organization = transnationalOrganizations.find(({ name }) => name === oraganizationName);

			const countryItems = organization ? organization.countryList.map(({ name, id }) => <div key={id}>{name}</div>) : null;

			return (
				<PopoverContainer >
					{countryItems}
				</PopoverContainer>
			);
		}

		const options = vocabulary.transnationalOrgsList.map((name) => (
			<Option key={name}>
				{name}
				<Popover placement="right" content={generatePopoverContent(name)}>
					<StyledInfoIcon />
				</Popover>
			</Option>
		));

		const countryOptions = vocabulary.countryList.map((countryName) => <Option key={countryName}>{countryName}</Option>);

		return (
			<>
				<FormContainer>
					<RowDiv><FormLabel>GEO COVERAGE (Transnational)</FormLabel>{requiredFieldsHighlited && <RequiredFieldMessage>*</RequiredFieldMessage>}</RowDiv>
					<Form.Item
						validateStatus={touched.transnationals && errors.transnationals ? 'error' : 'validating'}
						help={touched.transnationals ? errors.transnationals : ''}
					>
						<StyledSelect
							$isMultiple
							allowClear
							mode="multiple"
							value={values.transnationals}
							onChange={(data) => setFieldValue('transnationals', data)}
							placeholder="GEO COVERAGE (Transnational)"
						>
							{options}
						</StyledSelect>
					</Form.Item>
				</FormContainer>
				{
					values.transnationals.includes(OTHER_GEO_OPTION) && (
						<FormContainer>
							<RowDiv><FormLabel>GEO COVERAGE (Countries)</FormLabel></RowDiv>
							<Form.Item
								validateStatus={touched.countries && errors.countries ? 'error' : 'validating'}
								help={touched.countries ? errors.countries : ''}
							>
								<StyledSelect
									$isMultiple
									allowClear
									mode="multiple"
									placeholder="Select countries"
									value={values.countries}
									onChange={(data) => setFieldValue('countries', data)}
								>
									{countryOptions}
								</StyledSelect>
							</Form.Item>
						</FormContainer>
					)
				}
			</>
		);
	}

	function renderGeoCoverageSubForm(geoCoverageType, values, setFieldValue, handleChange, touched, errors) {
		if (geoCoverageType === geoCoverage.global) {
			return null;
		}

		if (geoCoverageType === geoCoverage.transnational) {
			return renderMultiCountrySelector(values, setFieldValue, touched, errors);
		}

		if (geoCoverageType === geoCoverage.national) {
			const options = vocabulary.countryList.map((countryName) => <Option key={countryName}>{countryName}</Option>);

			return (
				<FormContainer>
					<RowDiv><FormLabel>GEO COVERAGE (Countries)</FormLabel>{requiredFieldsHighlited && <RequiredFieldMessage>*</RequiredFieldMessage>}</RowDiv>
					<Form.Item
						validateStatus={touched.countries && errors.countries ? 'error' : 'validating'}
						help={touched.countries ? errors.countries : ''}
					>
						<StyledSelect
							$isMultiple
							allowClear
							mode="multiple"
							placeholder="Select countries"
							value={values.countries}
							onChange={(data) => setFieldValue('countries', data)}
						>
							{options}
						</StyledSelect>
					</Form.Item>
				</FormContainer>
			);
		}

		if (geoCoverageType === geoCoverage.subnational) {
			const options = vocabulary.countryList.map((countryName) => <Option key={countryName}>{countryName}</Option>);

			return (
				<>
					<FormContainer>
						<RowDiv><FormLabel>GEO COVERAGE (Country)</FormLabel>{requiredFieldsHighlited && <RequiredFieldMessage>*</RequiredFieldMessage>}</RowDiv>
						<Form.Item
							validateStatus={touched.country && errors.country ? 'error' : 'validating'}
							help={touched.country ? errors.country : ''}
						>
							<StyledSelect
								$isMultiple
								allowClear
								mode="multiple"
								placeholder="Select a country"
								value={[...(values.country ? [values.country] : [])]}
								onChange={(data) => {
									setFieldValue('country', data.pop())
								}}
								size="large"
							>
								{options}
							</StyledSelect>
						</Form.Item>
					</FormContainer>
					<FormContainer>
						<RowDiv><FormLabel>City</FormLabel></RowDiv>
						<Form.Item
							validateStatus={touched.countryArea && errors.countryArea ? 'error' : 'validating'}
							help={touched.countryArea ? errors.countryArea : ''}
						>
							<StyledInput name="countryArea" onChange={handleChange} placeholder="Area" size="large" />
						</Form.Item>
					</FormContainer>
				</>

			);
		}
	}

	return (
		<Container>
			<Formik
				initialValues={{
					file: '', title: '', category: '', subCategory: '', description: '', dataSource: '', tags: [], goals: [], geoCoverageType: geoCoverage.global,
					transnationals: [], dataType: '', format: '', languages: [], info: '', startEndDate: [], countries: [],
					country: '', countryArea: '', license: '', entityList: [defaultEntity],
				}}
				validate={handleValidate}
				onSubmit={async (values, { setSubmitting }) => {
					const [err, result] = await handleCreateDataset({ ...values, info: infoRef?.current.value, description: descriptionRef?.current.value });

					if (err) {
						return message.error(`Error occured while processing current operation: ${err?.message}`);
					}

					message.success('You have successully added content to datahub');
					setTimeout(() => {
						window.location = '/';
					}, 3000);
				}}
			>
				{({
					values,
					setFieldValue,
					errors,
					touched,
					handleChange,
					handleSubmit,
					isSubmitting,
				}) => (
					<div>
						<TopBar
							onSubmit={handleSubmit}
							requiredFieldsHighlited={requiredFieldsHighlited}
							toggleRequiredFieldsHighlite={setRequiredFieldsHighlited}
						/>
						<FormWrapper className="container">
							<FormContainer>
								<RowDiv><FormLabel>Thumbnail</FormLabel></RowDiv>
								<Form.Item
									validateStatus={touched.file && errors.file ? 'error' : 'validating'}
									help={touched.file ? errors.file : ''}
								>
									<StyledInput
										name="file"
										onChange={(event) => {
											setFieldValue("file", event.currentTarget.files[0]);
										}}
										type="file"
										size="large"
										accept="image/*"
									/>
								</Form.Item>
							</FormContainer>
							<FormContainer>
								<RowDiv><FormLabel>Title</FormLabel>{requiredFieldsHighlited && <RequiredFieldMessage>*</RequiredFieldMessage>}</RowDiv>
								<Form.Item
									validateStatus={touched.title && errors.title ? 'error' : 'validating'}
									help={touched.title ? errors.title : ''}
								>
									<StyledInput name="title" onChange={handleChange} value={values.title} placeholder="Title" size="large" />
								</Form.Item>
							</FormContainer>
							<FormContainer>
								<RowDiv><FormLabel>Data Category</FormLabel>{requiredFieldsHighlited && <RequiredFieldMessage>*</RequiredFieldMessage>}</RowDiv>
								<Form.Item
									validateStatus={touched.category && errors.category ? 'error' : 'validating'}
									help={touched.category ? errors.category : ''}
								>
									<StyledSelect placeholder="Select a category" value={values.category} size="large" onChange={(data) => {
										setFieldValue('subCategory', '')
										setFieldValue('category', data)
									}}
									>
										{getCategoryOption()}
									</StyledSelect>
								</Form.Item>
							</FormContainer>
							<FormContainer>
								<RowDiv><FormLabel>Sub Category</FormLabel>{requiredFieldsHighlited && <RequiredFieldMessage>*</RequiredFieldMessage>}</RowDiv>
								<Form.Item
									validateStatus={touched.subCategory && errors.subCategory ? 'error' : 'validating'}
									help={touched.subCategory ? errors.subCategory : ''}
								>
									<StyledSelect placeholder="Select a sub category" value={values.subCategory} size="large" onChange={(data) => setFieldValue('subCategory', data)}>
										{getSubCategoryOptions(values.category)}
									</StyledSelect>
								</Form.Item>
							</FormContainer>
							<FormContainer>
								<RowDiv><FormLabel>Description</FormLabel>{requiredFieldsHighlited && <RequiredFieldMessage>*</RequiredFieldMessage>}</RowDiv>
								<Form.Item
									validateStatus={touched.description && errors.description ? 'error' : 'validating'}
									help={touched.description ? errors.description : ''}
								>
									<RichTextEditor ref={descriptionRef} value={values.description} valueKey="description" setFieldValue={setFieldValue} maxValueLength={1000} />
								</Form.Item>
							</FormContainer>
							<FormContainer>
								<RowDiv><FormLabel>Data Source</FormLabel>{requiredFieldsHighlited && <RequiredFieldMessage>*</RequiredFieldMessage>}</RowDiv>
								<Form.Item
									validateStatus={touched.dataSource && errors.dataSource ? 'error' : 'validating'}
									help={touched.dataSource ? errors.dataSource : ''}
								>
									<StyledInput addonBefore="http://" value={values.dataSource} name="dataSource" size="large" placeholder="www.url.com" onChange={handleChange} />
								</Form.Item>
							</FormContainer>
							<FormContainer>
								<FormLabel>Geo Coverage</FormLabel>
								<Radio.Group name="geoCoverageType" value={values.geoCoverageType} onChange={handleChange}>
									<Space direction="vertical">
										{Object.values(geoCoverage).map((item) => <Radio key={item} value={item}>{item}</Radio>)}
									</Space>
								</Radio.Group>
							</FormContainer>
							{renderGeoCoverageSubForm(values.geoCoverageType, values, setFieldValue, handleChange, touched, errors)}
							<FormContainer>
								<RowDiv><FormLabel>Tags</FormLabel>{requiredFieldsHighlited && <RequiredFieldMessage>*</RequiredFieldMessage>}</RowDiv>
								<Form.Item
									validateStatus={touched.tags && errors.tags ? 'error' : 'validating'}
									help={touched.tags ? errors.tags : ''}
								>
									<StyledSelect
										$isMultiple
										allowClear
										mode="tags"
										value={values.tags}
										onChange={(data) => setFieldValue('tags', data)}
										placeholder="Select tags"
										size="large"
									>
										{getTagOptionList()}
									</StyledSelect>
								</Form.Item>
							</FormContainer>
							<FormContainer>
								<RowDiv><FormLabel>Goals</FormLabel>{requiredFieldsHighlited && <RequiredFieldMessage>*</RequiredFieldMessage>}</RowDiv>
								<Form.Item
									validateStatus={touched.goals && errors.goals ? 'error' : 'validating'}
									help={touched.goals ? errors.goals : ''}
								>
									<StyledSelect
										$isMultiple
										allowClear
										mode="multiple"
										value={values.goals}
										onChange={(data) => setFieldValue('goals', data)}
										placeholder="Select goals"
										size="large"
									>
										{getGoalsOptionList()}
									</StyledSelect>
								</Form.Item>
							</FormContainer>
							<FormContainer>
								<RowDiv><FormLabel>Entity connection</FormLabel>{requiredFieldsHighlited && <RequiredFieldMessage>*</RequiredFieldMessage>}</RowDiv>
								<Form.Item
									validateStatus={touched.entityList && errors.entityList ? 'error' : 'validating'}
									help={touched.entityList ? errors.entityList : ''}
								>
									<EntityAccordion
										hasError={touched.entityList && errors.entityList}
										entityList={values.entityList}
										entityOptionList={vocabulary.stakeholders}
										setEntityList={(newValue) => setFieldValue('entityList', newValue)}
									/>
								</Form.Item>
							</FormContainer>
							<FormContainer>
								<RowDiv><FormLabel>Data Type</FormLabel>{requiredFieldsHighlited && <RequiredFieldMessage>*</RequiredFieldMessage>}</RowDiv>
								<Form.Item
									validateStatus={touched.dataType && errors.dataType ? 'error' : 'validating'}
									help={touched.dataType ? errors.dataType : ''}
								>
									<StyledSelect value={values.dataType} placeholder="Select type of data" size="large" onChange={(data) => setFieldValue('dataType', data)}>
										{getDatatypeOptionList()}
									</StyledSelect>
								</Form.Item>
							</FormContainer>
							<FormContainer>
								<RowDiv><FormLabel>Format</FormLabel>{requiredFieldsHighlited && <RequiredFieldMessage>*</RequiredFieldMessage>}</RowDiv>
								<Form.Item
									validateStatus={touched.format && errors.format ? 'error' : 'validating'}
									help={touched.format ? errors.format : ''}
								>
									<StyledSelect value={values.format} placeholder="Select format" size="large" onChange={(data) => setFieldValue('format', data)}>
										{getFormatOptionList()}
									</StyledSelect>
								</Form.Item>
							</FormContainer>
							<FormContainer>
								<RowDiv><FormLabel>Languages</FormLabel>{requiredFieldsHighlited && <RequiredFieldMessage>*</RequiredFieldMessage>}</RowDiv>
								<Form.Item
									validateStatus={touched.languages && errors.languages ? 'error' : 'validating'}
									help={touched.languages ? errors.languages : ''}
								>
									<StyledSelect
										$isMultiple
										allowClear
										mode="multiple"
										value={values.languages}
										onChange={(data) => setFieldValue('languages', data)}
										placeholder="Select languages"
										size="large"
									>
										{getLanguagesOptionList()}
									</StyledSelect>
								</Form.Item>
							</FormContainer>
							<FormContainer>
								<RowDiv><FormLabel>Start and End Dates</FormLabel></RowDiv>
								<Form.Item
									validateStatus={touched.startEndDate && errors.startEndDate ? 'error' : 'validating'}
									help={touched.languastartEndDateges ? errors.startEndDate : ''}
								>
									<StyledDatePicker onChange={(data, dateStrings) => setFieldValue('startEndDate', dateStrings)} size="large" />
								</Form.Item>
							</FormContainer>
							<FormContainer>
								<RowDiv><FormLabel>License</FormLabel>{requiredFieldsHighlited && <RequiredFieldMessage>*</RequiredFieldMessage>}</RowDiv>
								<Form.Item
									validateStatus={touched.license && errors.license ? 'error' : 'validating'}
									help={touched.license ? errors.license : ''}
								>
									<StyledSelect value={values.license} placeholder="Select license type" size="large" onChange={(data) => setFieldValue('license', data)}>
										{getLicenseOptionList()}
									</StyledSelect>
								</Form.Item>
							</FormContainer>
							<FormContainer>
								<FormLabel>Info and Docs</FormLabel>
								<RichTextEditor ref={infoRef} value={values.info} valueKey="info" setFieldValue={setFieldValue} />
							</FormContainer>
						</FormWrapper>
					</div>
				)}
			</Formik>
		</Container>
	);
};

export default CreateDatasetPage;
