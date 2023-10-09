## Hot Diggety Dog
https://www.architecturalkatas.com/kata.html?kata=HotDiggetyDog.json

Local hot dog stand merchant wants a point-of-sale system for his hot dog stand operators

Requirements: must be lightweight in size--laptop is too unwieldy to use efficiently when making hot dogs on the street; allow for discounts; track sales by time and location; send inventory updates to mobile inventory-management staff (who drive to the location with supplies); provide a social-media integration so customers can be notified when a hot dog stand is nearby

Users: fifty or so hot dog stand operators, thousands of customers in the local area (via social-media)

### Handy Links

https://frontegg.com/ Ui for setting up things like OAuth or passwordless authentication.

### Analysis

#### Mobile App
This amounts to: design the Square, PayPal Here, Shopify POS apps.

No laptop, so a mobile app which connects to a card reader for taking card payments. 

What tech to use for mobile app? 

Separate depending on OS, meaning two codebases.

* iOS - Swift

* Android - Kotlin for modern Android development

Or cross-platform, one codebase, so: **React Native**.

But let developers ultimately decide this as they have more knowledge of this.

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

All possible inventory items.

* hot dogs
* hot dog buns
* onions
* ketchup
* mustard

A sale occurs. The hot dog vendor should be able to press a button saying hot dog (with quantity) or hot dog with onions (and quantity).

So add these to SumUp's item catalogue.

* hot dog
* hot dog with onions

We won't track these in SumUp but we want to know what products a transaction is for.

When we do a transaction we want to get the details of the transaction including the `products` array of objects.

We send how many hot dogs were sold to our inventory service which will update a MySQL database containing stock.

For a hot dog, it will subtract from the inventory service:

* 1 hot dog
* 1 hot dog bun

For a hot dog with onions it will subtract from the inventory service:

* 1 hot dog
* 1 hot dog bun
* 1 onion portion

We need to know how much stock each hot dog vendor has so there will need to be these tables in the database:

`stock` 

| id | name                    |
|----|-------------------------|
| 1  | hot dog                 |
| 2  | hot dog bun             |
| 3  | onion portion |

`vendors`

| id | name |
|----|------|
| 1  | joe  |
| 2  | mack |
| 3  | rich |

`vendors_stock`

| stock_id | vendor_id | quantity |
|----|-----------|----------|
| 1  | 1         | 200      |
| 2  | 1         | 200      |
| 3  | 1         | 200      |

We won't bother tracking ketchup and mustard, the vendor will get a full bottle of each at the start of the day. Too fussy to track this.

The inventory system will send an alert to all inventory managers when stock gets to a configured value like 25 on any of the stock items. They can bike over bags of hot dogs, buns and onions and then amend the stock for a vendor on the app.

Let's assume you get:

* 200 hot dogs per bag
* 200 hot dog buns per bag
* 200 onion portions per bag

This makes it easy to know how many items to re-add.

There is no requirement to track overall stock.

#### Track Sales by Time and Location

A SumUp transaction has:

* unique ID
* timestamp
* internal_id (i.e. internal unique ID on the SumUp platform)
* location object (including lat(itude) and lon(gitude) from the payment terminal reader)

So we have all the time and location data we need, no need for extra functionality in our app.

#### Provide Social Media Updates

Use Facebook, Twitter, Instagram APIs to post things from within the app.

#### User Management and Authentication
Some users are people selling hot dogs and taking payments. They can post on social media.

Some users are mobile inventory management staff who should receive inventory notifications so they can restock a seller at a known location.

Some users need to see all payments, inventory, sales by time and location, so they're the admins.

Roles

* **seller** - make payments, post on social media
* **supplier** - receive notifications of low supplies at a given hot dog stand so they can go and resupply
* **admin** - can do all of the above and see all sales information, and manage users and change their roles

[00-login-hooks](00-login-hooks) - a React Native OAuth solution created by Auth0, that uses Google, Twitter, Facebook etc for logging in users.

Auth0 lets us create users, and roles with permissions. Not free, if we have 50 users per day that's 50x30=1,500 Monthly Active Users which is $23 per month.

Look at basic OAuth without getting Auth0 involved?

Or use AWS Cognito? Paid solutions might be overkill for 50 users.

#### Non-Functionals

#### Constraints

#### Principles