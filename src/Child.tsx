import { useCallback, useContext, useState } from 'react';
import AutocompleteSearch from './components/AutocompleteSearch/AutocompleteSearch';
import DestinationFilter from './components/DestinationFilter/DestinationFilter';
import { Container, FormControlLabel, Paper, Stack, Switch } from '@mui/material';
import { sleep } from './utils';
import { ThemeContext } from './themes/context';
import top100Films from './fakeData';

function Child() {

	const handleSearch = useCallback(async (query: string) => {
		console.log("main search")

		await sleep(500);
		const result = top100Films.filter(option => new RegExp(query, "i").test(option.title)).slice(0, 20);
		return result;
	}, [])

	const handleSearchAlt = useCallback(async (query: string) => {
		console.log("alt search")
		await sleep(500);
		const result = top100Films.slice(20).filter(option => new RegExp(query, "i").test(option.title)).slice(0, 20);
		return result;
	}, [])
	const [valueSingle, setValueSingle] = useState(null);
	const [valueMultiple, setValueMultiple] = useState([]);

	const onChange = useCallback((_event: any, value: any) => {
		setValueSingle(value);
	}, [])
	const onChangeM = useCallback((_event: any, value: any) => {
		setValueMultiple(value);
	}, [])

	const { mode, changeMode } = useContext(ThemeContext);

	return (
		<div>
			<Paper variant='outlined' sx={{ width: "100%", height: 100, mb: 3, "& h4": { textAlign: "center", mb:1} }}>
				<h4>Theme Modes</h4>
				<FormControlLabel label="Theme Mode" control={<Switch value={mode == "light"} onChange={evt => changeMode(evt.target.checked ? "dark" : "light")} />} />
			</Paper>
			<Stack direction={"row"} spacing={1}>
				<Stack direction={"column"} alignContent={"start"} justifyContent={"start"}>
					<Paper variant='outlined' sx={{ p: 3, "& p": { textAlign: "start", pl: 1 } }}>
						<h2>Autocomplete Search</h2>
						<Container>
							<p>Default</p>
							<AutocompleteSearch value={valueSingle} onChange={onChange} options={top100Films} label={"title"} />
						</Container>
						<Container>
							<p>onSearch</p>
							<AutocompleteSearch value={valueSingle} onChange={onChange} options={top100Films} onSearch={handleSearch} label={"title"} delay={400} textfieldProps={{ placeholder: "Title", label: "OnSearch" }} />
						</Container>
						<Container>
							<p>Grouped</p>
							<AutocompleteSearch value={valueSingle} onChange={onChange} options={top100Films} label={"title"} group={"genre"} textfieldProps={{ placeholder: "Title", label: "Grouped" }} />
						</Container>
						<Container>
							<p>Virtualized</p>
							<AutocompleteSearch value={valueSingle} onChange={onChange} options={top100Films} label={"title"} virtualize textfieldProps={{ placeholder: "Title", label: "Virstualized" }} />
						</Container>
					</Paper>
				</Stack>
				<Stack direction={"column"} alignContent={"start"} justifyContent={"start"}>
					<Paper variant='outlined' sx={{ p: 3, "& h4": { textAlign: "start", pl: 1 } }}>
						<h2>Destination Filter</h2>
						<Container sx={{ mb: 2 }}>
							<h4>Default</h4>
							<DestinationFilter origins={top100Films.slice(0, 9)} destinations={top100Films.slice(13, 25)} originLabel='title' destinationLabel='title' />
						</Container>
						<Container sx={{ mb: 2, "& h4": { textAlign: "center" } }}>
							<h4>OnSearch</h4>
							<DestinationFilter value={valueMultiple} onOriginChange={onChangeM} origins={[]} onOriginSearch={handleSearch} onDestinationSearch={handleSearchAlt} destinations={[]} originLabel='title' destinationLabel='title' />
						</Container>
						<Container sx={{ mb: 2, "& h4": { textAlign: "center" } }}>
							<h4>Vertical</h4>
							<DestinationFilter value={valueMultiple} onOriginChange={onChangeM} orientation='vertical' origins={top100Films.slice(0, 10)} destinations={top100Films.slice(20, 40)} originLabel='title' destinationLabel='title' />
						</Container>
					</Paper>
				</Stack>
			</Stack>
		</div>

	)
}

export default Child
