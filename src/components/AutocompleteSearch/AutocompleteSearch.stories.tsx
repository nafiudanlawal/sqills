import type { Meta, StoryObj } from '@storybook/react-vite';

import AutocompleteSearch from './AutocompleteSearch';
import { fn, within } from 'storybook/test';
import { sleep } from '../../utils';

const sampleOptions = [{
	device: 'Mobile',
	brand: 'Apple',
	model: 'iPhone 13',
}, {
	device: 'Laptop',
	brand: 'Dell',
	model: 'XPS 15',
}, {
	device: 'Tablet',
	brand: 'Samsung',
	model: 'Galaxy Tab S7',
}, {
	device: 'Smartwatch',
	brand: 'Apple',
	model: 'Watch Series 6',
}, {
	device: 'Desktop',
	brand: 'HP',
	model: 'Pavilion',
}, {
	device: 'Camera',
	brand: 'Canon',
	model: 'EOS R5',
}, {
	device: 'Headphones',
	brand: 'Sony',
	model: 'WH-1000XM4',
}, {
	device: 'Speaker',
	brand: 'Bose',
	model: 'SoundLink Revolve',
}, {
	device: 'Mobile',
	brand: 'Apple',
	model: 'iPhone 12',
}];

type Option = typeof sampleOptions[0];
const searchFunc = async (query: string) => { // simulate async loading func
	await sleep(500);
	const result = sampleOptions.filter(option => new RegExp(query, "i").test(option.model)).slice(0, 20);
	return result;
}

export default {
	title: 'Components/AutoCompleteSearch',
	component: AutocompleteSearch,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
	args: { onChange: fn(), size: 'medium', delay: 200, options: [] },
	argTypes: {
		options: { description: "array of options to display" },
		label: { description: "property of option to display as label", control: "select", options: Object.keys(sampleOptions[0]) },
		onChange: { description: "handles change event", action: 'changed' },
		group: { description: "property of option to group by", control: "select", options: [...Object.keys(sampleOptions[0]), undefined] },
		delay: { description: "debounce delay in milliseconds", defaultValue: 200, control: "number" },
		onSearch: { description: "async function to fetch options based on search query" },
		multiple: { description: "allow multiple selections", control: "boolean" },
		size: { description: "size of the autocomplete input", control: "radio", options: ["small", "medium"] },

	},
} satisfies Meta<typeof AutocompleteSearch<Option>>;


type Story = StoryObj<typeof AutocompleteSearch<Option>>;

export const Default: Story = {
	args: {
		options: sampleOptions.slice(0, 10),
		delay: 200,
		label: "model",
		size: 'medium',
	},
};

export const MultipleSelection: Story = {
	args: {
		options: sampleOptions.slice(0, 10),
		delay: 200,
		multiple: true as false,
		label: "model"
	}
};

export const GroupedOptions: Story = {
	args: {
		options: sampleOptions,
		group: "brand",
		label: "model"
	}
};

export const onSearch: Story = {
	args: {
		delay: 200,
		label: "model",
		size: 'medium',
		onSearch: searchFunc
	},
};

const fieldId = "random-id"
export const HighlightMatching: Story = {
	args: {
		options: sampleOptions,
		id: fieldId,
		label: "model",
	},
	play: async ({ canvasElement, userEvent }) => {
		const canvas = within(canvasElement);
		const textfield = canvas.getByTestId(`autocomplete-${fieldId}`);
		await userEvent.click(textfield);
		userEvent.type(textfield, "ipho")
	}
};

export const Virtualized: Story = {
	args: {
		options: sampleOptions,
		label: "model",
		virtualize: true
	}
};