import React, { useEffect, useState, useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, ReferenceLine
} from 'recharts';
import { fetchOilPrices, fetchChangePoints, fetchKeyEvents } from '../services/api';

const PriceChart = () => {
    const [rawOilData, setRawOilData] = useState([]); // Store raw fetched data
    const [changePoint, setChangePoint] = useState(null);
    const [keyEvents, setKeyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for date range filtering
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    // State for event type filtering
    const [selectedEventTypes, setSelectedEventTypes] = useState([]);
    const [uniqueEventTypes, setUniqueEventTypes] = useState([]);


    useEffect(() => {
        const loadAllData = async () => {
            try {
                setLoading(true);
                const oil = await fetchOilPrices();
                const cp = await fetchChangePoints();
                const events = await fetchKeyEvents();

                setRawOilData(oil); // Store raw data for filtering
                setChangePoint(cp);
                setKeyEvents(events);
                
                // Extract unique event types for filtering options
                const types = [...new Set(events.map(e => e.EventType))].sort();
                setUniqueEventTypes(types);
                setSelectedEventTypes(types); // Select all by default

                // Initialize date range to the full extent of the data
                if (oil.length > 0) {
                    const firstDate = new Date(oil[0].Date);
                    const lastDate = new Date(oil[oil.length - 1].Date);
                    setStartDate(firstDate.toISOString().split('T')[0]); // YYYY-MM-DD format
                    setEndDate(lastDate.toISOString().split('T')[0]);
                }

                setLoading(false);
            } catch (err) {
                setError("Failed to load data. Please ensure backend is running and data files exist.");
                console.error("Dashboard data load error:", err);
                setLoading(false);
            }
        };

        loadAllData();
    }, []);

    // Memoize filtered data to prevent unnecessary recalculations
    const filteredOilData = useMemo(() => {
        if (!rawOilData.length || !startDate || !endDate) return [];

        const startDt = new Date(startDate);
        const endDt = new Date(endDate);

        return rawOilData
            .filter(d => {
                const dataDate = new Date(d.Date);
                return dataDate >= startDt && dataDate <= endDt;
            })
            .map(d => ({
                ...d,
                // Reformat date strings for XAxis ticks and tooltips ONLY after filtering
                Date: new Date(d.Date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            }));
    }, [rawOilData, startDate, endDate]);


    // Helper to get formatted date string for ReferenceLine
    const getFormattedDate = (isoDateString) => {
        return new Date(isoDateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // Handler for event type checkboxes
    const handleEventTypeChange = (e) => {
        const type = e.target.value;
        setSelectedEventTypes(prevTypes =>
            e.target.checked ? [...prevTypes, type] : prevTypes.filter(t => t !== type)
        );
    };

    // Handler for resetting date range
    const resetDateRange = () => {
        if (rawOilData.length > 0) {
            const firstDate = new Date(rawOilData[0].Date);
            const lastDate = new Date(rawOilData[rawOilData.length - 1].Date);
            setStartDate(firstDate.toISOString().split('T')[0]);
            setEndDate(lastDate.toISOString().split('T')[0]);
        }
    };

    if (loading) return <div className="dashboard-message">Loading data...</div>;
    if (error) return <div className="dashboard-error">{error}</div>;
    if (!rawOilData.length) return <div className="dashboard-message">No oil price data available. Please ensure `brent_oil_prices.csv` is in `backend/data/` and analysis scripts are run.</div>;

    return (
        <div className="price-chart-container card">
            <h2>Brent Oil Price History & Change Point Analysis</h2>

            {/* Date Range Controls */}
            <div className="date-range-controls">
                <label htmlFor="startDate">Start Date:</label>
                <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={endDate} // Prevent start date after end date
                />
                <label htmlFor="endDate">End Date:</label>
                <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate} // Prevent end date before start date
                />
                <button onClick={resetDateRange} className="reset-button">Reset Date Range</button>
            </div>

            {/* Event Type Filter Controls */}
            <div className="event-filter-controls">
                <h3>Filter Events:</h3>
                <div className="checkbox-group">
                    {uniqueEventTypes.map(type => (
                        <label key={type} className="checkbox-label">
                            <input
                                type="checkbox"
                                value={type}
                                checked={selectedEventTypes.includes(type)}
                                onChange={handleEventTypeChange}
                            />
                            {type.replace(/_/g, ' ')}
                        </label>
                    ))}
                </div>
            </div>


            <ResponsiveContainer width="100%" height={450}>
                <LineChart
                    data={filteredOilData} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Date" angle={-45} textAnchor="end" height={80} interval="preserveStartEnd" />
                    <YAxis dataKey="Price" label={{ value: 'Price (USD/barrel)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Price" stroke="#8884d8" name="Brent Oil Price" dot={false} />
                    
                    {/* Change Point Reference Line - Only render if within selected date range */}
                    {changePoint && changePoint.change_point_date &&
                     new Date(changePoint.change_point_date) >= new Date(startDate) &&
                     new Date(changePoint.change_point_date) <= new Date(endDate) && (
                        <ReferenceLine
                            x={getFormattedDate(changePoint.change_point_date)}
                            stroke="red"
                            strokeDasharray="5 5"
                            label={{ value: 'Detected Change Point', position: 'top', fill: 'red', fontSize: 12 }}
                        />
                    )}

                    {/* Key Events Reference Lines - Only render if within selected date range AND selected type */}
                    {keyEvents.map((event, index) => {
                        const eventDate = new Date(event.EventDate);
                        const isVisible = eventDate >= new Date(startDate) &&
                                          eventDate <= new Date(endDate) &&
                                          selectedEventTypes.includes(event.EventType);
                        
                        if (isVisible) {
                            return (
                                <ReferenceLine
                                    key={index}
                                    x={getFormattedDate(event.EventDate)}
                                    stroke="green"
                                    strokeDasharray="3 3"
                                    label={{ value: event.EventDescription.substring(0, 20) + '...', position: 'insideTop', fill: 'green', fontSize: 10 }}
                                />
                            );
                        }
                        return null; // Don't render if outside date range or not selected type
                    })}

                </LineChart>
            </ResponsiveContainer>

            {changePoint && (
                <div className="change-point-summary card">
                    <h3>Summary of Detected Change Point:</h3>
                    <p><strong>Date of Change:</strong> {changePoint.change_point_date}</p>
                    <p><strong>Average Daily Growth (Before):</strong> {changePoint.mean_log_return_before_percent}</p>
                    <p><strong>Average Daily Growth (After):</strong> {changePoint.mean_log_return_after_percent}</p>
                    <p><strong>Volatility (Std Dev) Before:</strong> {changePoint.volatility_before}</p>
                    <p><strong>Volatility (Std Dev) After:</strong> {changePoint.volatility_after}</p>
                    <p><strong>Volatility Change:</strong> {changePoint.volatility_change_percent}</p>
                    <p><strong>Probability Mean Increased:</strong> {changePoint.prob_mean_increase_percent}</p>
                    <p><strong>Probability Volatility Increased:</strong> {changePoint.prob_vol_increase_percent}</p>
                    <p><strong>Associated Event Hypothesis:</strong> {changePoint.associated_event_hypothesis}</p>
                </div>
            )}

            <div className="key-events-list card">
                <h3>Key Events Timeline:</h3>
                <ul>
                    {keyEvents.map((event, index) => (
                        <li key={index}>
                            <strong>{event.EventDate} ({event.EventType.replace(/_/g, ' ')}):</strong> {event.EventDescription} - *{event.ImpactType.replace(/_/g, ' ')}*
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PriceChart;