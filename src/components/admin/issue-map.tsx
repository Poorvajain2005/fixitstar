"use client";

import type { Issue } from '@/types/issue';
import { useEffect, useState } from 'react';

interface IssueMapProps {
    issues: Issue[];
}

const DEFAULT_CENTER = { lat: 34.0522, lng: -118.2437 }; // Los Angeles
const DEFAULT_ZOOM = 11;

const IssueMap: React.FC<IssueMapProps> = ({ issues }) => {
    const [center, setCenter] = useState(DEFAULT_CENTER);

    useEffect(() => {
        const valid = issues.find(issue => typeof issue.location.latitude === 'number' && typeof issue.location.longitude === 'number');
        if (valid) {
            setCenter({ lat: valid.location.latitude, lng: valid.location.longitude });
        }
    }, [issues]);

    // Google Maps embed URL (no markers, just center)
    const mapUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyBNpIVf89zq4SMoVSXGoChD0WVpXaivc38&center=${center.lat},${center.lng}&zoom=${DEFAULT_ZOOM}`;

    return (
        <div style={{ height: '450px', width: '100%' }} className="rounded-lg overflow-hidden">
            <iframe
                title="Google Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={mapUrl}
            />
        </div>
    );
};

export default IssueMap;
