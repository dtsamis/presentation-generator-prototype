import pandas as pd
import random

services = ['credit card activation', 'mortgage application', 'mobile banking app', 'checking account setup', 'customer service call', 'wire transfer', 'auto loan', 'fraud department']
positive_snippets = ['was super easy to navigate', 'went very smoothly', 'was exactly what I needed', 'was very quick', 'saved me a lot of time', 'was handled by a very helpful agent', 'exceeded my expectations']
negative_snippets = ['was incredibly frustrating', 'took way too long to process', 'crashed twice while I was using it', 'resulted in hidden fees I was not told about', 'was very confusing', 'was handled by a rude representative', 'made me want to switch banks']
neutral_snippets = ['was okay', 'went as expected', 'was nothing special', 'was a standard process', 'was fine, I guess', 'took the average amount of time']

data = []
for i in range(1, 1001):
    cust_id = f'CUST-9{i:04d}'
    service = random.choice(services)
    sentiment_type = random.choices(['pos', 'neg', 'neu'], weights=[0.4, 0.4, 0.2])[0]
    
    if sentiment_type == 'pos':
        snippet = random.choice(positive_snippets)
    elif sentiment_type == 'neg':
        snippet = random.choice(negative_snippets)
    else:
        snippet = random.choice(neutral_snippets)
        
    # Add some variation to the phrasing
    phrasings = [
        f'My recent experience with the {service} {snippet}.',
        f'The {service} {snippet}.',
        f'I felt that the {service} {snippet}.',
        f'Regarding the {service}, it {snippet}.'
    ]
    
    data.append({
        'CustomerID': cust_id,
        'Feedback': random.choice(phrasings)
    })

df = pd.DataFrame(data)
df.to_excel('sample_data/bank_feedback_raw.xlsx', index=False)
print('Bank feedback generated.')

