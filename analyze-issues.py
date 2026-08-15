import json

with open('sonar-issues.json') as f:
    data = json.load(f)

issues = data.get('issues', [])
total = data.get('total', 0)
rules = {}
for i in issues:
    r = i.get('rule', '')
    rules[r] = rules.get(r, 0) + 1

for k, v in sorted(rules.items(), key=lambda x: -x[1]):
    print(f'{v:3d} {k}')

print(f'\nTotal shown: {len(issues)} / {total}')
