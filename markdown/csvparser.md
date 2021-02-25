<!-- https://pyoxidizer.readthedocs.io/en/stable/comparisons.html -->

# CSV Parser

This parser was designed for a client who needed to quickly identify employees who worked overtime (40+ hours) during their shifts. An input file, which contained data on each employee's check-in and check-out time, along with their employee ID, consisted of over 4,100 rows and 1,000 employees over a two-week period.

Since the timesheet contained lots of data, I decided to use nested Python dictionaries. The parent dictionary's keys consisted of an employee's ID concatenated with their office location, because the IDs were only unique to their individual offices. The keys of the inner dictionary consisted of the week numbers, since I needed to calculate total minutes worked and overtime for each separate week.

One of the key issues was that some employees worked night shifts, so their check-in time would be 23:00 and their check-out would be 1:00. I could not compare start and end dates, because end dates were not provided in the input data. I had to figure out an algorithm that would output 2 hours, regardless of a day shift, such as 7:00 to 9:00, or a night shift, such as 23:00 to 1:00. After some brainstorming and discussion of mathematics with my wall-hung clock, I settled on this ternary:

```python
minutesWorked += inTimeHour > outTimeHour ? ( 24 - ( inTimeHour - outTimeHour ) ) * 60 : ( outTimeHour - inTimeHour ) * 60
```

Breaking down the ternary into a more-readable conditional statement:

```python
if inTimeHour > outTimeHour:
    # night shift worker
    minutesWorked += ( 24 - ( inTimeHour - outTimeHour ) ) * 60
else:
    minutesWorked += ( outTimeHour - inTimeHour ) * 60
```

The second issue was packaging the parser into a .exe so that HR could simply open the executable and the entire parsing process would be automatic without needing to "import" or "export" anything. I accomplished this by detecting the input CSV on their Desktop, and writing to a new CSV file on their Desktop. While there are many tools for packaging Python scripts into executables, including Pyinstaller, py2exe, and cx_freeze, I initially chose cx_freeze because it was cross-platform and I thought there was a potential to package my parser for a Windows computer from a Mac. Unfortunately, cx_freeze bundles local dependencies and builds a native binary, which makes sense. Here was my setup.py used by cx_freeze to compile an executable:

```python
import sys
from cx_Freeze import setup, Executable

setup(
    name = "parser",
    version = "1.0",
    description = "parser",
    executables = [Executable("parser.py")])
```

After a lot of trial and error, including trying to use cx_freeze to generate an executable from a container, I eventually decided that the easiest and probably best way to build a Windows executable was from a Windows machine. I borrowed a Windows from a friend, where cx_freeze easily created the executable. However, cx_freeze did not bundle the dependencies into a single-file executable as I had intended, but rather a traditional directory structure of the executable along with its various dependencies (including Python itself). I switched over to py2exe, a mature Python distribution tool for Windows only that can build single-file executables by embedding the dependencies. Here was my setup.py for py2exe:

```python
from distutils.core import setup
import py2exe, sys, os

sys.argv.append("py2exe")

setup(
    options = {"py2exe": {"bundle_files": 1, "compressed": True}},
    windows = [{"script": "parser.py"}],
    zipfile = None
)
```
