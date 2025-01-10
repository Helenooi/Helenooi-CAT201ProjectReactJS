// components/section-heading.jsx
import React from 'react';

const SectionHeading = ({ heading }) => {
  return (
    <div className="section-heading-container">
      <h2 className="section-heading">{heading}</h2>
    </div>
  );
};

export default SectionHeading;
