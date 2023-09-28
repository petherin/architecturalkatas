## Hot Diggety Dog
https://www.architecturalkatas.com/kata.html?kata=HotDiggetyDog.json

Local hot dog stand merchant wants a point-of-sale system for his hot dog stand operators

Requirements: must be lightweight in size--laptop is too unwieldy to use efficiently when making hot dogs on the street; allow for discounts; track sales by time and location; send inventory updates to mobile inventory-management staff (who drive to the location with supplies); provide a social-media integration so customers can be notified when a hot dog stand is nearby

Users: fifty or so hot dog stand operators, thousands of customers in the local area (via social-media)

### Analysis

#### Mobile App
This amounts to: design the Square, PayPal Here, Shopify POS apps.

No laptop, so a mobile app which connects to a card reader for taking card payments. 

What tech to use for mobile app? 

Separate depending on OS, meaning two codebases.

* iOS - Swift

* Android - Kotlin for modern Android development

Or cross-platform, one codebase, so: **React Native**.

#### Card Reader and SDK
App needs to take payments from card reader and call a system to process the payment.

Which card reader to use?

**SumUp Card Reader/SumUp SDK** - affordable, cross-platform, supports all card payment types, seems simplest.

Other card reader/SDK combos are:

* PayPal Here Card Reader/PayPal Here SDK
* Square Reader for Contactless and Chip/Square SDK
* Stripe Terminal/Stripe Terminal SDK

#### Payment Processing

#### Inventory Management

#### Track Sales by Time and Location

#### Provide Social Media Updates