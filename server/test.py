#%%
from pathlib import Path
from dotenv import load_dotenv
import os
path = Path(__file__).parent.parent / ".env"
print(str(path))

load_dotenv(str(path))

var = os.getenv("CLIENT_ID")

print(var)