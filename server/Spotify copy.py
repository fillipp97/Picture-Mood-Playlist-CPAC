import re

ob = "son^of$a bitch"
x = re.split(', |_|-|!', ob)
print(x)
