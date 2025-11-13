import { FormControlLabel, Stack, Switch } from '@mui/material'
import { useEffect, useState, type SyntheticEvent } from 'react'
import { AutocompleteSearch } from '../AutocompleteSearch';
import type { DestinationFilterProps } from './types';



export default function DestinationFilter<OriginOption, DestinationOption>({
	delay = 200,
	destinationLabel,
	originLabel,
	spacing = 2,
	orientation = 'horizontal',
	multiple = true,
	onOriginChange,
	onDestinationChange,
	onOriginSearch,
	onDestinationSearch,
	onSwitchChange,
	containerSx = {
		alignItems: "center",
		justifyContent: "center",
	},
	destinationTextfieldProps = {
		placeholder: "Destination",
		label: "Destination",
		title: "Destination"
	},
	originTextfieldProps = {
		placeholder: "Origin",
		label: "Origin",
		title: "Origin"
	},
	originId = originLabel as string,
	destinationId = destinationLabel as string,
	origins,
	destinations,
	originGroup,
	destinationGroup,
	...otherProps
}: DestinationFilterProps<OriginOption, DestinationOption>) {

	const [mirror, setMirror] = useState<boolean>(false);
	const [originValue, setOriginValue] = useState<OriginOption[] | undefined>([]);
	const [destinationValue, setDestinationValue] = useState<DestinationOption[] | undefined>([]);
	const [destinationOptions, setDestinationOptions] = useState<DestinationOption[]>(destinations)

	const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			setDestinationOptions(origins as unknown as DestinationOption[]);
			setDestinationValue([]);
		} else {
			setDestinationOptions(destinations);
			setDestinationValue([]);
		}
		if (onSwitchChange) {
			onSwitchChange(event);
		}
		setMirror(event.target.checked);
	};
	const normalizedSearch = async (query: string) => {
		console.log("normalize search")
		if (onOriginSearch) {
			const result = onOriginSearch(query);
			return result as unknown as Promise<DestinationOption[]>
		}
		return [];
	}
	const onOriginChangeInternal = (event: SyntheticEvent, value: OriginOption | OriginOption[] | null) => {
		if (onOriginChange) {
			onOriginChange(event, value);
		}
		setOriginValue(value as OriginOption[]);
	}

	const onDestinationChangeInternal = (event: SyntheticEvent, value: DestinationOption | DestinationOption[] | null) => {
		console.log("Destination changed:", value);
		if (onDestinationChange) {
			onDestinationChange(event, value);
		}
		setDestinationValue(value as DestinationOption[]);
	}
	useEffect(() => {
		if (mirror) {
			setDestinationOptions(origins as unknown as DestinationOption[])
		}
	}, [mirror])

	console.log("mirror destination", destinationOptions)
	return (
		<Stack sx={containerSx} spacing={spacing} direction={orientation === 'horizontal' ? 'row' : 'column'}>
			<AutocompleteSearch
				{...otherProps}
				id={`origin-autocomplete${originId}`}
				multiple={multiple}
				options={origins}
				onSearch={onOriginSearch}
				onChange={onOriginChangeInternal}
				value={originValue}
				label={originLabel}
				group={originGroup}
				textfieldProps={originTextfieldProps}
				delay={delay}
			/>
			<AutocompleteSearch
				{...otherProps}
				id={`destination-autocomplete${destinationId}`}
				multiple
				options={destinationOptions}
				onSearch={mirror && onDestinationSearch ? normalizedSearch : onDestinationSearch}
				label={destinationLabel}
				group={destinationGroup}
				onChange={onDestinationChangeInternal}
				value={destinationValue}
				textfieldProps={destinationTextfieldProps}
				delay={delay}
			/>
			<FormControlLabel
				control={<Switch checked={mirror} onChange={handleSwitchChange} slotProps={{ input: { 'aria-label': 'controlled' } }} />}
				label="Mirror"
			/>
		</Stack>
	)
}
