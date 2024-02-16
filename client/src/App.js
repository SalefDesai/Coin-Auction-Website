import './App.css';
import {Route,Routes,BrowserRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home.jsx';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Coins from './pages/Coins.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Login from './pages/Login.jsx';
import CheckAndShow from './components/CheckAndShow.jsx';
import Register from './pages/Register.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AuctionPage from './pages/AuctionPage.jsx';
import AuctionResult from './pages/AuctionResult.jsx';
import DeliveryDetails from './pages/DeliveryDetails.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import UsersProfile from './pages/UsersProfile.jsx';
import SellersPage from './pages/SellersPage.jsx';


function App() {
  return (
    <BrowserRouter>
    <ToastContainer />
      <CheckAndShow>
        <Header/>
      </CheckAndShow>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/coins' element={<Coins/>} />


        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/deliverydetails' element={<DeliveryDetails/>} />
        <Route path='/aboutus' element={<AboutUs/>} />

        <Route path='/auction/:id' element={<AuctionPage />} />
        <Route path='/auctionresults' element={<AuctionResult />} />
        <Route path='/paymentsuccess' element={<PaymentSuccess />} />
        <Route path='/paymentfailure' element={<h1>payment failed</h1>} />

        
        <Route path='/admindashboard' element={<AdminDashboard/>} />
        <Route path='/userprofile' element={<UsersProfile />} />
        <Route path='/sellerspage' element={<SellersPage />} />


      </Routes>
      {/* <Footer/> */}
    </BrowserRouter>
  )
}

export default App;
