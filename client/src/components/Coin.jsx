import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Timer from './Timer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auctionParticipation, checkIsAuthenticated } from '../utils/Routes';
import { showErrorToast, showSuccessToast } from '../utils/Toast';
import Modal from './Modal';


const Coin = ({ id, image, name, description, startTime, duration, material, startingBid }) => {

  const navigate = useNavigate();
  const [showTimer, setShowTimer] = useState(false);
  const [buttonColor, setButtonColor] = useState('blue'); 
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const currentTime = new Date();
    const startDateTime = new Date(startTime);

    const timeDifference = startDateTime - currentTime;

    if (timeDifference < 24 * 60 * 60 * 1000) {
      setShowTimer(true);
    } else {
      setShowTimer(false);
    }
  }, [startTime]);

  const handleTimeout = () => {
    setShowTimer(false);
    setButtonColor('green'); 
  };

  const joinAuction = async () => {
    
    try {
      const response = await axios.get(`${checkIsAuthenticated}`,{withCredentials:true});
      if (response.data.success) {
        navigate(`/auction/${id}`,{
              state:{ id, image, name, description, startTime, duration, material, startingBid }
            })
      } else {
        showErrorToast("Need to Sign In to enter auction.");
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const participateInAuction = async() => {
    console.log("clicked");

    const userData = await JSON.parse(localStorage.getItem('coin-auction'));

    if (!userData) {
      showErrorToast("Need to Sign In to participate for auction.");
      navigate('/login')
      return
    } 
    
    try {
      const {data} = await axios.post(`${auctionParticipation}`,{
        userName : userData.name,
        userEmail : userData.email,
        userId : userData.userId,
        coinId : id
      }, {withCredentials : true})
  
      if (data.success) {
        showSuccessToast(data.message);
      }
    } catch (error) {
      console.log("error : " , error);
    }

  }

  const openModal = () => {setModalOpen(true);}
  const closeModal = () => setModalOpen(false);

  return (
    <StyledCard className="card shadow-sm">
      <CenterImage>
        <img
          src={image}
          alt={name}
          className="bd-placeholder-img card-img-top"
        />
      </CenterImage>

      <div className="card-body" width="100%">
        <h5 className="card-title">{name}</h5>

        <p className="card-text">
          {description.length < 45 ? description : `${description.slice(0, 47)}...`}
        </p>

        <div className="card-text">
          <small >Start Time : {startTime}</small>
          <br />
          <small >Duration : {duration}</small>
          <br />

          <div style={{ display: 'flex', alignItems: 'center'}}>
            <button type="button" className="btn btn-light rounded-pill px-3" style={{margin:'10px', marginLeft:'0px'}} onClick={openModal}>
              Show Details
            </button>

            {showTimer && (
              <small>
                Time left: <Timer targetTime={new Date(startTime)} onTimeout={handleTimeout} />
              </small>
            )}
          </div>
        </div>

        <StyledButton>
          {buttonColor === 'blue' ? 
          (<button type="button" className={`btn btn-primary btn-block ${buttonColor}`} onClick={participateInAuction}>
            Participate
          </button>) : 
          (<button type="button" className={`btn btn-success btn-block ${buttonColor}`} onClick={joinAuction}>
          Join Auction
        </button>) }
        </StyledButton>
      </div>
      <Modal

        isOpen={isModalOpen}
        onClose={closeModal}
        image={image}
        name={name}
        description={description}
        startTime={startTime}
        duration={duration}
        material={material}
        startingBid={startingBid}
      />
    </StyledCard>
  );
};

const StyledCard = styled.div``;

const CenterImage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    width: 300px;
    height: 300px;
    object-fit: cover;
  }
`;

const StyledButton = styled.div`
  button {
    width: 100%;
  }

  .green {
    background-color: green;
    &:hover {
      background-color: white;
      color: green;
    }
  }

  .blue {
    background-color: blue;
    &:hover {
      background-color: white;
      color: blue;
    }
  }
`;

export default Coin;
