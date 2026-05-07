/**
 * Real-time geolocation utilities for FixIt
 * Handles:
 * - GPS coordinates
 * - Reverse geocoding
 * - Live location tracking
 * - Browser permission handling
 */

export interface Coordinate {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationInfo extends Coordinate {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

/**
 * Get current GPS coordinates
 */
export async function getCurrentCoordinates(): Promise<Coordinate> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error(
          "Geolocation is not supported by this browser."
        )
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let message = "Failed to retrieve location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message =
              "Location permission denied. Please enable location access.";
            break;

          case error.POSITION_UNAVAILABLE:
            message =
              "Location information is unavailable.";
            break;

          case error.TIMEOUT:
            message =
              "Location request timed out.";
            break;
        }

        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Reverse geocoding using OpenStreetMap Nominatim API
 * Converts coordinates into readable address
 */
export async function getAddressFromCoordinates(
  latitude: number,
  longitude: number
): Promise<Partial<LocationInfo>> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch address.");
    }

    const data = await response.json();

    return {
      address: data.display_name,
      city:
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        "",
      state: data.address?.state || "",
      country: data.address?.country || "",
    };
  } catch (error) {
    console.error("Reverse geocoding error:", error);

    return {
      address: "Address unavailable",
    };
  }
}

/**
 * Get complete location info
 */
export async function getCurrentLocationInfo(): Promise<LocationInfo> {
  try {
    const coords = await getCurrentCoordinates();

    const addressData = await getAddressFromCoordinates(
      coords.latitude,
      coords.longitude
    );

    return {
      ...coords,
      ...addressData,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Watch user location in real-time
 * Useful for live tracking features
 */
export function watchUserLocation(
  onUpdate: (location: Coordinate) => void,
  onError?: (error: GeolocationPositionError) => void
) {
  if (!navigator.geolocation) {
    throw new Error(
      "Geolocation is not supported by this browser."
    );
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      onUpdate({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
    },
    (error) => {
      console.error("Location watch error:", error);

      if (onError) {
        onError(error);
      }
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    }
  );

  return watchId;
}

/**
 * Stop watching user location
 */
export function stopWatchingLocation(watchId: number) {
  navigator.geolocation.clearWatch(watchId);
}