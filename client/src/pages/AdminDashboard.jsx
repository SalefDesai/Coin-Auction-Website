import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import AddNewCoin from '../components/AddNewCoin';

const AdminDashboard = () => {

  const navigate = useNavigate();
  const [currentContent, setCurrentContent] = useState('new coin');

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
          <span className="fs-4">Admin</span>
        </a>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
        <li >
            <div className={`nav-link ${currentContent === 'new coin' ? 'active':'link-body-emphasis'}`}
              onClick={() => handleButtonClick('new coin')} >
              <svg className="bi pe-none me-2" width="16" height="16"><use xlinkHref="#table"></use></svg>
              Add new coins
            </div>
          </li>
          <li className="nav-item">
            <div className={`nav-link ${currentContent === 'coin offer' ? 'active':'link-body-emphasis'}`} 
              onClick={() => handleButtonClick('coin offer')}>
              <svg className="bi pe-none me-2" width="16" height="16"></svg>
              new coin offers
            </div>
          </li>
          <li>
            <div className="nav-link link-body-emphasis">
              <svg className="bi pe-none me-2" width="16" height="16"><use xlinkHref="#grid"></use></svg>
              Products
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
        {currentContent === 'new coin' && <AddNewCoin /> }
        {currentContent === 'coin offer' && <h1>coin offer</h1> }
        
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

export default AdminDashboard;
