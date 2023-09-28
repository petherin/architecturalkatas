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

Choose a third party payment processor like:

* Stripe
* Square
* PayPal
* Adyen
* Authorize.Net
* Braintree
* Worldpay (FIS)
* **SumUp - as we're using their card reader and SDK we might as well use them for the actual payment processing**
* Shopify Payments

> Flesh out all the stuff below.

#### Inventory Management

SQL database to hold inventory, a service to update it whenever a transaction occurs.

Notify suppliers when a certain threshold is hit for stock at any hot dog stand.

#### Track Sales by Time and Location

Need geolocation service (get from phone) to include time and location when transaction occurs. 

Save this in a database. Would need an ID for the transaction from the payment processor to enrich it with time/place info.

Maybe SumUp provide this already?

#### Provide Social Media Updates

Use Facebook, Twitter, Instagram APIs to post things from within the app.

#### User Management
Some users are people selling hot dogs and taking payments. They can post on social media.

Some users are mobile inventory management staff who should receive inventory notifications so they can restock a seller at a known location.

Some users need to see all payments, inventory, sales by time and location, so they're the admins.

Use OAuth 2.0 and OpenID Connect to authorize and authenticate users. Add RBAC to assign permissions to users.

Roles

* **seller** - make payments, post on social media
* **supplier** - receive notifications of low supplies at a given hot dog stand so they can go and resupply
* **admin** - can do all of the above and see all sales information, and manage users and change their roles

#### Non-Functionals

#### Constraints

#### Principles