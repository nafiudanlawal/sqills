import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { sleep } from '../../utils';
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
const searchFunc1 = async (query: string) => { // simulate async loading func
	await sleep(500);
	return sampleOptions.filter(option => new RegExp(query, "i").test(option.model)).slice(0, 10);

}

const searchFunc2 = async (query: string) => { // simulate async loading func
	await sleep(500);
	return sampleOptions.filter(option => new RegExp(query, "i").test(option.model)).slice(5, 18);
}

export default {
	title: 'Components/DestinationFilter',
	component: DestinationFilter,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
	args: { onOriginChange: fn(), onDestinationChange: fn(), onSwitchChange: fn(), size: 'medium', delay: 200, origins: [], destinations: [] },
	argTypes: {
		originGroup: { description: "Property of option to group by", control: "select", options: Object.keys(sampleOptions[0]) },
		destinationGroup: { description: "Property of option to group by", control: "select", options: Object.keys(sampleOptions[0]) },
		delay: { description: "Delay search handler in milliseconds", defaultValue: 200, control: "number" },
		onOriginSearch: { description: "Fetch options based on search query" },
		onDestinationSearch: { description: "Fetch options based on search query" },
		multiple: { description: "Allow multiple selections", control: "boolean" },
		size: { description: "Size of the autocomplete input", control: "radio", options: ["small", "medium"] },

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
		size: 'medium',
	},
};

export const GroupedOptions: Story = {
	...Default,
	args: {
		...Default.args,
		originGroup: "brand",
		destinationGroup: "brand",
	},
	
};

export const OnSearch: Story = {
	...Default,
	args: {
		...Default.args,
		origins: [],
		destinations: [],
		onOriginSearch: searchFunc1,
		onDestinationSearch: searchFunc2,
	},
};