"""
LearnX Placement Readiness Python Inference CLI
==============================================
Runs inference using the serialized GradientBoosting / Scikit-Learn champion model.
Accepts student feature vector in JSON format via argument or stdin and returns JSON.
"""

import sys
import os
import json
import numpy as np
import pandas as pd
import joblib

FEATURE_COLS = [
    "dsa", "dbms", "os", "cn", "oops", "system_design",
    "aptitude", "web_dev", "overall_accuracy", "attempts",
    "improvement_rate", "learning_velocity", "consistency_score",
    "weak_topic_count"
]

def load_champion_model():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, "..", "models", "placement_readiness_model.joblib")
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}. Run train_model.py first.")
    return joblib.load(model_path)

def predict_readiness(features_dict):
    model = load_champion_model()
    
    # Fill defaults for missing features
    row = {col: float(features_dict.get(col, 50.0)) for col in FEATURE_COLS}
    df = pd.DataFrame([row])[FEATURE_COLS]
    
    pred_score = float(model.predict(df)[0])
    pred_score = round(max(0.0, min(100.0, pred_score)), 1)
    
    # Classify Tier
    if pred_score >= 85.0:
        tier = "Tier-1 Product Company Ready (85%+)"
    elif pred_score >= 72.0:
        tier = "Product & FinTech Ready (72-84%)"
    elif pred_score >= 58.0:
        tier = "IT Services & Digital Tier Ready (58-71%)"
    else:
        tier = "Foundational Stage (<58%)"
        
    return {
        "readinessScore": pred_score,
        "readinessTier": tier,
        "modelVersion": "v1.0",
        "featuresUsed": row
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        raw_json = sys.argv[1]
    else:
        raw_json = sys.stdin.read()
        
    try:
        data = json.loads(raw_json)
        res = predict_readiness(data)
        print(json.dumps(res, indent=2))
    except Exception as e:
        print(json.dumps({"error": str(e), "status": "failed"}))
        sys.exit(1)
