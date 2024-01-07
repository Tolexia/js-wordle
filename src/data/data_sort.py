import os, json

with open("data.json", "r") as json_file:
    data = json.load(json_file)

sorted_obj = sorted(data)

with open("temp.txt", "w") as output:
    output.write('["')
    output.write('", "'.join(sorted_obj))
    output.write('"]')



# replace file with original name
os.replace('temp.txt', 'data.json')