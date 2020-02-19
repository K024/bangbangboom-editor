
# V2

## The current map format

---

The file start with line `bbb map format v2`


Map content starts from `[objects]` section and must be the last section.  
You can add any thing you like before `[objects]` section.  
Empty lines and content after `#` till next line will be ignored as comment.  
Usually we use a `[meta]` section before it.  

```
bbb map format v2

[meta]

name=xxx
artist=xxx
difficulty=xxx
xxx=xxx # some comment

[objects]
...

```
---

## **objects**

One line describes an object.  
The first char describes the type.  

| char  |    type     |
| :---: | :---------: |
|   +   |  timepoint  |
|   n   | single note |
|   s   | slide note  |

Usually timepoints are first listed, then notes in real time order.

## **timepoint**

line format:
```
+|<start time>|<bpm>|<bpb>
```

`<start time>` is a float number in seconds  
`<bpm>` and `<bpb>` are positive integers  

All timepoints are stored in a list and accessed by **index**

### **note position**

`<note pos>` is the time and lane position of a note  
`<note pos> => <timepoint index>:<offset>:<lane>`  

`<timepoint index>` is index of timepoint (should appear before note)  
`<offset>` is the count of **1/48 quarter beat** time to the timepoint  
`<lane>` is from left to right: 0 => 6

## **single note**

line format:
```
n|<flags>|<note pos>
```

`<flags>` is a string contains flag chars as described: 
| flag  |    meaning    |
| :---: | :-----------: |
|   f   | note is flick |


## **slide note**

line format:
```
s|<slide index>|<flags>|<note pos>
```

`<slide index>` is the index of slide appeared, all notes in a long slide should share same index.


`<flags>` is a string contains flag chars as described: 
| flag  |              meaning               |
| :---: | :--------------------------------: |
|   s   |             start note             |
|   e   |              end note              |
|   f   | note is flick(valid only end note) |

## Example map

```
bbb map format v2

[meta]

name=example song
artist=example artist

[objects]

+|2.333|90|4
+|6.666|80|3

n||0:96:0
n|f|0:96:6
s|0|s|1:0:1
s|1|s|1:0:5
s|0||1:96:2
s|1||1:96:4
s|0|ef|1:192:0
s|1|e|1:192:6

```