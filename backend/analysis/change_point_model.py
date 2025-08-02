
import pandas as pd
import numpy as np
import pymc as pm
import arviz as az
import json

def run_change_point_analysis(data_path='backend/results/oil_price_data_processed.json'):
    df = pd.read_json(data_path, convert_dates=['Date'])
    log_returns = df['Log_Return'].values[1:] # Exclude the first NaN after diff()

    with pm.Model() as change_point_model:
        tau = pm.DiscreteUniform("tau", lower=0, upper=len(log_returns) - 1)
        
        # Parameters for mean of log returns
        mu_before = pm.Normal("mu_before", mu=0, sigma=0.1) # Log returns often center around 0
        mu_after = pm.Normal("mu_after", mu=0, sigma=0.1)

        # Parameters for volatility (standard deviation of log returns)
        sigma_before = pm.HalfNormal("sigma_before", sigma=0.1)
        sigma_after = pm.HalfNormal("sigma_after", sigma=0.1)

        idx = np.arange(len(log_returns))
        
        current_mu = pm.math.switch(idx < tau, mu_before, mu_after)
        current_sigma = pm.math.switch(idx < tau, sigma_before, sigma_after)

        observation = pm.Normal("observation", mu=current_mu, sigma=current_sigma, observed=log_returns)

        trace = pm.sample(2000, tune=1000, cores=2, random_seed=42, return_inferencedata=True)

    # Process results for JSON output
    tau_index = int(trace.posterior["tau"].mean().item())
    
    # Map index back to date (account for original data's first row, if log_returns skipped it)
    # Adjust index mapping based on how you handled the first log_return NaN
    change_point_date = df['Date'].iloc[tau_index + 1].strftime('%Y-%m-%d') # +1 if log_returns starts from 2nd day

    mu_before_val = trace.posterior["mu_before"].mean().item()
    mu_after_val = trace.posterior["mu_after"].mean().item()
    sigma_before_val = trace.posterior["sigma_before"].mean().item()
    sigma_after_val = trace.posterior["sigma_after"].mean().item()

    # For log returns, a change in mean log return means a change in average growth factor.
    # Convert back to approximate percentage change for interpretability
    avg_daily_change_before = (np.exp(mu_before_val) - 1) * 100
    avg_daily_change_after = (np.exp(mu_after_val) - 1) * 100

    # Quantify volatility change
    volatility_change_percent = ((sigma_after_val - sigma_before_val) / sigma_before_val) * 100

    results = {
        "change_point_date": change_point_date,
        "mean_log_return_before": f"{avg_daily_change_before:.4f}%",
        "mean_log_return_after": f"{avg_daily_change_after:.4f}%",
        "volatility_before": f"{sigma_before_val:.4f}",
        "volatility_after": f"{sigma_after_val:.4f}",
        "volatility_change_percent": f"{volatility_change_percent:.2f}%",
        # You would add code to associate with key_events.csv here
        "associated_event_hypothesis": "Research key_events.csv around this date for a hypothesis.",
        "prob_mean_increase": (trace.posterior["mu_after"] > trace.posterior["mu_before"]).mean().item(),
        "prob_vol_increase": (trace.posterior["sigma_after"] > trace.posterior["sigma_before"]).mean().item()
    }
    
    with open('backend/results/detected_change_points.json', 'w') as f:
        json.dump(results, f, indent=4)
    print("Change point analysis complete and results saved.")

if __name__ == '__main__':
    run_change_point_analysis()