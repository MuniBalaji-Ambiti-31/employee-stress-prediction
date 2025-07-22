import joblib

# Create a cache object
cache = joblib.Memory(location='./cache')

# Define a function to load and cache the model
@cache.cache
def load_model():
    # Load the trained model
    model = joblib.load('../Model/lightgbm.bin')
    return model

# Call the function to load the model and store it in a variable
model = load_model()
