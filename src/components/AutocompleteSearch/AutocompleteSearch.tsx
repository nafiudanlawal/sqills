import { Autocomplete, debounce, TextField, type AutocompleteRenderGroupParams, type AutocompleteRenderInputParams, type AutocompleteRenderOptionState, type AutocompleteValue, type TextFieldProps } from "@mui/material"
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { styled, lighten, darken } from "@mui/system";
import { useCallback, useEffect, useMemo, useState, type KeyboardEvent, type ReactNode, type SyntheticEvent } from "react";


export type AutocompleteSearchProps<Option, Multiple extends boolean | undefined = false> = {
	options: Option[],
	label: keyof Option,
	delay?: number,
	group?: keyof Option,
	multiple?: Multiple,
	textfieldProps?: TextFieldProps,
	value?: Option | Option[] | null,
	size?: 'small' | 'medium',
	id?: string,
	onSearch?: (query: string) => Promise<Option[]>,
	onChange?: (event: SyntheticEvent, value: AutocompleteValue<Option, Multiple, false, false>) => void
}

const GroupHeader = styled("div")(({ theme }) => ({
	position: 'sticky',
	top: '-8px',
	padding: '4px 10px',
	color: theme.palette.primary.main,
	backgroundColor: lighten(theme.palette.primary.light, 0.85),
	...theme.applyStyles('dark', {
		backgroundColor: darken(theme.palette.primary.main, 0.8),
	}),
}));

const GroupItems = styled("ul")({
	padding: 0,
});

function AutocompleteSearch<Option, Multiple extends boolean | undefined = false>({
	label,
	options,
	group,
	textfieldProps = {
		label: label as string
	},
	value,
	multiple = false,
	size = 'medium',
	id = label as string,
	delay = 200,
	onChange,
	onSearch,
}: AutocompleteSearchProps<Option, Multiple>): ReactNode {
	const [open, setOpen] = useState(false);
	const [selectOptions, setSelectOptions] = useState<Option[]>(options);
	const [loading, setLoading] = useState(false);

	const [valueSingle, setValueSingle] = useState<Option | null>(value as Option | null);
	const [valueMultiple, setValueMultiple] = useState<Option[]>((value as Option[]) || []);

	const [textfieldValue, setTextfieldValue] = useState("");


	const internalValue: AutocompleteValue<Option, Multiple, false, false> = multiple
		? (valueMultiple as AutocompleteValue<Option, Multiple, false, false>)
		: (valueSingle as AutocompleteValue<Option, Multiple, false, false>);
	const handleOptionChange = useCallback((_event: SyntheticEvent, newOption: AutocompleteValue<Option, Multiple, false, false>) => {
		if (multiple) {
			setValueMultiple(newOption as Option[]);
		} else {
			setValueSingle(newOption as Option | null);
		}
		setTextfieldValue("");
		if(onChange) {
			onChange(_event, newOption);
		}
	}, [multiple, onChange])

	const handleTextFieldChange = useCallback((_evt: SyntheticEvent, newValue: string, reason?: string) => {
		if (multiple && reason === "reset") return;
		setTextfieldValue(newValue);
	}, [multiple])

	const searchHandler = useMemo(() => debounce(async (query: string) => {
		if (!onSearch) return;
		setLoading(true);
		const results = await onSearch(query);
		setSelectOptions(results || []);
		setLoading(false);
	}, delay), [delay, onSearch]);

	const props = {
		multiple: multiple as Multiple,
		filterOptions: onSearch ? (x: Option[]) => x : undefined,
		open,
		loading,
		loadingText: "loading...",
		onOpen: () => setOpen(true),
		onClose: () => setOpen(false),
		sx: { width: 300 },
		options: group ? selectOptions.sort((a, b) => -String(b[group]).localeCompare(String(a[group]))) : selectOptions,
		onKeyDown: (evt: KeyboardEvent) => {
			if (!open && evt.key == "Escape") {
				setTextfieldValue("");
				if (multiple) {
					setValueMultiple([]);
				} else {
					setValueSingle(null);
				}
			}
		},

		noOptionsText: `${textfieldValue} not found`,
		value: internalValue,
		inputValue: textfieldValue,
		onChange: handleOptionChange,
		onInputChange: handleTextFieldChange,
		autoComplete: true,
		getOptionLabel: (option: Option) => String(option[label]),
		id: id,
		"data-testid": `autocomplete-${id}`,
		renderInput: (params: AutocompleteRenderInputParams) => (
			<TextField {...params} {...textfieldProps} data-testid={`textfield-${id}`} id={`textfield-${id}`} />
		),
		renderGroup: (params: AutocompleteRenderGroupParams) => (
			<li key={params.key}>
				<GroupHeader>{params.group}</GroupHeader>
				<GroupItems>{params.children}</GroupItems>
			</li>
		),
		renderOption: (props: React.HTMLAttributes<HTMLLIElement> & { key: string | number }, option: Option, { inputValue }: AutocompleteRenderOptionState) => {
			const { key, ...optionProps } = props;

			const matches = match(option[label], inputValue, { insideWords: true });
			const parts: {
				text: string,
				highlight: boolean
			}[] = parse(option[label], matches);
			return (
				<li key={key} {...optionProps}>
					<div>
						{parts.map((part, index) => (
							<span
								key={index}
								style={{
									fontWeight: part.highlight ? 700 : 400,
									color: part.highlight ? "#9003ad" : "inherit"
								}}
							>
								{part.text}
							</span>
						))}
					</div>
				</li>
			);
		},
		groupBy: group ? (option: Option) => String(option[group]).toUpperCase() : undefined,
		size: size

	}

	useEffect(() => {
		searchHandler(textfieldValue);

		return () => {
			searchHandler.clear();
		};
	}, [searchHandler, textfieldValue, value, options]);

	return <Autocomplete {...props} />
}

export default AutocompleteSearch
