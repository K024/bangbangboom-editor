
# V1

## The previous map format

---

A non-enpty line describes an object.  
Empty lines are ignored.

The first char describes the type:

| char  |    type     |
| :---: | :---------: |
|   +   |  timepoint  |
|   s   | single note |
|   f   | flick note  |
|   l   |    slide    |

## timepoint

format:
```
+|<start time>|<bpm>|<bpb>
```
`<start time>` is in seconds  
`<bpm>` and `<bpb>` are integers  

## note position
`<note pos>` equals
```
<offset>:<lane>
```
`<offset>` is the count of **1/24 quarter beat** time from **last** timepoint  
`<lane>` is from left to right: 0 => 6  

## single note

format:
```
s|<note pos>
```

## flick note

format:
```
f|<note pos>
```

## slide

format:
```
l|<flick end>|<all notes>
```
`<flick end>` : `1` if the slide ends with flick, else `0`  
`<all notes>` is a list of `<note pos>` with at least 2 notes  


## Example map

```

+|2.462|195|4

l|0|0:0|132:0
l|0|0:5|132:5
s|157:2
s|191:6
s|213:1
s|236:5
f|261:2
l|0|288:0|648:2
l|0|288:6|648:4
s|672:0
s|684:4


+|43.173|220|4

s|1332:5
s|1344:5
l|0|1356:1|1368:2|1380:1
l|1|1392:6|1404:5|1416:4
f|1440:5
s|1464:4
f|1476:1
s|1500:2

```