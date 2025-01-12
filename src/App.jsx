import { Fragment } from 'react';
import './style.css';
import '../src/views/home.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserMainPage from "./views/usermain";
import UserProfilePage from "./views/userprofile"
import NavBar from './views/nabvar';
import Footer from './views/footer';
import SectionHeading from '../src/components/section-heading';
import ItemCard from '../src/components/item-card';
import { Link } from 'react-router-dom';
function App() {

  const [role, setRole] = useState('admin'); // Change to 'admin' to test admin view

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<UserMainPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>

      <div>
      <NavBar role={role}/>
        <div className="home-main">
          <div className="section-container">
            <div className="max-width-container">
              <SectionHeading heading="WELCOME, ADMIN" />
              <div className="home-gallery">
                <div className="home-right2">
                  <div className="home-top">

                    <ItemCard
                      name="Luxury Executive Chair"
                      text={<Fragment><span className="home-text19">View Order</span></Fragment>}
                      imageSrc2="/iconvieworder.png"
                      rootClassName="rootClassName1"
                    />
                    <ItemCard
                      name="Luxury Executive Chair"
                      text={<Fragment><span className="home-text20">View Product</span></Fragment>}
                      imageSrc2="/iconviewproduct.png"
                      rootClassName="rootClassName2"
                    />

<Link to="/addproduct">
                     <ItemCard
                      name="Luxury Executive Chair"
                      text={<Fragment><span className="home-text20">Add Product</span></Fragment>}
                      imageSrc2="/iconviewproduct.png"
                      rootClassName="rootClassName2"
                    />
</Link>
<ItemCard
                      name="Luxury Executive Chair"
                      text={<Fragment><span className="home-text20">Add Admin</span></Fragment>}
                      imageSrc2="/iconviewproduct.png"
                      rootClassName="rootClassName2"
                    />
                  
                  </div>
                  <div className="home-bottom"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
