---
title: "[참고] priority class를 custom class에 적용하는 방법"
date: "2023-06-11"
layout: hidden
draft: false
path: "/algo/posts/2023-06-11--001"
category: "algo"
tags:
  - "method"
description: ""
---
## #. Priority Queue Using Costom Class
* Priority Queue안에 담길 객체를 자신만의 Class로 사용하려면 Comparable Interface를 implements하는 Class를 생성한 후, compareTo method를 우선 순위에 맞게 구현해 주면 된다.

```java
class Gillog implements Comparable<Gillog> {

    private int writeRowNumber;
    private String content;

    public Gillog(int writeRowNumber, String content) {
        this.writeRowNumber = writeRowNumber;
        this.content = content;
    }

    public int getWriteRowNumber() {
        return this.writeRowNumber;
    }

    public String getContent() {
        return this.content;
    }

    @Override
    public int compareTo(Gillog gillog) {

        if (this.writeRowNumber > gillog.getWriteRowNumber())
            return 1;
        else if (this.writeRowNumber < gillog.getWriteRowNumber())
            return -1;
        return 0;
    }
}
```

<br/>

## #. Priority Queue에 적용

```java
public static void main(String[] args) {

        PriorityQueue<Gillog> priorityQueue = new PriorityQueue<>();

        priorityQueue.add(new Gillog(3650, "10년후 글"));
        priorityQueue.add(new Gillog(31, "한달 후 글"));
        priorityQueue.add(new Gillog(1, "첫번째 글"));
        priorityQueue.add(new Gillog(365, "1년후 글"));

        while (!priorityQueue.isEmpty()) {
        Gillog gilLog = priorityQueue.poll();
        System.out.println("글 넘버 : " + gilLog.getWriteRowNumber() + " 글 내용 : " + gilLog.getContent());
        }
        }
    
 /* 실행 결과
글 넘버 : 1 글 내용 : 첫번째 글
글 넘버 : 31 글 내용 : 한달 후 글
글 넘버 : 365 글 내용 : 1년후 글
글 넘버 : 3650 글 내용 : 10년후 글
 */
```

