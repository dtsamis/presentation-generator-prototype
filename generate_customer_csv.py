import csv, random, datetime

with open('sample_data/customer_analysis.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['CustomerID', 'Segment', 'BehaviorScore', 'LevelOfTrust', 'TransactionsVolume', 'TotalValue', 'Status', 'LastActive'])
    segments = ['Retail', 'Premium', 'Corporate', 'Guest']
    trust_levels = ['High', 'Medium', 'Low', 'Untrusted']
    statuses = ['Active', 'Suspended', 'Flagged', 'Under Review']
    for i in range(1, 100):
        writer.writerow([
            f'CUST-{10000+i}',
            random.choice(segments),
            random.randint(10, 100),
            random.choice(trust_levels),
            random.randint(1, 500),
            round(random.uniform(50.0, 25000.0), 2),
            random.choice(statuses),
            datetime.datetime.now().isoformat()
        ])

