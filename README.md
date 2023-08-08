# Architectural Katas
A place to practice software architecture.

## I Can Haz Cheezborger?
https://www.architecturalkatas.com/kata.html?kata=Cheezborger.json

Client wants to create websites to follow Internet trends--as a new trend is identified, create a website following it and highlighting it and allowing users to interact with it

Users: millions+ readers, thousands+ posters, dozens admins

Requirements: high SEO; easy for users to add content; easily mashable/clickable; reject inappropriate content; easy trend analysis; user forums; user moderators; ubiquitous accessibility; easy admin "reach"/accessibility

### Analysis

* as a new trend is identified, create a website following it and highlighting it and allowing users to interact with it x
* thousands+ posters
* dozens admins x
* high SEO x
* easy for users to add content x
* easily mashable/clickable
* reject inappropriate content x
* easy trend analysis x
* user forums x
* user moderators x
* ubiquitous accessibility
* easy admin "reach"/accessibility

Let's say the new websites aren't created automatically, a human needs to click a button to create it.

A superadmin logs into an admin page that lets them see trends. They can create a new website based on a trend.

It will create the website as a new domain name, buying it for you if available. Can use https://dnsimple.com/api to buy domain names. Or AWS SDK to get domain names with Route 53.

Create website under the new domain name using a template, host in an S3 bucket or AWS Amplify Hosting.

User admin - superadmins can maintain post-admins 

With AWS Amplify Hosting domain names and SSL handled for you. Or if it doesn't AWS SDK route53domain can register domains.

Use AWS SDK to create a new app under AWS Amplify.

There is a post-admin page where post-admins can add to a website but not create new ones.

Content moderation - issue guidelines and allow anyone to flag inappropriate content to a human moderator to handle. Use ML to reject inappropriate content automatically.

Normal readers with no admin rights can click into the main website and see featured websites.

For SEO analysis can use the Google Search Console API client library for Go (alpha).

User forums - can be a section under the main trends website, maybe a separate service. React front-end, Go backend? If we use Go for rest of site then just go with that again.

Users

* Superadmin - can create new websites, administer users, look at trends and SEO analysis, and perform all actions
* Poster - someone who can post on previously-created websites. Someone who is a poster can also post in user forums
* Moderator - user forum moderator is a user forum user with some extra permissions to delete inappropriate posts and contact forum users
* Reader - someone who can read posts on websites

### Useful Resources
**How to get high SEO**

https://www.mtu.edu/umc/services/websites/seo/

Google search console https://developers.google.com/search/docs/fundamentals/seo-starter-guide?__hstc=20629287.d5853afd34ae642d48994caec2c3ebf1.1691405744287.1691405744287.1691405744287.1&__hssc=20629287.1.1691405744287&__hsfp=225399707

**Identifying trends**

https://trends.google.com/trends - do we want global or country-specific trends?

Automatically create web site

Automatically buy domain name

**Content moderation**

https://www.techtarget.com/whatis/feature/Content-moderation-guidelines-to-consider#:~:text=There%20are%20several%20ways%20to,report%20unacceptable%20behavior%20or%20content.

**Tool to view trends**

### Diagram (WIP)

https://excalidraw.com/#json=evjVwYjpm3y0MHT9tahwI,UQsXKlrncX9hukzlTd-UZA

![container_diagram01.png](assets%2Fcontainer_diagram01.png)
