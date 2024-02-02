import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import UsersCoin from '../components/UsersCoin';
import RemainingPayments from '../components/RemainingPayments';
import UpdateUserProfile from '../components/UpdateUserProfile';

const UsersProfile = () => {

  const navigate = useNavigate();
  const [currentContent, setCurrentContent] = useState('your coins');
  const [user,setUser] = useState();

  useEffect(() => {
    const setUserFromLocalStorage = async () => {
      setUser(await JSON.parse(localStorage.getItem('coin-auction')));
    };

    setUserFromLocalStorage();
  }, []);

  const handleButtonClick = (content) => {
    setCurrentContent(content);
  };
 
  return (
    <>    
    <Wrapper>
        <Sidebar>
      <div className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary" style={{height:'96%'}}>
        <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
          <svg className="bi pe-none me-2" width="40" height="32"><use xlinkHref="#bootstrap"></use></svg>
          <span className="fs-4">User Profile</span>
        </a>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
        <li >
            <div className={`nav-link ${currentContent === 'your coins' ? 'active':'link-body-emphasis'}`}
              onClick={() => handleButtonClick('your coins')} >
              <svg className="bi pe-none me-2" width="16" height="16"><use xlinkHref="#table"></use></svg>
              Your Coins
            </div>
          </li>
          <li className="nav-item">
            <div className={`nav-link ${currentContent === 'remaining payment' ? 'active':'link-body-emphasis'}`} 
              onClick={() => handleButtonClick('remaining payment')}>
              <svg className="bi pe-none me-2" width="16" height="16"></svg>
              Remaining Payment
            </div>
          </li>
          <li className="nav-item">
            <div className={`nav-link ${currentContent === 'edit profile' ? 'active':'link-body-emphasis'}`} 
              onClick={() => handleButtonClick('edit profile')}>
              <svg className="bi pe-none me-2" width="16" height="16"></svg>
              Edit Profile
            </div>
          </li>
        </ul>
        <button 
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '8px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={() => navigate(-1)}
          >Go back</button>
        <hr />
      </div>
      </Sidebar>

      <WraperComponent>
        {currentContent === 'your coins' && <UsersCoin user={user} /> }
        {currentContent === 'remaining payment' && <RemainingPayments user={user} /> } 
        {currentContent === 'edit profile' && <UpdateUserProfile user={user} /> }
        
      </WraperComponent>

      </Wrapper>
    </>
  );
}


const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f0f0f0;
`;

const WraperComponent = styled.div`
  /* Your styles for WraperComponent */
  flex-grow: 1;

  box-sizing: border-box;
  height: 96%;
  margin : 10px;
  background-color: white;
  overflow: auto;
`;

const Sidebar = styled.div`
  /* Your styles for the sidebar */
  width: 20%;
  height: 100%;
  margin : 10px;
`;

export default UsersProfile;
