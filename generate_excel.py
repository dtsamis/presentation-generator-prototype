import sys, subprocess

try:
    import pandas as pd
    import openpyxl
except ImportError:
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'pandas', 'openpyxl'])
    import pandas as pd

import random, datetime

categories = ['App Experience', 'Customer Service', 'Transaction Speed', 'Account Security', 'Onboarding']
segments = ['Retail', 'Premium', 'Corporate', 'Guest']
locations = ['New York', 'London', 'Tokyo', 'Sao Paulo', 'Berlin', 'Sydney', 'Toronto', 'Singapore']

positive_comments = ['Great app!', 'Super fast transactions', 'Love the new features', 'Support was very helpful', 'Secure and reliable', 'Easy to use', 'Highly recommend']
neutral_comments = ['It is okay', 'Does the job', 'Nothing special', 'Average experience', 'UI is a bit confusing but works', 'Fine for basic needs']
negative_comments = ['App keeps crashing', 'Transaction took too long', 'Support was unhelpful', 'Cannot login to my account', 'Too many bugs', 'Frustrating experience', 'My card was blocked for no reason']

data = []
end_date = datetime.datetime.now()
start_date = end_date - datetime.timedelta(days=365)

for i in range(1, 1001):
    sentiment = random.choices(['Positive', 'Neutral', 'Negative'], weights=[0.5, 0.3, 0.2])[0]
    if sentiment == 'Positive':
        comment = random.choice(positive_comments)
        nps = random.randint(8, 10)
    elif sentiment == 'Neutral':
        comment = random.choice(neutral_comments)
        nps = random.randint(5, 7)
    else:
        comment = random.choice(negative_comments)
        nps = random.randint(1, 4)
        
    random_days = random.randint(0, 365)
    date_obj = start_date + datetime.timedelta(days=random_days, hours=random.randint(0,23), minutes=random.randint(0,59))
    
    data.append({
        'FeedbackID': f'FDB-{20000+i}',
        'CustomerID': f'CUST-{10000 + random.randint(1, 500)}',
        'Date': date_obj.strftime('%Y-%m-%d %H:%M:%S'),
        'Location': random.choice(locations),
        'Segment': random.choice(segments),
        'Category': random.choice(categories),
        'Sentiment': sentiment,
        'NPS_Score': nps,
        'Comment': comment
    })

df = pd.DataFrame(data)
# Sort by date
df = df.sort_values(by='Date', ascending=False)
df.to_excel('sample_data/customer_feedback_large.xlsx', index=False)
print('Generated successfully')

