# Birhan Energies - Brent Oil Price Change Point Analysis

## Project Overview

This project, undertaken as a Data Scientist at Birhan Energies, aims to analyze historical Brent oil prices to detect significant structural changes (change points) and associate them with major geopolitical, economic, and OPEC-related events. The primary goal is to provide data-driven insights that can help investors, analysts, and policymakers better understand and react to the volatile global energy market.

The solution comprises a robust backend for statistical modeling using Bayesian Change Point Analysis (PyMC3) and an interactive frontend dashboard built with Flask and React for intuitive visualization and exploration of the findings.

## Business Objective

The main goal of this analysis is to study how important events affect Brent oil prices. This will focus on finding out how changes in oil prices are linked to big events like political decisions, conflicts in oil-producing regions, global economic sanctions, and changes in Organization of the Petroleum Exporting Countries (OPEC) policies. The aim is to provide clear insights that can help investors, analysts, and policymakers understand and react to these price changes better.

## Key Features

*   **Bayesian Change Point Detection:** Utilizes PyMC3 to identify statistically significant shifts in Brent oil price behavior (e.g., changes in mean and/or volatility).
*   **Event Association:** Links detected change points to a curated list of major historical geopolitical and economic events.
*   **Impact Quantification:** Quantifies the magnitude of price shifts around detected change points (e.g., percentage change in average price or volatility).
*   **Interactive Dashboard:** A user-friendly web application (Flask + React) to visualize historical price trends, detected change points, and the impact of associated events.
*   **Data-Driven Insights:** Provides actionable intelligence to guide investment strategies, policy development, and operational planning in the energy sector.

## Project Structure

The project is organized into two main parts: `backend` (Python) and `frontend` (React.js).

birhan_energies_oil_analysis_week_10/
├── backend/
│ ├── data/
│ │ ├── brent_oil_prices.csv # Raw historical Brent oil price data
│ │ └── key_events.csv # Manually compiled list of geopolitical/economic events
│ │
│ ├── analysis/
│ │ ├── preprocess_data.py # Script to load, clean, and transform oil price data (e.g., to log returns)
│ │ ├── change_point_model.py # Script to implement and run the PyMC3 Bayesian Change Point model
│ │ └── compile_events.py # Helper script to programmatically create key_events.csv
│ │ └── utils.py # (Optional) Helper functions for analysis
│ │
│ ├── results/
│ │ ├── detected_change_points.json # JSON output from change_point_model.py (key CPs, impacts)
│ │ └── oil_price_data_processed.json # JSON output from preprocess_data.py (cleaned data, log returns)
│ │
│ ├── app.py # Flask application: Defines API endpoints to serve data to frontend
│ └── requirements.txt # Python dependencies (Flask, pandas, numpy, pymc, arviz, flask-cors)
│
├── frontend/
│ ├── public/ # Static assets for React app
│ ├── src/ # React source code
│ │ ├── components/ # Reusable React UI components (charts, filters)
│ │ ├── services/ # Functions for API calls to Flask backend
│ │ └── styles/ # CSS files
│ ├── package.json # Node.js dependencies (react, recharts)
│
├── .gitignore # Specifies files/directories to ignore in Git
└── README.md # Project documentation (this file)

## Data

The primary dataset for this analysis is `brent_oil_prices.csv`, containing daily Brent oil prices from May 20, 1987, to September 30, 2022. It includes two fields:
*   `Date`: The date of the recorded price (e.g., '20-May-87', 'Apr 22, 2020').
*   `Price`: The Brent oil price in USD per barrel.

A supplementary dataset, `key_events.csv`, is **manually compiled** and contains approximately 10-15 key geopolitical, economic, and OPEC-related events with their approximate start dates and descriptions.

## Learning Outcomes Covered

This project emphasizes the application of several key skills and knowledge areas:

*   **Skills:** Change Point Analysis & Interpretation, Statistical Reasoning, Bayesian Modelling (PyMC3), Analytical Storytelling with Data.
*   **Knowledge:** Probability distributions, Bayesian inference, Monte Carlo Markov Chain (MCMC), Model comparison, Policy analysis.
*   **Communication:** Reporting to stakeholders via reports and interactive dashboards.

## Setup and Installation

Follow these steps to set up and run the project locally.

### Prerequisites

*   Python 3.8+
*   Node.js and npm (or yarn)
*   Git

### 1. Clone the Repository

```bash
git clone https://github.com/Fentahun022/birhan_energies_oil_analysis_week_10.git
cd birhan_energies_oil_analysis_week_10

cd backend

# Create and activate a Python virtual environment
python3 -m venv venv
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt

