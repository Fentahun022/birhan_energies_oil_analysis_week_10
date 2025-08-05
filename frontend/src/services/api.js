// frontend/src/services/api.js
const API_BASE_URL = '/api'; // Use relative path because of the proxy setting in package.json

export const fetchOilPrices = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/oil_prices`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching oil prices:", error);
        return [];
    }
};

export const fetchChangePoints = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/change_points`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching change points:", error);
        return {}; // Return empty object if single CP, or empty array if multiple expected
    }
};

export const fetchKeyEvents = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/key_events`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching key events:", error);
        return [];
    }
};