import React, { useEffect, useState }  from 'react';
import ClinicForm from './ClinicForm.js';
import Axios from 'axios';
import DateFnsUtils from '@date-io/date-fns';
import styles from './ClinicForm.module.css';

export default function EditForm(props) {

	const [data, setData] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			await Axios.get(`../api/getClinicData/${props.match.params.clinic}`).then( function(response) {
			setData(response.data);
			setIsLoading(false);
			});
		}
		fetchData();
	}, []);

	if (isLoading) {
		return (<h1>loading</h1>)
	}

	let fillOpenHours = [];
	let fillCloseHours = [];
	for (let i = 0; i < 7; i++) {
		let o = data.rows[i].hour_open.split(/[:]/);
		const openHoursObj = new Date('2014-08-18T00:00:00');
        let h = (parseInt(o[0]) + 17) % 24;
		openHoursObj.setHours(h);
		openHoursObj.setMinutes(o[1]);
		//dateObject.setSeconds(s[2]);
		fillOpenHours[i] = openHoursObj;

		let c = data.rows[i].hour_close.split(/[:]/);
		const closeHoursObj = new Date('2014-08-18T00:00:00');
        h = (parseInt(c[0]) + 17) % 24;
		closeHoursObj.setHours(h);
		closeHoursObj.setMinutes(c[1]);
		fillCloseHours[i] = closeHoursObj;
	}

	let fillServices = [];
	let fillPayment = [];
	let fillLanguage = [];
	for (let i = 0; i < data.services.length; i++) {
		fillServices[i] = data.services[i].services.toString();
	}
	for (let i = 0; i < data.payment.length; i++) {
		fillPayment[i] = data.payment[i].payment.toString();
	}
	for (let i = 0; i < data.language.length; i++) {
		fillLanguage[i] = data.language[i].language.toString();
	}
	
	let info = {
		clinicName: `${props.match.params.clinic}`,
		address: data.rows[0].address,
		city: data.rows[0].city,
		state: data.rows[0].state,
		zip: data.rows[0].zipcode,
		phone: data.rows[0].phone,
		services: fillServices,
		payment: fillPayment,
		lang: fillLanguage,
		openHours: fillOpenHours,
		closeHours: fillCloseHours
	};


	return(
        <div className={styles.root}>		
            <h1>Edit Clinic</h1>
            <text>Successfully made changes.</text>
            <ClinicForm data={info} endpoint={"/edit"}/>
        </div>
	)

}