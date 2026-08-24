import os
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def generate_synthetic_dataset(num_samples=2000):
    np.random.seed(42)
    cities = ['Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad']
    localities = {
        'Chennai': ['OMR', 'Velachery', 'Adyar', 'Anna Nagar', 'ECR'],
        'Bangalore': ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Electronic City'],
        'Mumbai': ['Bandra', 'Andheri', 'Powai', 'Worli', 'Juhu'],
        'Delhi': ['Vasant Kunj', 'Dwarka', 'Saket', 'Connaught Place', 'Rohini'],
        'Hyderabad': ['HITECH City', 'Gachibowli', 'Jubilee Hills', 'Banjara Hills', 'Kondapur'],
    }
    property_types = ['Apartment', 'Villa', 'Independent House', 'Commercial Property']

    data = []
    for _ in range(num_samples):
        city = np.random.choice(cities)
        locality = np.random.choice(localities[city])
        p_type = np.random.choice(property_types)
        bedrooms = np.random.randint(1, 6) if p_type != 'Commercial Property' else 0
        bathrooms = max(1, bedrooms + np.random.randint(-1, 2))
        area = np.random.randint(500, 4500)
        age = np.random.randint(0, 25)
        floor = np.random.randint(1, 25)
        amenities_count = np.random.randint(0, 10)
        parking = np.random.choice([0, 1])

        # Base sqft pricing according to city/locality
        base_rate = {
            'Chennai': 5500,
            'Bangalore': 7000,
            'Mumbai': 18000,
            'Delhi': 11000,
            'Hyderabad': 6000,
        }[city]

        if locality in ['Adyar', 'Bandra', 'Jubilee Hills', 'Koramangala', 'Connaught Place']:
            base_rate *= 1.4

        price = area * base_rate
        price += bedrooms * 250000
        price += amenities_count * 50000
        price += parking * 150000
        price -= age * 25000
        price *= np.random.uniform(0.90, 1.10) # Noise factor

        data.append({
            'city': city,
            'locality': locality,
            'propertyType': p_type,
            'bedrooms': bedrooms,
            'bathrooms': bathrooms,
            'area': area,
            'propertyAge': age,
            'floor': floor,
            'amenities_count': amenities_count,
            'parking': parking,
            'price': round(price, -4)
        })

    return pd.DataFrame(data)

def train_and_save_model():
    print("Generating synthetic real estate training dataset...")
    df = generate_synthetic_dataset(2500)

    X = df.drop('price', axis=1)
    y = df['price']

    categorical_features = ['city', 'locality', 'propertyType']
    numerical_features = ['bedrooms', 'bathrooms', 'area', 'propertyAge', 'floor', 'amenities_count', 'parking']

    preprocessor = ColumnTransformer(
        transformers=[
          ('num', StandardScaler(), numerical_features),
          ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ]
    )

    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', GradientBoostingRegressor(n_estimators=150, learning_rate=0.1, max_depth=5, random_state=42))
    ])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Gradient Boosting regression model...")
    model_pipeline.fit(X_train, y_train)

    y_pred = model_pipeline.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print("==================================================")
    print("[+] Model Performance Metrics:")
    print(f"   -> MAE:  Rs.{mae:,.2f}")
    print(f"   -> RMSE: Rs.{rmse:,.2f}")
    print(f"   -> R2 Score: {r2:.4f}")
    print("==================================================")

    os.makedirs('trained_models', exist_ok=True)
    os.makedirs('datasets', exist_ok=True)

    df.to_csv('datasets/real_estate_dataset.csv', index=False)
    joblib.dump(model_pipeline, 'trained_models/price_model.joblib')
    print("Model serialized to trained_models/price_model.joblib")

if __name__ == '__main__':
    train_and_save_model()
