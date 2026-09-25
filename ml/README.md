# LearnX Placement Readiness ML Engine (`/ml`)

## 📌 Overview
The **LearnX Placement Readiness Engine** is an interpretable, supervised Machine Learning system designed to evaluate a student's current Computer Science & Engineering (CSE) academic competency and assessment trajectory. It outputs a **Placement Readiness Score (0–100)** and categorizes readiness across standardized engineering benchmarks.

> ⚠️ **Important Ethical & Technical Notice:**
> - This score represents **learning and placement competency readiness**.
> - It is **NOT** a guarantee of employment, job offer, or campus placement outcome.
> - The training prototype uses a structured, reproducible **synthetic dataset** modeled after real CSE benchmark rubrics. It is explicitly labeled as synthetic for scientific integrity.

---

## 🏗️ Architecture Pipeline

```
Assessment Attempts (MongoDB TestResult)
                   │
                   ▼
┌───────────────────────────────────────┐
│ Feature Extraction Layer              │
│ - 8 Subject Competency Scores (0-100) │
│ - Overall Accuracy & Attempt Volume   │
│ - Improvement Rate & Learning Velocity│
│ - Uniformity/Consistency Score        │
│ - Weak Topic Flag Count               │
└──────────────────┬────────────────────┘
                   │ Feature Vector X ∈ ℝ¹⁴
                   ▼
┌───────────────────────────────────────┐
│ Champion ML Model (v1.0)              │
│ - GradientBoostingRegressor (0-100)   │
│ - Calibrated Ridge & RF Ensembles     │
└──────────────────┬────────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
┌──────────────────┐ ┌───────────────────────┐
│ Explainability   │ │ AI Roadmap Integration │
│ - Top Strengths  │ │ - Feeds Weak Topics   │
│ - Top Weak Gaps  │ │ - Calibrates AI Tutor │
│ - Score Trend    │ │ - Generates 7-Day Plan│
└──────────────────┘ └───────────────────────┘
```

---

## 📊 Dataset Schema (`ml/data/placement_readiness_synthetic.csv`)

| Feature | Type | Range | Description |
|---|---|---|---|
| `dsa` | Float | `10.0 – 100.0` | Data Structures & Algorithms diagnostic score |
| `dbms` | Float | `15.0 – 100.0` | Database Management Systems & SQL score |
| `os` | Float | `15.0 – 100.0` | Operating Systems core concepts score |
| `cn` | Float | `15.0 – 100.0` | Computer Networks & Protocols score |
| `oops` | Float | `20.0 – 100.0` | OOPs, SOLID principles & Design patterns score |
| `system_design` | Float | `10.0 – 100.0` | System Architecture & Scalability score |
| `aptitude` | Float | `20.0 – 100.0` | Quantitative & Logical Reasoning score |
| `web_dev` | Float | `15.0 – 100.0` | Web Architecture, Full-Stack & DevOps score |
| `overall_accuracy`| Float | `0.0 – 100.0` | Mean score across all attempted domains |
| `attempts` | Integer | `1 – 15` | Total number of diagnostic tests completed |
| `improvement_rate`| Float | `-10.0 – +45.0`| Score growth delta between first & latest test |
| `learning_velocity`| Float | `0.5 – 15.0` | Velocity factor (growth rate per attempt) |
| `consistency_score`| Float | `20.0 – 98.0` | Inversely proportional to variance across domains |
| `weak_topic_count`| Integer | `0 – 15` | Number of topics scoring below 60% threshold |
| **`readiness_score`**| **Float** | **`0.0 – 100.0`** | **Target Continuous Placement Readiness Score** |
| **`readiness_category`**| **Integer** | **`0, 1, 2`** | **0: Foundational (<60), 1: Developing (60-77), 2: Ready (≥78)** |

---

## 🚀 How to Retrain the Model

### 1. Set Up Environment
```bash
# From project root:
source ml/venv/bin/activate
```

### 2. Generate Dataset
```bash
python ml/data/generate_dataset.py
```

### 3. Train and Evaluate Models
```bash
python ml/scripts/train_model.py
```

This will automatically evaluate **Ridge Regression**, **Random Forest**, and **Gradient Boosting**, run 5-fold cross-validation, and write genuine metrics to `ml/reports/model_metrics.json`.

### 4. Run CLI Prediction Test
```bash
python ml/scripts/predict.py '{"dsa":84, "dbms":76, "os":72, "cn":68, "oops":82, "system_design":61, "aptitude":88, "web_dev":75, "overall_accuracy":76, "attempts":3, "improvement_rate":12, "learning_velocity":8.2, "consistency_score":74, "weak_topic_count":2}'
```

---

## 🔬 Model Versioning & Deployment
- **Active Model Version**: `v1.0`
- **Champion Estimator**: `GradientBoostingRegressor (n_estimators=150, max_depth=4, lr=0.08)`
- **Backup / Low-Latency Node Runtime**: Standardized Ridge Coefficient Matrix in `ml/models/model_weights.json`
- **Fallback Policy**: If ML runtime is temporarily unreachable, the system fails gracefully using weighted rule-based fallback without interrupting student dashboard access.
