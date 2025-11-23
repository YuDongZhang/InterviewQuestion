import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FlutterStreamDemo = () => {
  const [streamData, setStreamData] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [receivedData, setReceivedData] = useState([]);

  const addData = () => {
    const newData = {
      id: Date.now(),
      value: Math.floor(Math.random() * 100),
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };
    setStreamData(prev => [...prev, newData]);
  };

  // Simulate stream processing
  useEffect(() => {
    if (streamData.length > 0) {
      const timer = setTimeout(() => {
        // Remove data from stream after "processing" time
        setStreamData(prev => prev.slice(1));
        
        if (isSubscribed) {
          setReceivedData(prev => [...prev, streamData[0]]);
        }
      }, 2000); // Time to travel through pipe
      return () => clearTimeout(timer);
    }
  }, [streamData, isSubscribed]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Flutter Stream 机制演示</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
        Stream 就像一个传送带 (Pipe)。StreamController 是入口，StreamSubscription 是出口。
        <br />
        只有当有人监听 (Listen) 时，数据才能被接收。
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', height: '200px' }}>
        
        {/* Source / StreamController */}
        <div style={{ zIndex: 2, textAlign: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addData}
            style={{
              padding: '15px 25px',
              fontSize: '16px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            Sink.add(Data)
          </motion.button>
          <div style={{ marginTop: '10px', fontWeight: 'bold', color: '#2196F3' }}>StreamController</div>
        </div>

        {/* The Pipe / Stream */}
        <div style={{ 
          flex: 1, 
          height: '60px', 
          backgroundColor: '#E3F2FD', 
          margin: '0 20px', 
          borderRadius: '30px', 
          position: 'relative',
          border: '2px dashed #90CAF9',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)', color: '#90CAF9', fontWeight: 'bold' }}>STREAM</div>
          
          {/* Flowing Data */}
          <AnimatePresence>
            {streamData.map((data) => (
              <motion.div
                key={data.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 400, opacity: 1 }} // Adjust 400 based on pipe width approximation or use percentages if possible, but fixed for simplicity demo
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "linear" }}
                style={{
                  position: 'absolute',
                  top: '10px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: data.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {data.value}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Listener / Subscription */}
        <div style={{ zIndex: 2, textAlign: 'center' }}>
          <motion.div
            animate={{ 
              backgroundColor: isSubscribed ? '#4CAF50' : '#9E9E9E',
              scale: isSubscribed ? 1.05 : 1
            }}
            style={{
              padding: '20px',
              borderRadius: '12px',
              color: 'white',
              width: '120px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            onClick={() => setIsSubscribed(!isSubscribed)}
          >
            {isSubscribed ? 'Listening...' : 'Paused'}
          </motion.div>
          <div style={{ marginTop: '10px', fontWeight: 'bold', color: isSubscribed ? '#4CAF50' : '#9E9E9E' }}>
            {isSubscribed ? 'StreamSubscription' : 'No Listener'}
          </div>
        </div>

      </div>

      {/* Received Data Log */}
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', minHeight: '100px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#555' }}>Received Data (Output)</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {receivedData.length === 0 && <span style={{ color: '#999' }}>Waiting for data...</span>}
          {receivedData.map((data, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: data.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px'
              }}
            >
              {data.value}
            </motion.div>
          ))}
        </div>
        {receivedData.length > 0 && (
          <button 
            onClick={() => setReceivedData([])}
            style={{ marginTop: '10px', padding: '5px 10px', fontSize: '12px', cursor: 'pointer' }}
          >
            Clear Log
          </button>
        )}
      </div>
    </div>
  );
};

export default FlutterStreamDemo;
