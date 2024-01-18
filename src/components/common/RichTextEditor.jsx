import React, { useState, forwardRef } from 'react';
import ReactQuill from 'react-quill';
import styled from 'styled-components';

const RichTextInput = styled(ReactQuill)`
	height: 200px;
	margin-bottom: 50px;
`;

const RichTextEditor = forwardRef(({ value, valueKey, setFieldValue, maxValueLength }, ref) => {
	const [inputValue, setInputValue] = useState(value);

	function handleChange(data) {
		if (maxValueLength) {
			setInputValue(data.slice(0, maxValueLength));
		} else {
			setInputValue(data);
		}
	}

	function handleFieldValueChange() {
		setFieldValue(valueKey, inputValue);
	}

	return (
		<RichTextInput
			ref={ref}
			onBlur={handleFieldValueChange}
			value={inputValue}
			theme="snow"
			onChange={handleChange}
		/>
	);
});

export default RichTextEditor;
