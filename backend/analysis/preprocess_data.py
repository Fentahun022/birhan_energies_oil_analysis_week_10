import pandas as pd
import numpy as np
import os 

def preprocess_brent_data(file_path='backend/data/BrentOilPrices.csv'):
   
    df = pd.read_csv(file_path)

   
    df['Date'] = pd.to_datetime(df['Date'], format='mixed', dayfirst=True, errors='coerce')
    df.dropna(subset=['Date'], inplace=True)

    df = df.sort_values('Date').reset_index(drop=True)
    df['Price'] = pd.to_numeric(df['Price'], errors='coerce')
   
    df.dropna(subset=['Price'], inplace=True)

    df['Log_Price'] = np.log(df['Price'])
    
    df['Log_Return'] = df['Log_Price'].diff().fillna(0)
    
    return df

if __name__ == '__main__':
   
    output_dir = 'backend/results'
    os.makedirs(output_dir, exist_ok=True)

    processed_df = preprocess_brent_data()
    processed_df.to_json(os.path.join(output_dir, 'oil_price_data_processed.json'), orient='records', date_format='iso')
    print("Brent oil data preprocessed and saved.")