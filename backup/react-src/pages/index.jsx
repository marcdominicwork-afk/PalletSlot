import Layout from "./Layout.jsx";

import Booking from "./Booking";

import Schedule from "./Schedule";

import Arrival from "./Arrival";

import Docks from "./Docks";

import Companies from "./Companies";

import Users from "./Users";

import VehicleTypes from "./VehicleTypes";

import API from "./API";

import Carriers from "./Carriers";

import DriverKiosk from "./DriverKiosk";

import UserGuide from "./UserGuide";

import Warehouses from "./Warehouses";

import DatabaseScript from "./DatabaseScript";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Booking: Booking,
    
    Schedule: Schedule,
    
    Arrival: Arrival,
    
    Docks: Docks,
    
    Companies: Companies,
    
    Users: Users,
    
    VehicleTypes: VehicleTypes,
    
    API: API,
    
    Carriers: Carriers,
    
    DriverKiosk: DriverKiosk,
    
    UserGuide: UserGuide,
    
    Warehouses: Warehouses,
    
    DatabaseScript: DatabaseScript,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Booking />} />
                
                
                <Route path="/Booking" element={<Booking />} />
                
                <Route path="/Schedule" element={<Schedule />} />
                
                <Route path="/Arrival" element={<Arrival />} />
                
                <Route path="/Docks" element={<Docks />} />
                
                <Route path="/Companies" element={<Companies />} />
                
                <Route path="/Users" element={<Users />} />
                
                <Route path="/VehicleTypes" element={<VehicleTypes />} />
                
                <Route path="/API" element={<API />} />
                
                <Route path="/Carriers" element={<Carriers />} />
                
                <Route path="/DriverKiosk" element={<DriverKiosk />} />
                
                <Route path="/UserGuide" element={<UserGuide />} />
                
                <Route path="/Warehouses" element={<Warehouses />} />
                
                <Route path="/DatabaseScript" element={<DatabaseScript />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}