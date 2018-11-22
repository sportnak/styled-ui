import React from 'react';
import PropTypes from 'prop-types';
import { Close } from '../icons';
import * as Styled from './styled';

const rowHeight = 36;
const optionsHeight = 300;
export class Typeahead extends React.Component {
	static propTypes = {
		/**
		 * standard input properties
		 */
		autocomplete: PropTypes.bool,
		placeholder: PropTypes.string,
		onFocus: PropTypes.func,
		onBlur: PropTypes.func,
		onInputChange: PropTypes.func,
		value: PropTypes.string,

		/**
		 * classModifications
		 */
		inputContainerClass: PropTypes.string,
		inputClass: PropTypes.string,
		optionsClass: PropTypes.string,
		optionClass: PropTypes.string,

		/**
		 * component-specific properties
		 */
		onChange: PropTypes.func,
		options: PropTypes.arrayOf(PropTypes.string),
		selected: PropTypes.arrayOf(PropTypes.string),
		multiple: PropTypes.bool,
		clearFilter: PropTypes.bool,
		tokenBreaks: PropTypes.arrayOf(PropTypes.string),
	};

	static defaultProps = {
		onFocus: () => {},
		onBlur: () => {},
		onChange: () => {},
		selected: [],
		tokenBreaks: [],
	};

	constructor(props) {
		super(props);

		this.dropdownOptions = React.createRef();
		this.focusedOption = React.createRef();
		this.input = React.createRef();
		this.inputContainer = React.createRef();
		this.component = React.createRef();
	}

	state = {
		focused: false,
		/**
		 * selected it used when multi-select is true, otherwise use term.
		 */
		selected: this.props.selected,
		term: this.props.value || '',
	};

	componentDidMount() {
		this.matchOptions();
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleDocumentClick);
	}

	componentDidUpdate() {
		if (this.focusedOption.current) {
			if (
				this.focusedOption.current.offsetTop >
				this.dropdownOptions.current.clientHeight +
					this.dropdownOptions.current.scrollTop -
					rowHeight
			) {
				this.dropdownOptions.current.scrollTop =
					this.focusedOption.current.offsetTop + rowHeight - optionsHeight;
			} else if (this.focusedOption.current.offsetTop < this.dropdownOptions.current.scrollTop) {
				this.dropdownOptions.current.scrollTop = this.focusedOption.current.offsetTop;
			}
		}
	}

	matchOptions = () => {
		let matching = this.props.options.filter(
			option =>
				option.toLowerCase().includes(this.state.term.toLowerCase()) &&
				!this.state.selected.includes(option),
		);

		if (matching.length === 0 && this.state.term.length !== 0) {
			matching = matching.concat(this.state.term);
		}

		const remaining = this.props.options.filter(
			option =>
				!option.toLowerCase().includes(this.state.term.toLowerCase()) &&
				!this.state.selected.includes(option),
		);

		this.setState({
			matching,
			remaining,
			focusedOption: matching[0] || remaining[0],
		});
	};

	handleDocumentClick = event => {
		let node = event.target;

		while (node != null) {
			if (node === this.component.current) {
				return;
			}

			node = node.parentNode;
		}

		document.removeEventListener('click', this.handleDocumentClick);
		this.setState({
			focused: false,
		});
	};

	handleFocus = event => {
		this.setState({
			focused: true,
			focusedOption: this.props.options[0],
		});

		document.addEventListener('click', this.handleDocumentClick);

		this.props.onFocus(event);
	};

	handleBlur = event => {
		this.props.onBlur(event);
	};

	handleUpdateSelection = option => {
		if (this.props.multiple) {
			this.setState(
				({ selected, term }) => ({
					selected: [...selected, option],
					focused: this.props.multiple,
					term: this.props.clearFilter ? '' : term,
				}),
				() => {
					this.matchOptions();
					this.handleKeyDown({ key: 'ArrowDown' });
					this.props.onChange(this.state.selected);
				},
			);
		} else {
			this.input.current.blur();
			this.setState({
				term: option,
				focused: false,
			});
		}
	};

	handleRemoveOption = option => {
		this.setState(
			({ selected }) => ({
				selected: selected.filter(x => x !== option),
				focused: this.props.multiple,
			}),
			() => {
				this.props.onChange(this.state.selected);
			},
		);
	};

	handleChange = event => {
		this.setState(
			{
				term: event.target.value,
			},
			() => this.matchOptions(),
		);

		if (this.props.onInputChange) {
			this.props.onInputChange(event.target.value);
		}
	};

	handleMouseEnter = option => {
		this.setState({
			focusedOption: option,
		});
	};

	handleKeyDown = event => {
		const key = event.key;
		if (key === 'Enter' || (this.props.tokenBreaks && this.props.tokenBreaks.includes(key))) {
			event.preventDefault();
			event.stopPropagation();
			this.handleUpdateSelection(this.state.focusedOption);
		} else if (
			key === 'Backspace' &&
			event.target.value === '' &&
			this.state.selected.length !== 0
		) {
			this.setState(
				({ selected }) => ({
					selected: selected.slice(0, selected.length - 1),
				}),
				() => {
					this.matchOptions();
					this.props.onChange(this.state.selected);
				},
			);
		} else {
			const { matching, remaining, focusedOption } = this.state;
			if (key === 'ArrowDown') {
				if (remaining.slice(-1).includes(focusedOption)) {
					return;
				} else if (matching.slice(-1).includes(focusedOption)) {
					this.setState({
						focusedOption: remaining[0],
					});
				} else if (remaining.includes(focusedOption)) {
					const idx = remaining.indexOf(focusedOption);
					this.setState({
						focusedOption: remaining[idx + 1],
					});
				} else {
					const idx = matching.indexOf(focusedOption);
					this.setState({
						focusedOption: matching[idx + 1],
					});
				}
			}

			if (key === 'ArrowUp') {
				if (remaining[0] === focusedOption) {
					this.setState({
						focusedOption: matching.slice(-1)[0],
					});
				} else if (matching[0] === focusedOption) {
					return;
				} else if (remaining.includes(focusedOption)) {
					const idx = remaining.indexOf(focusedOption);
					this.setState({
						focusedOption: remaining[idx - 1],
					});
				} else {
					const idx = matching.indexOf(focusedOption);
					this.setState({
						focusedOption: matching[idx - 1],
					});
				}
			}
		}
	};

	render() {
		const {
			autocomplete,
			inputClass,
			inputContainerClass,
			optionsClass,
			optionClass,
			placeholder,
		} = this.props;

		const { focused, selected, term, focusedOption, matching, remaining } = this.state;

		return (
			<Styled.Container innerRef={this.component}>
				<Styled.InputContainer className={inputContainerClass || ''} innerRef={this.inputContainer}>
					{selected.length !== 0 &&
						selected.map(option => (
							<Styled.Token key={`selected-${option}`} className={inputClass || ''}>
								{option}
								<Styled.CloseButton onClick={() => this.handleRemoveOption(option)}>
									<Close />
								</Styled.CloseButton>
							</Styled.Token>
						))}
					<Styled.Input
						innerRef={this.input}
						className={inputClass || ''}
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}
						onChange={this.handleChange}
						value={term}
						onKeyDown={this.handleKeyDown}
						autoComplete={autocomplete}
						placeholder={placeholder}
					/>
				</Styled.InputContainer>
				{focused && (
					<Styled.OptionsContainer innerRef={this.dropdownOptions} className={optionsClass || ''}>
						{matching.filter(option => !selected.includes(option)).map(option => (
							<Styled.Option
								onClick={() => this.handleUpdateSelection(option)}
								onMouseEnter={() => this.handleMouseEnter(option)}
								innerRef={option === focusedOption ? this.focusedOption : null}
								key={`matching-${option}`}
								className={optionClass || ''}
								isFocused={option === focusedOption}
							>
								{option}
							</Styled.Option>
						))}
						{remaining.length !== 0 &&
							matching.length !== 0 && (
								<div style={{ width: '100%', height: 2, background: 'blue' }} />
							)}
						{remaining.filter(option => !selected.includes(option)).map(option => (
							<Styled.Option
								onClick={() => this.handleUpdateSelection(option)}
								key={`remaining-${option}`}
								onMouseEnter={() => this.handleMouseEnter(option)}
								innerRef={option === focusedOption ? this.focusedOption : null}
								className={optionClass || ''}
								isFocused={option === focusedOption}
							>
								{option}
							</Styled.Option>
						))}
					</Styled.OptionsContainer>
				)}
			</Styled.Container>
		);
	}
}
