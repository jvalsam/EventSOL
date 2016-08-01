# EventSOL

Library Helps Define Events for Smart Objects in the Internet of Things

## Events User Can Define Using the Library

### Events based on Timer

01. EVERY
	* Repeatable actions of Smart Objects
	* Optional: specify the time interval will be repeated
	* Examples:
		* Every (day at 7:00 oclock) Starts
			Smart Coffee Machine prepare coffee
			Smart Window Blinds switch on
		* Every (2 days) Starts
			Smart Vacuum wipes
			Smart Cleaning Mop mops up

02. EVERY_FOR
03. EVERY_WHILE
04. ΟΝ
05. AFTER
06. WHEN_CONDITION
07. WHEN_CONDITION_FOR
08. WHEN_CONDITION_HAPPENS
09. WHEN_CONDITION_EVERY
10. WHEN_CONDITION_EVERY_FOR
11. WHEN_CONDITION_EVERY_WHILE
12. WHEN_CONDITION_WAIT
13. WHEN_CONDITION_WAIT_EVERY
14. WHEN_CONDITION_WAIT_EVERY_FOR
15. WHEN_CONDITION_WAIT_EVERY_WHILE

### Events based on References to other Events

01. WHEN_REFERENCE
02. WHEN_REFERENCE_HAPPENS
03. WHEN_REFERENCE_FOR

## When Environment Event is fired

> executes the callback source code
> turn On/Off list of events and groups (not repeatable events can turn on themselves, repeatable events can turn off themselves)


## Events combined of reference and then Timer Events

Could be internally constructed using existing events, or could be defined by users
