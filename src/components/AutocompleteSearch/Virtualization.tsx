import { Typography, useMediaQuery } from "@mui/material";
import { styled, lighten, darken } from "@mui/system";
import {
	List,
	type RowComponentProps,
	type ListImperativeAPI,
} from 'react-window';

import { useTheme } from "@mui/material/styles";
import React from "react";

export type ItemData = Array<
	| {
		key: number;
		group: string;
		children: React.ReactNode;
	}
	| [React.ReactElement, string, number]
>;
const LISTBOX_PADDING = 8; // px

export const GroupHeader = styled("div")(({ theme }) => ({
	position: 'sticky',
	top: '-8px',
	padding: '10px',
	color: theme.palette.primary.main,
	backgroundColor: lighten(theme.palette.primary.light, 0.85),
	...theme.applyStyles('dark', {
		backgroundColor: darken(theme.palette.primary.main, 0.8),
	}),
}));

export const GroupItems = styled("ul")({
	padding: 0,
});


export function RowComponent({
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
export const ListboxComponent = React.forwardRef<
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