import React,{ useState, useEffect }  from 'react'

const Timer = ({ targetTime, onTimeout }) => {
    const calculateTimeRemaining = () => {
        const currentTime = new Date().getTime();
        const targetTimeInMillis = new Date(targetTime).getTime();
        const timeRemaining = targetTimeInMillis - currentTime;
    
        if (timeRemaining <= 0) {
          // Timer has expired
          onTimeout();
          return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          };
        }
    
        const seconds = Math.floor((timeRemaining / 1000) % 60);
        const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
        const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    
        return {
          days,
          hours,
          minutes,
          seconds,
        };
      };
    
      const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining);
    
      useEffect(() => {
        const timerInterval = setInterval(() => {
          setTimeRemaining(calculateTimeRemaining);
        }, 1000);
    
        return () => clearInterval(timerInterval);
      }, );
    
      return (
        <div>
          <div>{`${timeRemaining.days}d : ${timeRemaining.hours}h : ${timeRemaining.minutes}m : ${timeRemaining.seconds}s`}</div>
        </div>
      );
    };

export default Timer