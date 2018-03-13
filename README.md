# 2018-Capital-One-May-Software-Engineering-Summit
Project Submission for 2018 C1 Software Engineering Summit

Submission: INSERT SUBMISSION LINK WHEN DONE

Deliverables: 
To solve this challenge, build a web application or web page that provides:

*Data Visuals:* 

* Display or graph 3 metrics or trends from the data set that are interesting to you.
* Given an address and time, what is the most likely dispatch to be required?
* Which areas take the longest time to dispatch to on average? How can this be reduced? 
    FIRST: Find unique zipcodes
    for each zipcode - get corresponding incidents for all entries that contain the zipcode
      may have to create a seperate csv file for each zipcode
    make sure dispatch_time colum is included in the file
      add up total time from dispatch_time col and divide  by total entries in each zipcode csv file
      RESULT: Avg dispatch time for each zipdoe in dataset
      Answer: do google search on the top 5 zipcodes that have largest dispatch times and use this
  

*(Optional) Bonus features:*

* Heat maps: Add heat maps that show dispatch frequency, urgency over the city.
* Crime correlation: Based on the type of dispatch and the frequency of dispatch, show the most calm and safe neighborhoods in the city
* Preparing for the future: Which areas are experiencing the greatest increase in dispatch calls? Where and what type of dispatch service would you place to help with the rate of increasing calls?

