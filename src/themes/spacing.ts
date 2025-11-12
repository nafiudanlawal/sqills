 const spacingTokens = {
	base: 8,

	scale: {
		0: 0,
		1: 4,
		2: 8,
		3: 12,
		4: 16,
		5: 20,
		6: 24,
		7: 32,
		8: 40,
		9: 48,
		10: 64,
	},

	semantic: {
		none: 0,
		xxs: 2,
		xs: 4,
		sm: 8,
		md: 16,
		lg: 24,
		xl: 32,
		xxl: 48,
	},
};



function spacing(value: number| keyof typeof spacingTokens.semantic) {
	if(typeof value === "number"){
		return `${8 * value}px`;
	}
	return `${8 * spacingTokens.semantic[value]}px`;
};

export default spacing;