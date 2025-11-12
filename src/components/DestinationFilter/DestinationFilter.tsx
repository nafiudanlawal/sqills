import { FormControlLabel, Stack, Switch, type SxProps } from '@mui/material'
import type { AutocompleteSearchProps } from '../AutocompleteSearch/AutocompleteSearch'
import AutocompleteSearch from '../AutocompleteSearch/AutocompleteSearch'
import { useState, type SyntheticEvent } from 'react'


interface IDestinationProps<OriginOption, DestinationOption> extends Omit<AutocompleteSearchProps<OriginOption>, 'onChange' | 'multiple' | 'options' | 'group' | 'onSearch'> {
	originLabel: keyof OriginOption,
	originGroup?: keyof OriginOption,
	destinationLabel: keyof DestinationOption,
	destinationGroup?: keyof DestinationOption,
	orientation?: 'horizontal' | 'vertical',
	spacing?: number,
	containerSx?: SxProps,
	multiple?: boolean,
	origins: OriginOption[],
	destinations: DestinationOption[],
	originId?: string,
	destinationId?: string,
	onOriginSearch?: (query: string) => Promise<OriginOption[]>,
	onDestinationSearch?: (query: string) => Promise<DestinationOption[]>,
	onOriginChange?: (event: SyntheticEvent, value: OriginOption | OriginOption[] | null) => void,
	onDestinationChange?: (event: SyntheticEvent, value: DestinationOption | DestinationOption[] | null) => void,
}


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
	containerSx = {
		alignItems: "center",
		justifyContent: "center",
	},
	originId = originLabel as string,
	destinationId = destinationLabel as string,
	origins,
	destinations,
	originGroup,
	destinationGroup,
	...otherProps
}: IDestinationProps<OriginOption, DestinationOption>) {

	const [mirror, setMirror] = useState<boolean>(false);
	const [originValue, setOriginValue] = useState<OriginOption[] | undefined>();
	const [destinationValue, setDestinationValue] = useState<DestinationOption[] | undefined>();
	const [destinationOptions, setDestinationOptions] = useState<DestinationOption[]>(destinations)

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			setDestinationOptions(origins as unknown as DestinationOption[]);
			setDestinationValue([]);
		} else {
			setDestinationOptions(destinations);
			setDestinationValue([]);
		}
		setMirror(event.target.checked);
	};
	const normalizedSearch = async (query: string) => {
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
				label={originLabel as keyof OriginOption}
				group={originGroup}
				textfieldProps={{
					placeholder: "Origin",
					label: "Origin",
					title: "Origin"
				}}
				delay={delay}
			/>
			<AutocompleteSearch
				id={`destination-autocomplete${destinationId}`}
				multiple
				options={destinationOptions}
				onSearch={mirror ? normalizedSearch : onDestinationSearch}
				label={destinationLabel as keyof DestinationOption}
				group={destinationGroup}
				onChange={onDestinationChangeInternal}
				value={destinationValue}
				textfieldProps={{
					placeholder: "Destination",
					label: "Destination",
					title: "Destination"
				}}
				delay={delay}
			/>
			<FormControlLabel
				control={<Switch checked={mirror} onChange={handleChange} slotProps={{ input: { 'aria-label': 'controlled' } }} />}
				label="Mirror"
			/>
		</Stack>
	)
}
