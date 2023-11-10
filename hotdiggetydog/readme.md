## Hot Diggety Dog
https://www.architecturalkatas.com/kata.html?kata=HotDiggetyDog.json

Local hot dog stand merchant wants a point-of-sale system for his hot dog stand operators

Requirements: must be lightweight in size--laptop is too unwieldy to use efficiently when making hot dogs on the street; allow for discounts; track sales by time and location; send inventory updates to mobile inventory-management staff (who drive to the location with supplies); provide a social-media integration so customers can be notified when a hot dog stand is nearby

Users: fifty or so hot dog stand operators, thousands of customers in the local area (via social-media)

### Contents
<!-- `make toc` to generate https://github.com/jonschlinkert/markdown-toc#cli -->

<!-- toc -->

  * [Handy Links](#handy-links)
  * [Analysis](#analysis)
  * [Components (so far)](#components-so-far)
    + [Mobile App](#mobile-app)
    + [Card Reader and SDK](#card-reader-and-sdk)
    + [Payment Processing](#payment-processing)
    + [Inventory Management](#inventory-management)
    + [Track Sales by Time and Location](#track-sales-by-time-and-location)
    + [Provide Social Media Updates](#provide-social-media-updates)
    + [User Management and Authentication](#user-management-and-authentication)
      - [Authentication Options](#authentication-options)
        * [Auth0](#auth0)
        * [Frontegg](#frontegg)
        * [AWS Cognito](#aws-cognito)
        * [Custom Built OAuth](#custom-built-oauth)
        * [Custom Authentication and Authorisation](#custom-authentication-and-authorisation)
    + [Risks](#risks)
    + [Non-Functionals](#non-functionals)
    + [Constraints](#constraints)
    + [Principles](#principles)
- [Notes](#notes)
- [User Authentication Versus App Authentication](#user-authentication-versus-app-authentication)
  * [User Authentication:](#user-authentication)
  * [App Authentication:](#app-authentication)
- [Typical Mobile App Flow for User Authentication and Authorisation](#typical-mobile-app-flow-for-user-authentication-and-authorisation)
  * [1. User Authentication:](#1-user-authentication)
  * [2. Performing an Action:](#2-performing-an-action)
  * [3. Authorization on the Server Side:](#3-authorization-on-the-server-side)
  * [4. UI Considerations:](#4-ui-considerations)
  * [5. Handling Token Expiry:](#5-handling-token-expiry)
  * [Security Considerations:](#security-considerations)
  * [Sequence Diagram](#sequence-diagram)

<!-- tocstop -->

### Handy Links

https://frontegg.com/ Ui for setting up things like OAuth or passwordless authentication.

### Analysis

### Components (so far)
* Mobile app (possibly React Native) - user authorisation
* Authorisation service - for user authentication and token generation
* Inventory service - tracking inventory
* Database - for inventory (and users with their roles?)
* Transaction service - to talk to SumUp
* SumUp (third party payment service)

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

It's typical for multiple individuals in a small business to use the same SumUp account.

So when a user is logged in, they can use the one SumUp account. The app would contact a separate transaction service and it would talk to the SumUp API and return the results back to the app.

##### Authentication Options
###### Auth0
[00-login-hooks](00-login-hooks) - a React Native OAuth solution created by Auth0, that uses Google, Twitter, Facebook etc for logging in users.

Auth0 lets us create users, and roles with permissions.

Not free, if we have 50 users per day that's 50x30=1,500 Monthly Active Users.

Users may log in multiple times a day if their sessions expires, so could be up to 5 logins per user per day?

5x50x30=7,500 Monthly Active Users

This is really close to the 7,000 free users you get in the free tier.

**Price: The Essentials tier with 7,000 MAU is $160 per month. Max users is 10,000.**

###### Frontegg

[app-with-frontegg](app-with-frontegg) - a React app integrating with a Frontegg solution.

The app was created by following this https://portal.frontegg.com/development/settings/integration

Selected React followed by TypeScript + SWC.

Then followed instructions in the link above.

The Frontegg solution in the Builder page is:

![Screenshot 2023-10-24 at 12.35.46.png](Screenshot%202023-10-24%20at%2012.35.46.png)

![Screenshot 2023-10-24 at 12.38.09.png](Screenshot%202023-10-24%20at%2012.38.09.png)

i.e. Google login with `Allow signup` enabled.

Had to set up the Google side following https://docs.frontegg.com/docs/google-login.

When setting the OAuth 2.0 Client ID in Google, the `Authorized redirect URIs` didn't work with http://localhost:5173/account/social/success.

Had to use the Frontegg endpoint instead https://app-al0s8azy1prn.frontegg.com/oauth/account/social/success.

The base URL could be seen in Frontegg - Development - Env settings - General tab.

Then got the client id and secret from Google.

Went to Frontegg - under the Development env's Social Logins page clicked Manage for Google.

![Screenshot 2023-10-24 at 12.49.54.png](Screenshot%202023-10-24%20at%2012.49.54.png)

Added the client id and secret here and the callback as well.

The callback URI was my app's endpoint running locally i.e. http://localhost:5173/account/social/success

**Price: Starter $99 per month, Professional $799 per month.**

###### AWS Cognito
https://aws.amazon.com/pm/cognito/

**Price: https://calculator.aws/#/addService/Cognito says 7,500 MAU is free. Max is 50,000 MAU.**

https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-integrate-apps.html

https://docs.aws.amazon.com/cognito/latest/developerguide/user-pools-API-operations.html

There's a learning curve with this but as it's free and it provides OAuth 2.0 and lets you administer user's roles and permissions, maybe should go with this.

###### Custom Built OAuth
There are examples of implementing OAuth all over the internet. It would be handy if we didn't have to roll our own authentication and authorisation, and roles and permissions for users, so maybe go for AWS Cognito.

**Price: Free**

###### Custom Authentication and Authorisation
Come up with own approach like username and password, user gets a token signed by our own auth service.

Use RBAC for the user authorisation?

Refer to https://mobile-security.gitbook.io/mobile-security-testing-guide/general-mobile-app-testing-guide/0x04e-testing-authentication-and-session-management

**Price: Free**

#### Risks
* AWS Cognito 
  * If we use AWS Cognito for authentication, authorisation and permissions and roles for users using OAuth2.0 and Google/Facebook, etc logins, it will be a risk if the dev team aren't familiar with Cognito or OAuth 2.0.

#### Non-Functionals

#### Constraints

#### Principles

## Notes
## User Authentication Versus App Authentication
User authentication and app authentication are two distinct processes within a mobile app, each serving a different purpose.

### User Authentication:

**Definition:**
User authentication is the process of verifying the identity of an individual user, ensuring that the person trying to access the app or certain features within it is indeed who they claim to be.

**Purpose:**
1. **Access Control:** User authentication is primarily used for controlling access to the app and its features. It ensures that only authorized users can log in and interact with the app's functionalities.

2. **Data Security:** By authenticating users, the app can associate actions and data with specific individuals, helping to secure sensitive information and prevent unauthorized access.

3. **Personalization:** User authentication enables personalization features, allowing the app to customize the user experience based on individual preferences and settings.

**Methods:**
- **Password-based:** Traditional username and password authentication.
- **Biometric:** Utilizing fingerprints, facial recognition, or other biometric data.
- **Multi-Factor Authentication (MFA):** Combining multiple authentication factors for enhanced security.

### App Authentication:

**Definition:**
App authentication, on the other hand, refers to the process by which a mobile app itself is authenticated with backend servers, APIs, or other services it interacts with. It ensures that the app can securely communicate with external resources.

**Purpose:**
1. **API Access:** App authentication is crucial when the mobile app needs to interact with external services or APIs. It allows the app to prove its identity to these services to gain access.

2. **Data Exchange:** Securely exchanging data between the app and server, ensuring that the information sent and received is protected from unauthorized access.

3. **Authorization:** App authentication is often tied to authorization mechanisms, ensuring that the app has the necessary permissions to perform certain actions or access specific resources.

**Methods:**
- **API Keys:** Using a unique key associated with the app to authenticate requests made to the server or API.
- **OAuth (Client Credentials Grant):** Authenticating the app itself (as opposed to a user) to obtain an access token for accessing protected resources.
- **Certificates:** Employing digital certificates to establish a secure connection between the app and server.

**Key Differences:**

1. **Scope:**
  - **User Authentication:** Verifies the identity of individual users.
  - **App Authentication:** Verifies the identity of the app or service.

2. **Access Control:**
  - **User Authentication:** Controls access to app features based on individual user identity.
  - **App Authentication:** Controls access to external services or resources that the app interacts with.

3. **Credentials:**
  - **User Authentication:** Involves user-specific credentials (e.g., username, password).
  - **App Authentication:** Involves app-specific credentials (e.g., API keys, client credentials).

In summary, user authentication is focused on verifying the identity of individual users to control access to app features, while app authentication is about ensuring that the app itself is securely authenticated when interacting with external services or APIs. Both processes are essential components of a comprehensive mobile app security strategy.

## Typical Mobile App Flow for User Authentication and Authorisation
Here's how you would ensure a user can perform an action in a React Native mobile app:

### 1. User Authentication:

- **Login Screen:**
  - Build a login screen where users can enter their username and password.

- **Authentication Request:**
  - When the user submits the login form, send an authentication request to the backend server with the entered credentials.

- **JWT Handling:**
  - If authentication is successful, store the JWT securely on the mobile device. React Native provides options like AsyncStorage or secure storage for this purpose.

### 2. Performing an Action:

- **Action Trigger:**
  - When a user tries to perform an action that requires authorization, such as accessing a particular screen or making a specific request, trigger the action within the React Native mobile app.

- **Include JWT in Requests:**
  - Include the JWT in the Authorization header of the HTTP request when making requests to the backend server. This allows the server to identify and authenticate the user.

### 3. Authorization on the Server Side:

- **Token Verification:**
  - On the server side, verify the JWT for each incoming request to ensure it's valid, not expired, and hasn't been tampered with. Extract the user information and roles from the token.

- **RBAC Checks:**
  - Perform RBAC checks based on the user's roles to determine whether the user has the necessary permissions to perform the requested action.

- **Response Handling:**
  - If the user has the required permissions, proceed with the action. If not, return an appropriate error response (e.g., HTTP 403 Forbidden).

### 4. UI Considerations:

- **Conditional Rendering:**
  - In the React Native mobile app, use conditional rendering to display or hide UI components based on the user's roles and permissions. For example, you might conditionally render buttons or screens based on the user's authorization level.

### 5. Handling Token Expiry:

- **Token Expiry Checks:**
  - Implement logic on the mobile app to check the expiration of the JWT. If the token is expired, prompt the user to re-authenticate or refresh the token if a refresh token mechanism is in place.

### Security Considerations:

- **HTTPS:**
  - Ensure that the mobile app communicates with the server over HTTPS to secure data transmission.

- **Token Storage:**
  - Store tokens securely on the mobile device and follow best practices for securing sensitive information.

- **Secure Data Transmission:**
  - Implement secure data transmission practices, especially when dealing with sensitive user information or actions.

### Sequence Diagram
![authflow.png](authflow.png)