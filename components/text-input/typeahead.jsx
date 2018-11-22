import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Token as _Token, Menu as _Menu, MenuItem as _MenuItem } from 'react-bootstrap-typeahead';
import { SolidTriangleIcon as _SolidTriangleIcon } from '../icons';
import { BootstrapContainer } from '../utils';
import './custom.scss';
import { Typeahead as _BestTypeahead } from './custom-typeahead';

const SolidTriangleIcon = styled(_SolidTriangleIcon)`
	transform: rotateZ(90deg);
	color: #7a7a7a;
	height: 8px;
	width: 8px;
`;

const StyledAsyncTypeahead = styled(_BestTypeahead)`
	.rbt-highlight-text {
		padding: 0;
		font-weight: bold;
		background-color: inherit;
	}

	&&& {
		.rbt-token-remove-button {
			top: 0;
		}
	}
`;

const StyledTypeahead = styled(_BestTypeahead)`
	.rbt-highlight-text {
		padding: 0;
		font-weight: bold;
		background-color: inherit;
	}

	&&& {
		.rbt-token-remove-button {
			top: 0;
		}
	}
`;

const IndicatorContainer = styled.div`
	pointer-events: none;
	position: absolute;
	right: 6px;
	top: calc(50% - 4px);
	z-index: 3;
	display: flex;

	&:hover {
		cursor: pointer;
	}
`;

const RelativeContainer = styled.div`
	position: relative;
`;

export const AsyncTypeahead = ({ inferred, ...props }) => (
	<BootstrapContainer>
		<RelativeContainer>
			<StyledAsyncTypeahead {...props} />
			{!inferred && (
				<IndicatorContainer>
					<SolidTriangleIcon />
				</IndicatorContainer>
			)}
		</RelativeContainer>
	</BootstrapContainer>
);

export const Typeahead = ({ inferred, ...props }) => (
	<BootstrapContainer>
		<RelativeContainer>
			<StyledTypeahead {...props} />
			{!inferred && (
				<IndicatorContainer>
					<SolidTriangleIcon />
				</IndicatorContainer>
			)}
		</RelativeContainer>
	</BootstrapContainer>
);

Typeahead.propTypes = {
	inferred: PropTypes.bool,
};

AsyncTypeahead.propTypes = {
	inferred: PropTypes.bool,
};

export const Token = _Token;
export const Menu = _Menu;
export const MenuItem = _MenuItem;
