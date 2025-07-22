\# Employee Stress Prediction



A machine‑learning pipeline that predicts employee stress levels from workplace and personal factors using LightGBM.



---



\## 🚀 Table of Contents



1\. \[Overview](#overview)  

2\. \[Features](#features)  

3\. \[Project Structure](#project-structure)  

4\. \[Installation](#installation)  

5\. \[Usage](#usage)  

6\. \[Configuration](#configuration)  

7\. \[Model Training \& Evaluation](#model-training--evaluation)  

8\. \[Prediction on New Data](#prediction-on-new-data)  

9\. \[Contributing](#contributing)  

10\. \[License](#license)  



---



\## 📝 Overview



Workplace stress is a critical factor affecting employee well‑being and organizational productivity. This project implements a LightGBM‑based classifier to predict stress levels from features such as:



\- \*\*Demographics:\*\* Gender, Age, Marital Status  

\- \*\*Work Environment:\*\* Company Type, WFH Setup, Resource Allocation  

\- \*\*Job Role:\*\* Designation, Daily Work Hours  

\- \*\*Personal Metrics:\*\* Mental Fatigue Score, Job Satisfaction  



---



\## ✨ Features



\- \*\*Data Preprocessing\*\*  

&nbsp; - Handles missing values  

&nbsp; - Encodes categorical variables (one‑hot / label encoding)  

&nbsp; - Scales numerical features  



\- \*\*Model Training\*\*  

&nbsp; - LightGBM classifier with hyperparameter tuning  

&nbsp; - k‑fold cross‑validation for robust performance estimates  



\- \*\*Evaluation\*\*  

&nbsp; - Accuracy, Precision, Recall, F1‑score  

&nbsp; - Confusion matrix visualization  



\- \*\*Prediction API\*\*  

&nbsp; - `predict.py` reads JSON input and returns stress prediction  



---



\## 📂 Project Structure



```

employee-stress-prediction/

├── data/

│   ├── raw/                 # Original datasets (not tracked)

│   └── processed/           # Cleaned \& feature‑engineered CSVs

│

├── notebooks/               # Exploratory analysis \& modeling experiments

│

├── src/                     # Core scripts \& modules

│   ├── config.py            # Configuration (paths, hyperparams)

│   ├── data\_preprocessing.py

│   ├── train\_model.py

│   ├── predict.py

│   └── utils.py             # Helper functions

│

├── requirements.txt         # Python dependencies

├── .gitignore

└── README.md

```



---



\## ⚙️ Installation



1\. \*\*Clone the repo\*\*  

&nbsp;  ```bash

&nbsp;  git clone https://github.com/<YourUsername>/employee-stress-prediction.git

&nbsp;  cd employee-stress-prediction

&nbsp;  ```



2\. \*\*Create \& activate a virtual environment\*\*  

&nbsp;  ```bash

&nbsp;  python -m venv venv

&nbsp;  # macOS/Linux

&nbsp;  source venv/bin/activate

&nbsp;  # Windows PowerShell

&nbsp;  .\\venv\\Scripts\\activate

&nbsp;  ```



3\. \*\*Install dependencies\*\*  

&nbsp;  ```bash

&nbsp;  pip install --upgrade pip

&nbsp;  pip install -r requirements.txt

&nbsp;  ```



---



\## ▶️ Usage



\### 1. Train the model  

```bash

python src/train\_model.py \\

&nbsp; --config src/config.py \\

&nbsp; --data-dir data/processed \\

&nbsp; --output-dir models/

```



\### 2. Evaluate performance  

```bash

python src/train\_model.py --evaluate \\

&nbsp; --model-path models/lgbm\_best.pkl \\

&nbsp; --test-data data/processed/test.csv

```



\### 3. Predict on new samples  

```bash

python src/predict.py \\

&nbsp; --model-path models/lgbm\_best.pkl \\

&nbsp; --input-json '{"Gender":"Male","Company Type":"Service","WFH Setup Available":"Yes","Designation":3,"Resource Allocation":4,"Mental Fatigue Score":8}'

```



---



\## 🔧 Configuration



Edit `src/config.py` to adjust:



\- Train/test split ratios  

\- LightGBM hyperparameters  

\- Paths to data, models, and output artifacts  



---



\## 📈 Model Training \& Evaluation



\- Uses \*\*LightGBM\*\* with early stopping and grid search  

\- Performance metrics logged to `logs/` and visualized in `notebooks/`  

\- Example results:  

&nbsp; - Accuracy: 87.2%  

&nbsp; - F1‑score: 0.84  



---



\## 🖥️ Prediction on New Data



The `predict.py` script accepts a JSON string and outputs:



```json

{ "stress\_level": "High", "probability": 0.91 }

```



Use it to integrate into web apps, dashboards, or downstream systems.



---



\## 🤝 Contributing



1\. Fork the repo  

2\. Create a feature branch: `git checkout -b feature/YourFeature`  

3\. Commit your changes: `git commit -m "Add YourFeature"`  

4\. Push to your branch: `git push origin feature/YourFeature`  

5\. Open a Pull Request  



Please follow the \[Code of Conduct](CODE\_OF\_CONDUCT.md) and \[Contributing Guidelines](CONTRIBUTING.md).



---



\## 📄 License



This project is licensed under the \*\*MIT License\*\* — see the \[LICENSE](LICENSE) file for details.



