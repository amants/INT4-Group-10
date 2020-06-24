import { useState, useEffect } from 'react';

const CountdownComponent = ({ startDate }) => {
  const [sentence, setSentence] = useState('');
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      const count = countdown(startDate);
      if (count.value > 0) setIsRunning(false);
      setSentence(
        `${count.days > 0 ? `${count.days}d ` : ``}${
          count.hours > 0 ? `${count.hours}h ` : ``
        }${count.minutes > 0 ? `${count.minutes}m ` : ``}${
          count.seconds > 0 ? `${count.seconds}s` : ``
        }`,
      );
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  return isRunning ? sentence : 'Now!';
  // }
};

export default CountdownComponent;
