import os, re

num = input("Word Length ? (int)")
with open("francais.txt", "r") as input:
    with open("temp.txt", "w") as output:
        output.write("[")
        # iterate all lines from file
        for line in input:
            # match = re.search("[-]", line)
            stripped = line.strip()
            length = len(stripped)
            # if substring contain in a line then don't write it
            # if match is None and not line.isspace() and length == num:
            if not line.isspace() and length == int(num):
                string = '"'+stripped.lower()+'",'
                output.write(string)

        output.write("]")

# replace file with original name
os.replace('temp.txt', 'francais_'+num+'.json')