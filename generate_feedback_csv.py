import csv, random, datetime

with open('sample_data/customer_feedback.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['FeedbackID', 'CustomerID', 'Date', 'Category', 'Sentiment', 'NPS_Score', 'Comment'])
    
    categories = ['App Experience', 'Customer Service', 'Transaction Speed', 'Account Security', 'Onboarding']
    
    positive_comments = ['Great app!', 'Super fast transactions', 'Love the new features', 'Support was very helpful', 'Secure and reliable', 'Easy to use', 'Highly recommend']
    neutral_comments = ['It is okay', 'Does the job', 'Nothing special', 'Average experience', 'UI is a bit confusing but works', 'Fine for basic needs']
    negative_comments = ['App keeps crashing', 'Transaction took too long', 'Support was unhelpful', 'Cannot login to my account', 'Too many bugs', 'Frustrating experience', 'My card was blocked for no reason']
    
    for i in range(1, 101):
        sentiment = random.choices(['Positive', 'Neutral', 'Negative'], weights=[0.4, 0.4, 0.2])[0]
        if sentiment == 'Positive':
            comment = random.choice(positive_comments)
            nps = random.randint(8, 10)
        elif sentiment == 'Neutral':
            comment = random.choice(neutral_comments)
            nps = random.randint(5, 7)
        else:
            comment = random.choice(negative_comments)
            nps = random.randint(1, 4)
            
        # Random date in the past 30 days
        date_str = (datetime.datetime.now() - datetime.timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))).isoformat(timespec='seconds')
        
        writer.writerow([
            f'FDB-{20000+i}',
            f'CUST-{10000 + random.randint(1, 100)}',
            date_str,
            random.choice(categories),
            sentiment,
            nps,
            comment
        ])

