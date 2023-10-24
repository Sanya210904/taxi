//@ts-nocheck
import { MenuItem, TextField, Select, Button, Modal } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import classes from './Order.module.css';
import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import { customerColumn } from '../../constants/customerColumn';
import { carOrderColumn } from '../../constants/carOrderColumn';
import axios from 'axios';
import successImage from '../../assets/success.png';

const API_KEY = 'AIzaSyD5WsiSLcKkw9otby_Io3HdmRT0P5jmTCo';
const center = { lat: 46.482952, lng: 30.712481 };

const Order = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [addressDeparture, setAddressDeparture] = useState();
  const [addressArrival, setAddressArrival] = useState();
  const [classSelect, setClassSelect] = useState('');
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [currentCar, setCurrentCar] = useState(null);
  const [orderSum, setOrderSum] = useState();

  const [freeCars, setFreeCars] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [step, setStep] = useState(1);

  const [directionResponse, setDirectionResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const [isUpdate, setUpdate] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);

  const arrivalRef = useRef();
  const departureRef = useRef();

  const [selectionRow, setSelectionRow] = useState<GridRowSelectionModel>(0);

  const autocompleteArrivalRef = useRef(null);
  const autocompleteDepartureRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    libraries: ['places'],
  });

  useEffect(() => {
    const getCustomerData = async () => {
      await axios.get(`http://localhost:4000/api/customer`).then((data) => {
        setCustomers(data.data.data);
      });
    };

    getCustomerData();
  }, [isUpdate]);

  const handleAddClient = async () => {
    const customerData = { name: name, surname: surname };
    await axios
      .post(`http://localhost:4000/api/customer`, customerData)
      .then(() => setUpdate((value) => (value += 1)))
      .catch((e) => console.log(e));
  };

  const getOrderSum = () => {
    const SUM_PER_KM = 13;

    let COEFFICIENT = 1;
    if (classSelect === 'comfort') {
      COEFFICIENT = 1.2;
    } else if (classSelect === 'business') {
      COEFFICIENT = 1.5;
    }

    const numberDistance = parseFloat(distance.replace(' км', ''));

    return Math.ceil(SUM_PER_KM * numberDistance * COEFFICIENT) + 20;
  };

  const handleFirstStep = async () => {
    if (selectionRow[0] === 0) {
      return;
    }

    const currCustomer = customers.find(
      (item) => item.customer_id === selectionRow[0]
    );
    setCurrentCustomer(currCustomer);
    setSelectionRow(0);
    setStep(2);
  };

  const handleSecondStep = async () => {
    await axios
      .get(`http://localhost:4000/api/car/free/?carClass=${classSelect}`)
      .then((data) => setFreeCars(data.data.data))
      .catch((e) => console.log(e))
      .finally(() => setStep(3));
  };

  const handleThirdStep = async () => {
    const findCar = freeCars.find((item) => item.car_id === selectionRow[0]);
    setCurrentCar(findCar);
    const totalSum = getOrderSum();
    console.log(totalSum);
    setOrderSum(totalSum);
    setStep(4);
  };

  const handleFourthStep = async () => {
    const formattedDistance = parseFloat(distance.replace(' км', ''));

    const data = {
      sum: orderSum,
      distance: formattedDistance,
      addressArrival: addressArrival,
      addressDeparture: addressDeparture,
      carId: currentCar?.car_id,
      customerId: currentCustomer?.customer_id,
    };
    console.log(data);
    await axios
      .post('http://localhost:4000/api/order', data)
      .then(() => setModalOpen(true))
      .catch((e) => console.log(e));
  };

  const handleRowSelection = (newSelection: any) => {
    setSelectionRow(newSelection);
  };

  async function calculateRoute() {
    if (arrivalRef.current.value === '' || departureRef.current.value === '') {
      return;
    }

    setAddressArrival(arrivalRef.current.value);
    setAddressDeparture(departureRef.current.value);

    const directionService = new google.maps.DirectionsService();
    const results = await directionService.route({
      origin: arrivalRef.current.value,
      destination: departureRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    setDirectionResponse(results);
    setDistance(results.routes[0].legs[0].distance?.text);
    setDuration(results.routes[0].legs[0].duration?.text);
  }

  const clearRoute = () => {
    setDirectionResponse(null);
    setDistance('');
    setDuration('');
    arrivalRef.current.value = '';
    departureRef.current.value = '';
  };

  const handleModalButton = () => {
    setModalOpen(false);
    setStep(1);
  }

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  if (step === 1) {
    return (
      <div className={classes.order}>
        <h2 className={classes.orderTitle}>Create new order</h2>
        <DataGrid
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          className={classes.dashboardTable}
          rows={customers}
          getRowId={(row) => row.customer_id}
          columns={customerColumn}
          pageSizeOptions={[5, 10]}
          onRowSelectionModelChange={(newSelection) => {
            handleRowSelection(newSelection);
          }}
        />
        <div className={classes.orderButtons}>
          <Select
            value={classSelect}
            className={classes.select}
            onChange={(event) => setClassSelect(event.target.value)}
          >
            <MenuItem value="standart">Standart</MenuItem>
            <MenuItem value="comfort">Comfort</MenuItem>
            <MenuItem value="business">Business</MenuItem>
          </Select>
          <Button
            onClick={() => handleFirstStep()}
            disabled={selectionRow === 0 || !classSelect}
            variant="contained"
          >
            Choose
          </Button>
        </div>
        <div className={classes.orderContainer}>

        </div>
      </div>
    );
  }

  if (step == 2) {
    return (
      <>
      <h2>Select addresses</h2>
        <div className={classes.mapWrapper}>
          <div className={classes.mapInfoBlock}>
            <div className={classes.mapInputs}>
              <Autocomplete>
                <input
                  value={addressArrival}
                  className={classes.input}
                  placeholder="Address arrival"
                  // onChange={(event) => setAddressArrival(event.target.value)}
                  ref={arrivalRef}
                />
              </Autocomplete>
              <Autocomplete>
                <input
                  className={classes.input}
                  value={addressDeparture}
                  ref={departureRef}
                  placeholder="Address departure"
                  // onChange={(event) => setAddressDeparture(event.target.value)}
                />
              </Autocomplete>
            </div>
            <div className={classes.mapInfoAdditional}>
              <p className={classes.mapInfo}>Distance: {distance}</p>
              <p className={classes.mapInfo}>Duration: {duration}</p>
            </div>
            <div className={classes.buttonBlock}>
              <div>
                <Button variant="contained" onClick={calculateRoute}>
                  Enter
                </Button>
                <Button onClick={clearRoute}>x</Button>
              </div>
            </div>
          </div>

          {isLoaded && (
            <GoogleMap
              center={center}
              zoom={15}
              mapContainerStyle={{ width: '100%', height: '100%' }}
              options={{
                streetView: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {directionResponse && (
                <DirectionsRenderer directions={directionResponse} />
              )}
            </GoogleMap>
          )}
        </div>
        <div className={classes.mapButtonBlock}>
          <Button onClick={handleSecondStep} variant="contained">
            Next step
          </Button>
        </div>
      </>
    );
  }

  if (step === 3) {
    return (
      <div className={classes.car}>
        <div className={classes.carHeaderBlock}>
          <h2>Choose a free car</h2>
          <Button
            onClick={handleThirdStep}
            disabled={selectionRow === 0}
            variant="contained"
          >
            Choose
          </Button>
        </div>
        <DataGrid
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          className={classes.dashboardTable}
          rows={freeCars}
          getRowId={(row) => row.car_id}
          columns={carOrderColumn}
          pageSizeOptions={[5, 10]}
          onRowSelectionModelChange={(newSelection) => {
            handleRowSelection(newSelection);
          }}
        />
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className={classes.details}>
        <div className={classes.detailsBlock}>
          <h2 className={classes.detailsTitle}>Order details</h2>
          <p className={classes.detailsText}>
            <span className={classes.detailTextBold}>Customer: </span>{' '}
            {currentCustomer.name} {currentCustomer.surname}
          </p>
          <p className={classes.detailsText}>
            <span className={classes.detailTextBold}>Car: </span>{' '}
            {currentCar.brand} {currentCar.model}
          </p>
          <p className={classes.detailsText}>
            <span className={classes.detailTextBold}>Class: </span>{' '}
            {currentCar.class}
          </p>
          <p className={classes.detailsText}>
            <span className={classes.detailTextBold}>Distance: </span>{' '}
            {distance}
          </p>
          <p className={classes.detailsText}>
            <span className={classes.detailTextBold}>Ride duration: </span>{' '}
            {duration}
          </p>
          <p className={classes.detailsText}>
            <span className={classes.detailTextBold}>Waiting time: </span> 5 min
          </p>
          <p className={classes.detailsText}>
            <span className={classes.detailTextBold}>To pay: </span> {orderSum}₴
          </p>
          <div className={classes.buttonBlock}>
            <Button variant onClick={handleFourthStep}>
              Confirm
            </Button>
          </div>
        </div>
        <Modal open={modalOpen} className={classes.modalWrapper}>
          <div className={classes.modal}>
            <div className={classes.modalContainer}>
              <img src={successImage} className={classes.modalImage} />
              <h4 className={classes.modalTitle}>
                A new order has been successfully created
              </h4>
              <Button variant="outlined" onClick={handleModalButton} className={classes.modalButton}>Submit</Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  return <div></div>;
};

export default Order;
