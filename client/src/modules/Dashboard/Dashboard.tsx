//@ts-nocheck
import React, { FC, useEffect, useState } from 'react';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import { TextField, Button, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import classes from './Dashboard.module.css';
import { carColumn } from '../../constants/carColumn';
import { customerColumn } from '../../constants/customerColumn';
import { orderColumn } from '../../constants/orderColumn';

interface IDashboardProps {
  title: string;
  tableValue:
    | 'plot'
    | 'broadcast'
    | 'competition'
    | 'employee'
    | 'guest'
    | 'spotsman'
    | string;
}

const Dashboard: FC<IDashboardProps> = (props) => {
  const { tableValue, title } = props;
  const [tableContent, setTableContent] = useState([]);
  const [primaryId, setPrimaryId] = useState('customer_id');
  const [selectionRow, setSelectionRow] = useState<GridRowSelectionModel>([]);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setUpdate] = useState(1);

  const [customerName, setCustomerName] = useState('');
  const [customerSurname, setCustomerSurname] = useState('');

  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [classSelect, setClassSelect] = useState('');

  useEffect(() => {
    setSelectionRow([]);

    const getTableContent = async () => {
      setLoading(true);
      await axios
        .get(`http://localhost:4000/api/${tableValue}`)
        .then((data) => {
          setTableContent(data.data.data);
        })
        .then(() => setPrimaryId(tableValue + '_id'))
        .catch((e) => console.log(e))
        .finally(() => setLoading(false));
    };
    getTableContent();
  }, [tableValue, isUpdate]);

  const handleAddCar = async () => {
    if (carBrand === '' || carModel === '' || classSelect === '') {
      return;
    }

    const data = {};
  };

  const handleAddTable = async () => {
    if (customerName === '' || customerSurname === '') {
      return;
    }

    const data = { name: customerName, surname: customerSurname };

    await axios
      .post(`http://localhost:4000/api/customer`, data)
      .then(() => {
        setUpdate((value) => (value += 1));
        // setTableContent([...tableContent, data.data.data])
      })
      .catch((e) => console.log(e));
  };

  const handleRowSelection = (newSelection: any) => {
    setSelectionRow(newSelection);
  };

  const handleFreeCar = async() => {

  }

  console.log(tableContent);

  return (
    <div>
      <h3 className={classes.dashboardTitle}>{title}</h3>
      <DataGrid
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        className={classes.dashboardTable}
        rows={tableContent}
        getRowId={(row) => row[primaryId]}
        columns={
          tableValue == 'customer'
            ? customerColumn
            : tableValue === 'car'
            ? carColumn
            : orderColumn
        }
        pageSizeOptions={[5, 10]}
        onRowSelectionModelChange={(newSelection) => {
          //@ts-ignore
          handleRowSelection(newSelection);
        }}
      />
      {tableValue === 'car' ? <Button variant='contained' onCLick={handleFreeCar}>Set free</Button> : null}
      {tableValue === 'customer' ? (
        <div className={classes.orderBlock}>
          <div>
            <TextField
              label="Name"
              className={classes.input}
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
            />
            <TextField
              label="Surname"
              className={classes.input}
              value={customerSurname}
              onChange={(event) => setCustomerSurname(event.target.value)}
            />
          </div>
          <div>
            <Button variant="contained" onClick={handleAddTable}>
              Add client
            </Button>
          </div>
        </div>
      ) : tableValue === 'car' ? (
        <div className={classes.orderBlock}>
          <div style={{ marginBottom: '18px' }}>
            <TextField
              label="Brand"
              className={classes.input}
              value={carBrand}
              onChange={(event) => setCarBrand(event.target.value)}
            />
            <TextField
              label="Model"
              className={classes.input}
              value={carModel}
              onChange={(event) => setCarModel(event.target.value)}
            />
          </div>
          <Select
            value={classSelect}
            className={classes.select}
            onChange={(event) => setClassSelect(event.target.value)}
          >
            <MenuItem value="standart">Standart</MenuItem>
            <MenuItem value="comfort">Comfort</MenuItem>
            <MenuItem value="business">Business</MenuItem>
          </Select>
          <Button>Add car</Button>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
