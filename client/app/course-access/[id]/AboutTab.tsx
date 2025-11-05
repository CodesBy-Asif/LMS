'use client';
import React from 'react';

const AboutTab = ({ currentVideo, courseData }: any) => (
  <div>
    <p className="text-forground font-bold text-md leading-relaxed">
      {currentVideo?.title || courseData?.name || 'No title available yet.'}
    </p>
    <p className="text-muted-foreground leading-relaxed">
      {currentVideo?.description || courseData?.description || 'No description available yet.'}
    </p>
  </div>
);

export default AboutTab;
