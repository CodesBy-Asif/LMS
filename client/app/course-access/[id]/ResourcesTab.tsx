'use client';
import React from 'react';

const ResourcesTab = ({ currentVideo }: any) => {
  if (!currentVideo || !currentVideo.links?.length)
    return <p className="text-muted-foreground">No resources available yet.</p>;

  return (
    <div>
      <h3 className="text-lg text-forground font-semibold mb-2">Resources</h3>
      <ul className="list-disc pl-6 space-y-1">
        {currentVideo.links.map((r: any, i: number) => (
          <li key={i}>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {r.title || r.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourcesTab;
