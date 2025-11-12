import {
	Autocomplete,
	debounce,
	TextField,
	Typography,
	useMediaQuery,
	type AutocompleteProps,
	type AutocompleteRenderGroupParams,
	type AutocompleteRenderInputParams,
	type AutocompleteRenderOptionState,
	type AutocompleteValue,
	type TextFieldProps
} from "@mui/material"
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { styled, lighten, darken } from "@mui/system";
import * as React from 'react';
//import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode, type SyntheticEvent } from "react";
import {
	List,
	useListRef,
	type RowComponentProps,
	type ListImperativeAPI,
} from 'react-window';

import { useTheme } from "@mui/material/styles";

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
	virtualize?: boolean,
	onSearch?: (query: string) => Promise<Option[]>,
	onChange?: (event: React.SyntheticEvent, value: AutocompleteValue<Option, Multiple, false, false>) => void
}

const GroupHeader = styled("div")(({ theme }) => ({
	position: 'sticky',
	top: '-8px',
	padding: '10px',
	color: theme.palette.primary.main,
	backgroundColor: lighten(theme.palette.primary.light, 0.85),
	...theme.applyStyles('dark', {
		backgroundColor: darken(theme.palette.primary.main, 0.8),
	}),
}));

const GroupItems = styled("ul")({
	padding: 0,
});

type ItemData = Array<
	| {
		key: number;
		group: string;
		children: React.ReactNode;
	}
	| [React.ReactElement, string, number]
>;
const LISTBOX_PADDING = 8; // px
function RowComponent({
	index,
	itemData,
	style,
}: RowComponentProps & {
	itemData: ItemData;
}) {
	const dataSet = itemData[index];
	const inlineStyle = {
		...style,
		top: ((style.top as number) ?? 0) + LISTBOX_PADDING,
	};

	if ('group' in dataSet) {
		return (
			<GroupHeader key={dataSet.key} style={inlineStyle}>
				{dataSet.group}
			</GroupHeader>
		);
	}

	const { key, ...optionProps } = dataSet[0];
	return (
		<Typography key={key} component="li" {...optionProps} noWrap style={inlineStyle}>
			{dataSet[0].key}
		</Typography>
	);
}
const ListboxComponent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLElement> & {
		internalListRef: React.Ref<ListImperativeAPI>;
		onItemsBuilt: (optionIndexMap: Map<string, number>) => void;
	}
>(function ListboxComponent(props, ref) {
	const { children, internalListRef, onItemsBuilt, ...other } = props;
	const itemData: ItemData = [];
	const optionIndexMap = React.useMemo(() => new Map<string, number>(), []);

	(children as ItemData).forEach((item) => {
		itemData.push(item);
		if ('children' in item && Array.isArray(item.children)) {
			itemData.push(...item.children);
		}
	});

	// Map option values to their indices in the flattened array
	itemData.forEach((item, index) => {
		if (Array.isArray(item) && item[1]) {
			optionIndexMap.set(item[1], index);
		}
	});

	React.useEffect(() => {
		if (onItemsBuilt) {
			onItemsBuilt(optionIndexMap);
		}
	}, [onItemsBuilt, optionIndexMap]);

	const theme = useTheme();
	const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
		noSsr: true,
	});
	const itemCount = itemData.length;
	const itemSize = smUp ? 36 : 48;

	const getChildSize = (child: ItemData[number]) => {
		if (Object.prototype.hasOwnProperty.call(child, 'group')) {
			return 48;
		}
		return itemSize;
	};

	const getHeight = () => {
		if (itemCount > 8) {
			return 8 * itemSize;
		}
		return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
	};

	// Separate className for List, other props for wrapper div (ARIA, handlers)
	const { className, style, ...otherProps } = other;

	return (
		<div ref={ref} {...otherProps}>
			<List
				className={className}
				listRef={internalListRef}
				key={itemCount}
				rowCount={itemCount}
				rowHeight={(index) => getChildSize(itemData[index])}
				rowComponent={RowComponent}
				rowProps={{ itemData }}
				style={{
					height: getHeight() + 2 * LISTBOX_PADDING,
					width: '100%',
					...style,
				}}
				overscanCount={5}
				tagName="ul"
			/>
		</div>
	);
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
	virtualize = false,
	size = 'medium',
	id = label as string,
	delay = 200,
	onChange,
	onSearch,
}: AutocompleteSearchProps<Option, Multiple>): React.ReactNode {
	const [open, setOpen] = React.useState(false);
	const [selectOptions, setSelectOptions] = React.useState<Option[]>(!onSearch ? options : []);
	const [loading, setLoading] = React.useState(false);

	const [valueSingle, setValueSingle] = React.useState<Option | null>(!multiple ? value as Option : null);
	const [valueMultiple, setValueMultiple] = React.useState<Option[]>(multiple ? value as Option[] : []);

	const [textfieldValue, setTextfieldValue] = React.useState("");

	const internalListRef = useListRef(null);
	const optionIndexMapRef = React.useRef<Map<string, number>>(new Map());

	const internalValue: AutocompleteValue<Option, Multiple, false, false> = multiple
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
		return () => {
			searchHandler.clear();
		};
	}, [searchHandler, textfieldValue]);

	return <Autocomplete {...props} />;
}

export default AutocompleteSearch
