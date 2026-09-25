import re
import json
from pathlib import Path

includePattern = re.compile(r"request=GetFeature")
excludePattern = re.compile(r"feature_count=")
 
infile = Path("../../locust/data/prod-samples.txt")
outfile = Path("matches.txt")

linenum = 0;
 
with outfile.open("w", encoding="utf-8") as out:
    try:
        with infile.open("r", encoding="utf-8", errors="replace") as f:
            for i, line in enumerate(f, 1):
                if includePattern.search(line) and not excludePattern.search(line):
                    # There are 40k; we only need a few, so skip all but every 100th
                    linenum += 1
                    if linenum % 100 == 0:
                        jsonLine = json.loads(line)
                        out.write(f"    \"{jsonLine["uri"]}\",\n")
    except OSError:
        pass 