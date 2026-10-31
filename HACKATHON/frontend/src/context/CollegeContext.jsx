import React, { createContext, useContext, useState, useEffect } from 'react';
import { COLLEGES } from '../data/mockData';

const CollegeContext = createContext(null);

export function CollegeProvider({ children }) {
  const [selectedCollegeId, setSelectedCollegeId] = useState(() => {
    const saved = localStorage.getItem('ccms_selected_college_id');
    if (saved && COLLEGES.some(c => c.id === saved)) {
      return saved;
    }
    return 'klh-university'; // Default institution
  });

  const [isCollegeModalOpen, setIsCollegeModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ccms_selected_college_id', selectedCollegeId);
  }, [selectedCollegeId]);

  const activeCollege = COLLEGES.find(c => c.id === selectedCollegeId) || COLLEGES[0];

  const selectCollege = (collegeId) => {
    if (COLLEGES.some(c => c.id === collegeId)) {
      setSelectedCollegeId(collegeId);
      setIsCollegeModalOpen(false);
    }
  };

  return (
    <CollegeContext.Provider value={{
      colleges: COLLEGES,
      selectedCollege: activeCollege,
      selectedCollegeId,
      selectCollege,
      isCollegeModalOpen,
      setIsCollegeModalOpen
    }}>
      {children}
    </CollegeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCollege = () => {
  const context = useContext(CollegeContext);
  if (!context) {
    throw new Error('useCollege must be used within a CollegeProvider');
  }
  return context;
};

