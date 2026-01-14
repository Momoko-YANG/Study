# Post-processing & Submission
import os
import pandas as pd
import numpy as np
from sklearn.metrics import r2_score
from common_defs import TEST_CSV, DEBUG_MODE

def weighted_r2_score(y_true, y_pred, weights):
    """Calculates weighted R2 score matching competition metric."""
    y_true = np.array(y_true, dtype=float)
    y_pred = np.array(y_pred, dtype=float)
    weights = np.array(weights, dtype=float)
    y_weighted_mean = np.sum(y_true * weights) / np.sum(weights)
    ss_res = np.sum(weights * (y_true - y_pred)**2)
    ss_tot = np.sum(weights * (y_true - y_weighted_mean) ** 2)
    if ss_tot == 0: return 0.0
    return 1-(ss_res / ss_tot)

def creat_submission():
    print("[Step 3] Post-Processing & Validation...")

    if not os.path.exists('interim_biomass.csv'): raise FileNotFoundError("Run Step 2 first.")
    biomass_df = pd.read_csv('interim_biomass.csv')

    print("Applying consistency scaling & strict post-processing...")
    scale_df = biomass_df.copy()

    # --- Aggressive Post-Processing Strategy ---
    target_cols = ['pred_Total', 'pred_Green', 'pred_Dead', 'pred_Clover']

    # 1. Clip negative values
    for c in target_cols:
        scale_df[c] = scale_df[c].clip(lower=0.0)

    # 2. Noise Removal: Zero out very low biomass predictions
    mask_low_total = scale_df['pred_Total'] < 0.5
    scale_df.loc[mask_low_total, target_cols] = 0.0

    # 3. Component Ratio Thresholding
    #    If a component contributes < 1% to total, treat as noise
    for c in ['pred_Green', 'pred_Dead', 'pred_Clover']:
        ratio = scale_df[c] / (scale_df['pred_Total'] + 1e-6)
        scale_df.loc[ratio < 0.01, c] = 0.0

    # 4. Consistency Scaling: Re-distribute to match Total exactly
    sum_comp = scale_df['pred_Green'] + scale_df['pred_Dead'] + scale_df['pred_Clover']
    factor = scale_df['pred_Total'] / (sum_comp + 1e-6)

    scale_df['Final_Green'] = scale_df['pred_Green'] * factor
    scale_df['Final_Dead'] = scale_df['pred_Dead'] * factor
    scale_df['Final_Clover'] = scale_df['pred_Clover'] * factor
    scale_df['Final_GDM'] = scale_df['Final_Green'] + scale_df['Final_Clover']
    scale_df['Final_Total'] = scale_df['pred_Total']

    # --- Debug Validation ---
    if DEBUG_MODE:
        print("\n [Final Validation Score (Weighted R2)]")
        required_gt = ['Dry_Green_g', 'Dry_Dead_g', 'Dry_Clover_g', 'Dry_Total_g']
        if all(c in scale_df.columns for c in required_gt):
            scale_df['GT_GDM_g'] = scale_df['Dry_Green_g'] + scale_df['Dry_Clover_g']
            y_t_all, y_p_all, w_all = [], [], []
            