import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import MapBox  from './Map/Map.js';
import ResultList from './Results/ResultList.js';
import SearchInput from '../Shared/SearchInput.js';
import FilterList from './Filters/FilterList.js';
import FilterModal from './Filters/FilterModal.js';
import Logo from '../Shared/Logo.js';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import './styles.css';

export default function App (props) {
	const [rows, setRows] = useState([]);
	const [geocoord, setGeocoord] = useState([0, 0]);
	const [address, setAddress] = useState(props.match.params.address);
	const [filters, setFilters] = useState({Treatment: [], Insurance: [], Language: []});
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [currentFilter, setCurrentFilter] = useState("");
	const [visibleBox, setVisibleBox] = useState(-1);
	const [loading, setIsLoading] = useState(true);
	const [distance, setDistance] = useState(10);

	
	useEffect(() => {
		async function fetchData() {
			const result = await Axios.get(`../api/searchClinics/address=${props.match.params.address}&distance=${distance}`).then( function(response) {
				setRows(response.data.rows);
				setGeocoord([...response.data.geocoord]);
				setIsLoading(false);
				setAddress(response.data.address);
			});
		}
		fetchData();
	}, []);

	const onOpenModal = (filterType) => () => {
		setDialogOpen(true);
		setCurrentFilter(filterType);
	}

	const onClose = (e) => {
		setDialogOpen(false);
	}

	const visibleInfoBox = (k) => {
		setVisibleBox(k);
	}
		
	const deactivateInfoBox = (k) => {
		setVisibleBox(-1);
	}


	const handleSubmit = (data) => {
		setIsLoading(true);
		Axios.get(`../api/searchClinics/address=${data.address}&distance=${distance}`).then( function(response) {
			setRows(response.data.rows);
			setGeocoord([...response.data.geocoord]);
			setAddress(response.data.address);
			setIsLoading(false);
		});
	}


	const filterClinic = (event) => {
		setIsLoading(true);
		let cloneFilters = {...filters};
		const category = event.target.id;
		let filter = cloneFilters[category];

		if (event.target.checked) {
			filter.push(event.target.value);	
		}

		else {
			let i = filter.indexOf(event.target.value);
			filter.splice(i, 1)
		}

		let filterData = {
			filter: cloneFilters,
			geocoord: geocoord,
			distance: distance,
		}

		
  		Axios.post('/api/filterClinics', filterData).then( function(response) {
			setRows(response.data.rows);
			setFilters(cloneFilters);
			setIsLoading(false);
		});

	}

	const changeDistance = (event, value) => {
		console.log(value);
		setDistance(value);
		setIsLoading(true);
		Axios.get(`../api/searchClinics/address=${props.match.params.address}&distance=${value}`).then( function(response) {
				setRows(response.data.rows);
				setIsLoading(false);
			});

	}
	const singularFilter = (filterName, filter) => {
		let cloneFilters = {...filters};
		cloneFilters[filterName] = filter;

		let filterData = {
			filter: cloneFilters,
			geocoord: geocoord,
			distance: distance,
		}

		  Axios.post('/api/filterClinics', filterData).then( function(response) {
			setFilters(cloneFilters);
			setDialogOpen(false);
			setRows(response.data.rows);
		});
	}


	

        return (
            <div className = {styles.container}>
                <div className = {styles.header}>
                	<Logo name={styles.searchLogo} />
                    <SearchInput handleSubmit = {handleSubmit}/>
                </div>

                <div className = {styles.body}>
					
					{/*** modal for filters ***/}
					<FilterModal 
						name={currentFilter} 
						isOpen = {isDialogOpen} 
						onClose = {onClose} 
						onSubmit = {singularFilter}
					/>

                	<FilterList 
	                	onChange = {filterClinic} 
	                	openModal = {onOpenModal} 
	                	isOpen = {isDialogOpen} 
	                	distance = {distance}
	                	onDistanceChange = {changeDistance}
                	/>

                    <ResultList 
	                    rows={rows} 
	                    enableVisibility={visibleInfoBox} 
	                    disableVisibility={deactivateInfoBox} 
	                    address={address}
	                    isLoading={loading}
                    />

                    <MapBox 
	                    rows={rows} 
	                    center = {geocoord} 
	                    cn = {styles.mapBox}
                    /> 
                </div>
            </div>
        );
}




