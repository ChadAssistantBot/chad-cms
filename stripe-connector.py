import stripe
import os
from dotenv import load_dotenv

# Load credentials from .env
load_dotenv(dotenv_path='Code/chad-cms/.env')

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

def get_account_info():
    if not stripe.api_key:
        print("Missing STRIPE_SECRET_KEY in .env")
        return

    try:
        account = stripe.Account.retrieve()
        print(f"Stripe Account Connected: {account.id}")
        # Add logic to fetch metrics (MRR, recent transactions)
    except Exception as e:
        print(f"Error connecting to Stripe: {e}")

if __name__ == "__main__":
    get_account_info()
