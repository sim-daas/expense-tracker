import React from 'react';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  return (
    <div className="App">
    {/* Background music */}
      <audio loop autoPlay>
        <source src="/back1.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      {/* Background gif */}
        <div className="background"></div>

      {/* Fixed header */}
      <header className="app-header">
        <motion.h1
          className="app-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 50 }}
        >
          SIGMA EXP TRACKER
        </motion.h1>
      </header>

      {/* Page content with scroll */}
      <div className="content">
        <motion.div 
          className="content-container" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 2 }}>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
