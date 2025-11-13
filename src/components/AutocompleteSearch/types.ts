import type { AutocompleteValue, TextFieldProps } from "@mui/material"

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