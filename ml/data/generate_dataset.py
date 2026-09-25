"""
LearnX Placement Readiness Synthetic Dataset Generator
======================================================
Generates a realistic, reproducible, and clearly-labeled synthetic dataset
for training and evaluating the LearnX Placement Readiness Machine Learning Engine.

DISCLAIMER:
This dataset is synthetically generated using domain-weighted assessment models,
learning curves, and competency correlations for prototype & model development.
It does NOT represent real student placement outcomes or guarantee employment.
"""

import os
import numpy as np
import pandas as pd

def generate_synthetic_placement_data(num_samples=2500, random_state=42):
    np.random.seed(random_state)

    # 1. Base academic aptitude distribution (latent student ability factor)
    latent_ability = np.random.beta(a=3.5, b=2.5, size=num_samples) # Scale 0 to 1, mean ~0.58

    # 2. Subject Scores (0 to 100) correlated with latent ability + realistic subject-specific variance
    dsa = np.clip(latent_ability * 85 + np.random.normal(loc=5, scale=12, size=num_samples), 10, 100)
    dbms = np.clip(latent_ability * 82 + np.random.normal(loc=8, scale=11, size=num_samples), 15, 100)
    os = np.clip(latent_ability * 80 + np.random.normal(loc=8, scale=12, size=num_samples), 15, 100)
    cn = np.clip(latent_ability * 78 + np.random.normal(loc=10, scale=13, size=num_samples), 15, 100)
    oops = np.clip(latent_ability * 84 + np.random.normal(loc=6, scale=10, size=num_samples), 20, 100)
    system_design = np.clip(latent_ability * 75 + np.random.normal(loc=5, scale=14, size=num_samples), 10, 100)
    aptitude = np.clip(latent_ability * 88 + np.random.normal(loc=4, scale=10, size=num_samples), 20, 100)
    web_dev = np.clip(latent_ability * 82 + np.random.normal(loc=7, scale=12, size=num_samples), 15, 100)

    # Round scores to 1 decimal place
    dsa = np.round(dsa, 1)
    dbms = np.round(dbms, 1)
    os = np.round(os, 1)
    cn = np.round(cn, 1)
    oops = np.round(oops, 1)
    system_design = np.round(system_design, 1)
    aptitude = np.round(aptitude, 1)
    web_dev = np.round(web_dev, 1)

    # 3. Assessment Behavioral Features
    attempts = np.random.geometric(p=0.25, size=num_samples) # 1 to ~15 attempts
    attempts = np.clip(attempts, 1, 15)

    # Overall Accuracy: weighted average across primary subjects
    subject_matrix = np.column_stack([dsa, dbms, os, cn, oops, system_design, aptitude, web_dev])
    overall_accuracy = np.round(np.mean(subject_matrix, axis=1), 1)

    # Improvement rate: students with more attempts show non-linear mastery growth
    base_growth = (attempts - 1) * np.random.uniform(1.5, 4.0, size=num_samples)
    improvement_rate = np.round(np.clip(base_growth - np.random.uniform(0, 5, size=num_samples), -10, 45), 1)

    # Learning velocity: rate of competency acquisition per assessment attempt
    learning_velocity = np.round(np.clip((improvement_rate + 15) / (attempts + 1) * 1.8 + latent_ability * 4.0, 0.5, 15.0), 1)

    # Consistency score: inversely proportional to standard deviation across subject scores
    subject_std = np.std(subject_matrix, axis=1)
    consistency_score = np.round(np.clip(100 - (subject_std * 3.2), 20, 98), 1)

    # Weak topic count (<60% score in domain)
    weak_topic_count = np.sum(subject_matrix < 60, axis=1)

    # 4. Placement Readiness Ground Truth Calculation (Formulated Ground Truth for Regression)
    # Weights reflecting standard technical placement competencies:
    # DSA (25%), System Design (15%), DBMS (15%), OS (10%), CN (10%), OOPs (10%), Aptitude (10%), WebDev (5%)
    domain_weighted_score = (
        dsa * 0.25 +
        system_design * 0.15 +
        dbms * 0.15 +
        os * 0.10 +
        cn * 0.10 +
        oops * 0.10 +
        aptitude * 0.10 +
        web_dev * 0.05
    )

    # Behavioral bonus/penalty adjustments
    velocity_bonus = np.clip(learning_velocity * 0.8, 0, 8)
    consistency_bonus = (consistency_score - 50) * 0.08
    attempt_bonus = np.log1p(attempts) * 2.2
    weak_penalty = weak_topic_count * 1.8

    # Realistic measurement noise (Gaussian with std=2.0)
    noise = np.random.normal(loc=0, scale=2.0, size=num_samples)

    raw_readiness = domain_weighted_score + velocity_bonus + consistency_bonus + attempt_bonus - weak_penalty + noise
    readiness_score = np.round(np.clip(raw_readiness, 0, 100), 1)

    # 5. Categorical readiness labels:
    # 0 = "Foundational Stage" (<60)
    # 1 = "Developing Readiness" (60 to 77.9)
    # 2 = "Placement Ready" (>=78)
    readiness_category = np.where(readiness_score >= 78, 2, np.where(readiness_score >= 60, 1, 0))

    df = pd.DataFrame({
        "dsa": dsa,
        "dbms": dbms,
        "os": os,
        "cn": cn,
        "oops": oops,
        "system_design": system_design,
        "aptitude": aptitude,
        "web_dev": web_dev,
        "overall_accuracy": overall_accuracy,
        "attempts": attempts,
        "improvement_rate": improvement_rate,
        "learning_velocity": learning_velocity,
        "consistency_score": consistency_score,
        "weak_topic_count": weak_topic_count,
        "readiness_score": readiness_score,
        "readiness_category": readiness_category,
    })

    return df

if __name__ == "__main__":
    output_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "placement_readiness_synthetic.csv")

    df = generate_synthetic_placement_data(num_samples=2500, random_state=42)
    df.to_csv(output_path, index=False)
    print(f"✅ Generated {len(df)} synthetic records saved to: {output_path}")
    print("\nDataset Summary Statistics:")
    print(df.describe().T[["mean", "std", "min", "50%", "max"]])
