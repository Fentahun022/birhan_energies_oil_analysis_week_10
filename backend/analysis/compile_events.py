import pandas as pd
import os

def compile_key_events():
 
    events_data = [
        {"EventDate": "1990-08-02", "EventType": "Geopolitical", "EventDescription": "Iraq invades Kuwait (Gulf War begins)", "ImpactType": "Supply_Shock_Price_Surge"},
        {"EventDate": "1997-07-02", "EventType": "Economic", "EventDescription": "Asian Financial Crisis begins", "ImpactType": "Demand_Shock_Price_Decrease"},
        {"EventDate": "2001-09-11", "EventType": "Geopolitical", "EventDescription": "September 11 Attacks", "ImpactType": "Volatility_Increase_Temporary_Fall"},
        {"EventDate": "2008-09-15", "EventType": "Economic", "EventDescription": "Lehman Brothers Collapse (Global Financial Crisis)", "ImpactType": "Demand_Shock_Price_Collapse"},
        {"EventDate": "2014-06-01", "EventType": "Supply", "EventDescription": "US Shale Boom / OPEC Production Stance", "ImpactType": "Oversupply_Price_Decrease"},
        {"EventDate": "2015-07-14", "EventType": "Political", "EventDescription": "Iran Nuclear Deal (JCPOA) Signed", "ImpactType": "Potential_Supply_Increase"},
        {"EventDate": "2016-02-11", "EventType": "Economic", "EventDescription": "Global Economic Slowdown Concerns / Oversupply", "ImpactType": "Price_Low"},
        {"EventDate": "2016-11-30", "EventType": "OPEC", "EventDescription": "OPEC+ agrees to production cuts", "ImpactType": "Price_Support"},
        {"EventDate": "2018-05-08", "EventType": "Political", "EventDescription": "US withdraws from Iran Nuclear Deal (sanctions reimposed)", "ImpactType": "Supply_Concerns_Price_Rise"},
        {"EventDate": "2018-10-01", "EventType": "Economic", "EventDescription": "US-China Trade War Escalates", "ImpactType": "Demand_Concerns_Price_Decrease"},
        {"EventDate": "2019-09-14", "EventType": "Geopolitical", "EventDescription": "Attacks on Saudi Aramco Facilities", "ImpactType": "Supply_Shock_Temporary_Spike"},
        {"EventDate": "2020-03-08", "EventType": "Pandemic", "EventDescription": "COVID-19 Outbreak & Global Lockdowns", "ImpactType": "Demand_Shock_Price_Collapse"},
        {"EventDate": "2020-04-20", "EventType": "Market_Anomaly", "EventDescription": "WTI Futures go Negative (Extreme Demand Collapse)", "ImpactType": "Extreme_Price_Collapse"},
        {"EventDate": "2022-02-24", "EventType": "Geopolitical", "EventDescription": "Russia-Ukraine War Begins", "ImpactType": "Supply_Shock_Price_Surge"},
        {"EventDate": "2022-06-01", "EventType": "Economic", "EventDescription": "Global Recession Fears / Central Bank Rate Hikes", "ImpactType": "Demand_Concerns_Price_Decrease"},
        {"EventDate": "2022-09-05", "EventType": "OPEC", "EventDescription": "OPEC+ announces modest production cut", "ImpactType": "Supply_Tightening_Price_Support"},
    ]


    events_df = pd.DataFrame(events_data)

   
    events_df['EventDate'] = pd.to_datetime(events_df['EventDate']).dt.strftime('%Y-%m-%d')

    
    output_dir = 'backend/data/'
    output_file = os.path.join(output_dir, 'key_events.csv')


    os.makedirs(output_dir, exist_ok=True)


    events_df.to_csv(output_file, index=False)
    print(f"Key events compiled and saved to {output_file}")

if __name__ == "__main__":
    compile_key_events()