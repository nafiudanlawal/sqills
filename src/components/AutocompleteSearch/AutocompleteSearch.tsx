import {
	Autocomplete,
	debounce,
	TextField,
	type AutocompleteProps,
	type AutocompleteRenderGroupParams,
	type AutocompleteRenderInputParams,
	type AutocompleteRenderOptionState,
	type AutocompleteValue,
} from "@mui/material"
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import * as React from 'react';
import {
	useListRef
} from 'react-window';
import { GroupHeader, GroupItems, ListboxComponent } from "./Virtualization";
import type { AutocompleteSearchProps } from "./types";


function AutocompleteSearch<Option, Multiple extends boolean | undefined = false>({
	label,
	options,
	group,
	textfieldProps = {
		label: label as string
	},
	value,
	multiple = false,
	virtualize = false,
	size = 'medium',
	id = label as string,
	delay = 200,
	onChange,
	onSearch,
	...otherProps
}: AutocompleteSearchProps<Option, Multiple>): React.ReactNode {
	const [open, setOpen] = React.useState(false);
	const [selectOptions, setSelectOptions] = React.useState<Option[]>(!onSearch ? options : []);
	const [loading, setLoading] = React.useState(false);

	const [valueSingle, setValueSingle] = React.useState<Option | null>(!multiple ? value as Option : null);
	const [valueMultiple, setValueMultiple] = React.useState<Option[]>(multiple ? value as Option[] : []);

	const [textfieldValue, setTextfieldValue] = React.useState("");

	const internalListRef = useListRef(null);
	const optionIndexMapRef = React.useRef<Map<string, number>>(new Map());

	let internalValue: AutocompleteValue<Option, Multiple, false, false> = multiple
		? (valueMultiple as AutocompleteValue<Option, Multiple, false, false>)
		: (valueSingle as AutocompleteValue<Option, Multiple, false, false>);

	const handleItemsBuilt = React.useCallback(
		(optionIndexMap: Map<string, number>) => {
			optionIndexMapRef.current = optionIndexMap;
		},
		[],
	);

	const handleOptionChange = React.useCallback((_event: React.SyntheticEvent, newOption: AutocompleteValue<Option, Multiple, false, false>) => {
		if (multiple) {
			setValueMultiple(newOption as Option[]);
		} else {
			setValueSingle(newOption as Option | null);
		}
		setTextfieldValue("");
		if (onChange) {
			onChange(_event, newOption);
		}
	}, [multiple, onChange])

	const handleTextFieldChange = React.useCallback((_evt: React.SyntheticEvent, newValue: string, reason?: string) => {
		if (multiple && reason === "reset") return;
		setTextfieldValue(newValue);
	}, [multiple])

	const searchHandler = React.useMemo(() => debounce(async (query: string) => {
		if (!onSearch) return;
		setLoading(true);
		const results = await onSearch(query);
		setSelectOptions(results || []);
		setLoading(false);
	}, delay), [delay, onSearch]);

	const handleHighlightChange = (
		_event: React.SyntheticEvent,
		option: Option | null
	) => {
		if (option && internalListRef.current) {
			const index = optionIndexMapRef.current.get(option as string);
			if (index !== undefined) {
				internalListRef.current.scrollToRow({ index, align: 'auto' });
			}
		}
	};
	let props: AutocompleteProps<Option, Multiple, false, false> & { "data-testid": string } = {
		multiple: multiple as Multiple,
		filterOptions: onSearch ? (x: Option[]) => x : undefined,
		open,
		loading,
		loadingText: "loading...",
		onOpen: () => setOpen(true),
		onClose: () => setOpen(false),
		sx: { width: 300 },
		options: group ? [...selectOptions].sort((a, b) => -String(b[group]).localeCompare(String(a[group]))) : selectOptions,
		onKeyDown: (evt: React.KeyboardEvent) => {
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

	if (virtualize) {
		props = {
			...props,
			renderOption: (props, option, state) => [props, option, state.index] as React.ReactNode,
			renderGroup: (params) => params as unknown as React.ReactNode,
			onHighlightChange: handleHighlightChange,
			slotProps: {
				listbox: {
					component: ListboxComponent,
					internalListRef,
					onItemsBuilt: handleItemsBuilt,
				} as never,
			}
		}

	}
	React.useEffect(() => {
		searchHandler(textfieldValue);
		setSelectOptions(options);
		if (multiple) {
			setValueMultiple(value as Option[])
		} else {
			setValueSingle(value as Option)
		}

		return () => {
			searchHandler.clear();
		};
	}, [searchHandler, textfieldValue, options]);

	return <Autocomplete {...otherProps} {...props} />;
}

export default AutocompleteSearch
