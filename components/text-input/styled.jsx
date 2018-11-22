import styled from 'styled-components';
import { thickness, fonts, colors, inputColors } from '../shared-styles';

export const Container = styled.div`
	position: relative;
	background: ${colors.white};
`;

export const InputContainer = styled.div`
	position: relative;
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	border-radius: 3px;
	overflow-x: scroll;
	border: 1px solid ${inputColors.inputBorderColor};
`;

export const Token = styled.div`
	background: ${colors.gray4};
	border-radius: 3px;
	margin: ${thickness.four} ${thickness.two};
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 ${thickness.four};
	white-space: nowrap;
`;

export const Input = styled.input`
	height: 36px;
	padding: 0 ${thickness.eight};
	width: 100%;
	box-sizing: border-box;
	outline: none;
	font: ${fonts.ui16};
	border: none;
	min-width: 250px;
	flex: 1;
`;

export const OptionsContainer = styled.div`
	flex: 1;
	width: 100%;
	position: absolute;
	top: 100%;
	max-height: 300px;
	overflow-y: scroll;
	border: 1px solid ${colors.gray22};
	border-radius: 3px;
	z-index: 2;
`;

export const Option = styled.button`
	cursor: pointer;
	width: 100%;
	height: 32px;
	font: ${fonts.ui16};
	display: flex;
	background: ${props => (props.isFocused ? colors.gray4 : colors.white)};
	border: none;
	outline: none;

	:hover {
		background: ${colors.gray4};
	}
`;

export const CloseButton = styled.div`
	border: none;
	background: none;
	cursor: pointer;
	padding: 0;
	font-weight: 600;
	height: 20px;
	margin-left: ${thickness.four};
	font-size: 24px;
	line-height: 24px;
`;
