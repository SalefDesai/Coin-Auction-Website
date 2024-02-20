import React from 'react';
import styled from 'styled-components';

const Modal = ({ isOpen, onClose, image, name, description, startTime, duration, material, startingBid }) => {

  return (
    <>
      {isOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={onClose}>&times;</CloseButton>
            <ImageWrapper>
              <img src={image} alt={name} />
            </ImageWrapper>
            <h2>{name}</h2>
            <p>{description}</p>
            <p>Start Time of Auction : {startTime}</p>
            <p>Auction Duration : {duration}</p>
            <p>Coin Material : {material}</p>
            <p>Starting Bid : {startingBid}</p>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 80%;
  width: 60%;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  background: none;
  border: none;
`;

const ImageWrapper = styled.div`
  margin-bottom: 20px;
  img {
    width: 100%;
    height: 300px; /* Adjust height as needed */
    object-fit: cover;
    border-radius: 8px;
  }
`;

export default Modal;
