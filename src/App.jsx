import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, RefreshCw, Check, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const App = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState({ label: '', color: '', score: 0 });

  const generatePassword = useCallback(() => {
    let charset = '';
    if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.numbers) charset += '0123456789';
    if (options.symbols) charset += '!@#$%^&*()_+~`|}{[]\\:;?><,./-=';

    if (charset === '') {
      setPassword('SET_PROTOCOL_OPTIONS');
      setStrength({ label: '-', color: 'rgba(255,255,255,0.1)', score: 0 });
      return;
    }

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      generatedPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(generatedPassword);
    calculateStrength(generatedPassword);
  }, [length, options]);

  useEffect(() => {
    generatePassword();
  }, [length, options, generatePassword]);

  const calculateStrength = (pwd) => {
    // Count how many options are true
    const activeOptions = Object.values(options).filter(Boolean).length;
    
    // Calculate display score (0-100) for the bar
    // 1 option = 25%, 2 = 50%, 3 = 75%, 4 = 100%
    const score = activeOptions * 25;

    const levels = [
      { label: '-', color: 'rgba(255,255,255,0.1)', count: 0 },
      { label: 'WEAK', color: '#ef4444', count: 1 },
      { label: 'MEDIUM', color: '#f97316', count: 2 },
      { label: 'STRONG', color: '#eab308', count: 3 },
      { label: 'ULTRA_STRONG', color: '#10b981', count: 4 },
    ];

    const level = levels.find(l => activeOptions === l.count) || levels[0];
    setStrength({ ...level, score: score });
  };

  const copyToClipboard = () => {
    if (password === 'SET_PROTOCOL_OPTIONS') return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#34d399', '#059669']
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleOption = (opt) => {
    setOptions(prev => ({ ...prev, [opt]: !prev[opt] }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="hacker-panel"
    >
      <div className="text-center">
        <div className="icon-box">
          <ShieldCheck className="w-8 h-8 emerald" />
        </div>
        <h1 className="brand">CipherVault</h1>
        <p className="terminal-status">{">"} SECURE_KEY_GEN_V2.0</p>
      </div>

      <div className="display-area">
        <div className="display-container">
          <AnimatePresence mode="wait">
            <motion.span 
              key={password}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 5 }}
              className="password-text"
            >
              {password}
            </motion.span>
          </AnimatePresence>
          <div className="flex gap-1" style={{ display: 'flex', gap: '4px' }}>
            <button onClick={generatePassword} className="btn-icon" title="Regenerate">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button onClick={copyToClipboard} className="btn-icon" title="Copy">
              {copied ? <Check className="w-5 h-5 emerald" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="strength-meter">
          <div className="strength-label">
            <span>PASSWORD_STRENGTH</span>
            <span style={{ color: strength.color, fontWeight: 'bold' }}>{strength.label}</span>
          </div>
          <div className="strength-bar-bg">
            <motion.div 
              animate={{ width: `${strength.score}%`, backgroundColor: strength.color }}
              className="strength-bar-fill"
            />
          </div>
        </div>
      </div>

      <div className="controls mt-8" style={{ marginTop: '2rem' }}>
        <div className="control-group">
          <div className="label-row">
            <span>KEY_LENGTH</span>
            <span className="value-highlight">{length}</span>
          </div>
          <input 
            type="range" 
            min="8" 
            max="64" 
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
          />
        </div>

        <div className="options-grid">
          {Object.keys(options).map((opt) => (
            <div 
              key={opt}
              className={`option-item ${options[opt] ? 'active' : ''}`}
              onClick={() => toggleOption(opt)}
            >
              <span className="option-label">{opt}</span>
              <div className="checkbox-custom">
                {options[opt] && <Check className="w-3 h-3 white" style={{ color: 'white' }} />}
              </div>
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generatePassword}
          className="main-btn"
        >
          <Zap className="w-4 h-4" />
          INITIALIZE_ENCRYPTION
        </motion.button>
      </div>
    </motion.div>
  );
};

export default App;
