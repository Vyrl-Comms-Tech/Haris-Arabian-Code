import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sampleReferrals } from '../data/sample-referrals.Js'; 

const ReferralContext = createContext();

export const ReferralProvider = ({ children }) => {
  const [referrals, setReferrals] = useState(sampleReferrals);

  const addReferral = (referral) => {
    const newReferral = { ...referral, id: uuidv4(), createdAt: new Date().toISOString() };
    setReferrals((prev) => [newReferral, ...prev]);
  };

  const updateReferral = (id, referral) => {
    setReferrals((prev) => prev.map((item) => (item.id === id ? { ...item, ...referral } : item)));
  };

  const deleteReferral = (id) => {
    setReferrals((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ReferralContext.Provider value={{ referrals, addReferral, updateReferral, deleteReferral }}>
      {children}
    </ReferralContext.Provider>
  );
};

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (context === undefined) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
};