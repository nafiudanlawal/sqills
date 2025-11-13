import type { SxProps, TextFieldProps } from "@mui/material";
import type { SyntheticEvent } from "react";
import type { AutocompleteSearchProps } from "../AutocompleteSearch";

export interface DestinationFilterProps<OriginOption, DestinationOption> extends Omit<AutocompleteSearchProps<OriginOption>, 'onChange' | 'multiple' | 'options' | 'group' | 'onSearch' | 'label'> {
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
	originTextfieldProps?: TextFieldProps,
	destinationTextfieldProps?: TextFieldProps,
	onOriginSearch?: (query: string) => Promise<OriginOption[]>,
	onDestinationSearch?: (query: string) => Promise<DestinationOption[]>,
	onOriginChange?: (event: SyntheticEvent, value: OriginOption | OriginOption[] | null) => void,
	onDestinationChange?: (event: SyntheticEvent, value: DestinationOption | DestinationOption[] | null) => void,
	onSwitchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
}