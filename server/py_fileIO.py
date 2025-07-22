from pyexpat import model
import pandas as pd
import json
import sys
import model
import joblib as jb

obj_data = json.loads(sys.argv[1])
#print(sys.argv)
# load the trained model

# convert the dictionary to a pandas DataFrame
input_df = pd.DataFrame([obj_data])

# convert categorical variables to numerical
input_df['Gender'] = input_df['Gender'].map({'Male': 1, 'Female': 0})
input_df['Company Type'] = input_df['Company Type'].map({'Service': 0, 'Product': 1})
input_df['WFH Setup Available'] = input_df['WFH Setup Available'].map({'Yes': 0, 'No': 1})
'''input_df['RemoteWorkSatistfaction'] = input_df['RemoteWorkSatistfaction'].map({'Low':1,'Medium':2,'High':3,'Very High':4})
input_df['IsIndividualContributor'] = input_df['IsIndividualContributor'].map({'Yes':1,'No':1})
input_df['MaritalStatus'] = input_df['MaritalStatus'].map({'Single':1,'Divorced':2,'Married':3})'''
# make predictions on the new data point
y_pred = model.model.predict(input_df)
print(y_pred[0].round(2))
