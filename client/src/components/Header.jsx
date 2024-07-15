import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';
import { URLForGettingObjFromS3, getUserProfile, logout } from '../utils/Routes.js';
import { showErrorToast } from '../utils/Toast.js';


const Header = () => {

    const navigate = useNavigate();
    const [isLogin,setIsLogin] = useState(false);
    const [user,setUser] = useState(null);    
    const [showSellerPage, setShowSellerPage] = useState(false);
    const [showAdminPage, setShowAdminPage] = useState(false);
    const [userProfileImage, setUserProfileImage] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(getUserProfile, { withCredentials: true });

        if (response.data.success) {
          setUser(response.data.user);
          setIsLogin(true);

          if (response.data.user.email === 'admin@gmail.com' && response.data.user.userType === 'admin') {
            setShowAdminPage(true);
          }
          if (response.data.user.userType === 'seller') {
            setShowSellerPage(true);
          }
        } else {
          setIsLogin(false);
          localStorage.removeItem("coin-auction");
          setUser({});
          setShowAdminPage(false);
          setShowSellerPage(false);
        }
      } catch (error) {
        console.log("error : ", error);
      }
    };

    getUserInfo();
  }, []);

  useEffect(() => {
    const getUserProfileImageFromS3 = async () => {
      if (user && user.userId) {
        try {
          const getURL = await axios.post(URLForGettingObjFromS3, { userId: user.userId }, { withCredentials: true });
          setUserProfileImage(getURL.data.url);
        } catch (error) {
          console.log("Error fetching user profile image:", error);
        }
      }
    };

    if (isLogin) {
      getUserProfileImageFromS3();
    }
  }, [isLogin, user]);

    const handleClick = async() => {
      
      const response = await axios.get(`${logout}`,{withCredentials:true});

      if (response.data.success) {
        setUser({});
        setIsLogin(false);
        localStorage.removeItem("coin-auction");
        setShowAdminPage(false);
        setShowSellerPage(false);
      } else {
        showErrorToast("unable to logout. logout again..!!");
      }
    }


  return (
    <header className="p-3 mb-3 border-bottom">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none">
            {/* <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap">
              <use xlinkHref="#bootstrap"></use> */}
              <h4>CoinAuctionLog</h4>
            {/* </svg> */}
          </a>

          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li><div className="nav-link px-2 link-body-emphasis" style={{ cursor: 'pointer' }} onClick={() => {navigate('/')}} >Home</div></li>
            <li><div className="nav-link px-2 link-body-emphasis" style={{ cursor: 'pointer' }} onClick={() => {navigate('/coins')}} >Coins</div></li>
            { showSellerPage && <li><div className="nav-link px-2 link-body-emphasis" style={{ cursor: 'pointer' }} onClick={() => {navigate('/sellerspage')}} >Seller's Page</div></li> }
            { showAdminPage && <li><div className="nav-link px-2 link-body-emphasis" style={{ cursor: 'pointer' }} onClick={() => {navigate('/admindashboard')}} >Admin Dashboard</div></li> }
            <li><div className="nav-link px-2 link-body-emphasis" style={{ cursor: 'pointer' }} onClick={() => {navigate('/contactus')}} >Contact Us</div></li>
            <li><div className="nav-link px-2 link-body-emphasis" style={{ cursor: 'pointer' }} onClick={() => {navigate('/aboutus')}} >About Us</div></li>
          </ul>

          <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
            <input type="search" className="form-control" placeholder="Search..." aria-label="Search"/>
          </form>

          <div className="dropdown text-end" style={{ cursor: 'pointer' }}>
            <div className="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              {isLogin && userProfileImage !== null? (
                <img src={userProfileImage} alt="mdo" width="32" height="32" className="rounded-circle"/>
              ) : (
                <img src="https://th.bing.com/th/id/OIP.ruat7whad9-kcI8_1KH_tQHaGI?w=263&h=218&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="mdo" width="32" height="32" className="rounded-circle"/>
              )}
              
            </div>
            <ul className="dropdown-menu text-small" style={{}}>
              { isLogin ? (
                <>
                  { !showAdminPage && <li><Link className="dropdown-item" to={"/userprofile"}>{user.name}</Link></li> }
                  <li><Link className="dropdown-item" onClick={handleClick}>Sign Out</Link></li>
                </>
              ) : (
                <li><Link className="dropdown-item" to={"/login"}>Sign In</Link></li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
