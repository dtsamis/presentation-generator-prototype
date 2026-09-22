import csv, random, datetime

# 1. Fraud Transactions
with open('sample_data/fraud_transactions.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['TransactionID', 'Timestamp', 'AccountID', 'Amount', 'Location', 'DeviceType', 'Status', 'RiskScore'])
    locations = ['US', 'UK', 'NG', 'RU', 'CN', 'BR', 'JP']
    for i in range(1, 60):
        writer.writerow([
            f'TRX-{10000+i}', 
            datetime.datetime.now().isoformat(), 
            f'ACC-{random.randint(100, 999)}', 
            round(random.uniform(10.0, 5000.0), 2), 
            random.choice(locations), 
            random.choice(['Mobile', 'Desktop', 'Tablet', 'Unknown']), 
            random.choice(['Approved', 'Blocked', 'Flagged']),
            random.randint(1, 99)
        ])

# 2. Processing Bottlenecks
with open('sample_data/processing_bottlenecks.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['ProcessID', 'StepName', 'StartTime', 'EndTime', 'DurationSeconds', 'AssignedTo', 'Status'])
    steps = ['DataEntry', 'Review', 'Approval', 'Fulfillment', 'Audit']
    for i in range(1, 60):
        writer.writerow([
            f'PRC-{5000+i}', 
            random.choice(steps), 
            '2026-09-22T08:00:00Z', 
            '2026-09-22T08:45:00Z', 
            random.randint(300, 7200), 
            f'User_{random.randint(1,20)}', 
            random.choice(['Completed', 'Delayed', 'Failed'])
        ])

# 3. Risk Assessments
with open('sample_data/risk_assessments.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['RiskID', 'Category', 'Description', 'Likelihood', 'Impact', 'MitigationStatus', 'Owner'])
    categories = ['Cyber', 'Operational', 'Financial', 'Strategic', 'Compliance']
    for i in range(1, 60):
        writer.writerow([
            f'RSK-{8000+i}', 
            random.choice(categories), 
            f'Sample risk description for {random.choice(categories).lower()} vulnerability', 
            random.choice(['High', 'Medium', 'Low']), 
            random.choice(['High', 'Medium', 'Low']), 
            random.choice(['Open', 'In Progress', 'Mitigated']),
            f'Dept_{random.randint(1,5)}'
        ])

