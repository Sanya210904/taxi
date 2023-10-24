import React, { useState } from 'react';
import Dashboard from '../modules/Dashboard/Dashboard';
import Order from '../modules/Order/Order';
// import axios from 'axios';
import classes from './AdminPage.module.css';

const navArray = [
  { id: 1, value: 'customer', name: 'Customer' },
  { id: 2, value: 'car', name: 'Car' },
  { id: 3, value: 'order', name: 'Order' },
  { id: 4, value: 'new', name: 'New Order' },
];

const AdminPage = () => {
  const [currentNavObject, setCurrentNavObject] = useState(navArray[0]);

  const handleNavClick = async (value: any) => {
    setCurrentNavObject(value);
  };

  return (
    <div className={classes.admin}>
      <div className={classes.nav}>
        <h2 className={classes.navLogo}>Taxi</h2>
      </div>
      <div className={classes.adminBlock}>
        <div className={classes.leftNav}>
          {navArray.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={classes.leftNavBlock}
              >
                <h6 className={classes.leftNavTitle}>{item.name}</h6>
              </div>
            );
          })}
        </div>
        <div className={classes.dashboardBlock}>
          {currentNavObject.value === 'new' ? (
            <Order />
          ) : (
            <Dashboard
              title={currentNavObject.name}
              tableValue={currentNavObject?.value}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
