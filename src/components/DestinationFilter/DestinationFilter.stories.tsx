import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import DestinationFilter from './DestinationFilter';

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
}, {
	device: 'Laptop',
	brand: 'Apple',
	model: 'MacBook Pro'
}];

type Option = typeof sampleOptions[0];


export default {
	title: 'Components/DestinationFilter',
	component: DestinationFilter,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
	args: { onOriginChange: fn(), onDestinationChange: fn(), size: 'medium', delay: 200, origins: [], destinations: [] },
	argTypes: {
		originGroup: { description: "property of option to group by", control: "select", options: [...Object.keys(sampleOptions[0]), undefined] },
		destinationGroup: { description: "property of option to group by", control: "select", options: [...Object.keys(sampleOptions[0]), undefined] },
		delay: { description: "debounce delay in milliseconds", defaultValue: 200, control:"number" },
		onOriginSearch: { description: "async function to fetch options based on search query" },
		onDestinationSearch: { description: "async function to fetch options based on search query" },
		multiple: { description: "allow multiple selections", control:"boolean" },
		size: { description: "size of the autocomplete input" },

	},
} satisfies Meta<typeof DestinationFilter<Option, Option>>;


type Story = StoryObj<typeof DestinationFilter<Option, Option>>;

export const Default: Story = {
	args: {
		origins: sampleOptions.slice(0, 10),
		destinations: sampleOptions.slice(5),
		originLabel: "model",
		destinationLabel: "model",
		delay: 200,
		label: "model",
		size: 'medium',
	},
};

export const GroupedOptions: Story = {
	args: {
		origins: sampleOptions.slice(0, 10),
		destinations: sampleOptions.slice(5),
		originGroup: "brand",
		destinationGroup: "brand",
		originLabel: "model",
		destinationLabel: "model"
	}
};