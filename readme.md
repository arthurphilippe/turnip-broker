# Turnip Broker Bot

# Goal

The first goal of this bot is for ppl to report:

-   at what price did they buy their turnips in Animal Crossing;
-   at what price does the store buy them for each split day.

Knowing that, the bot can tell where the users shall sell their turnips and inform them on their expected earnings.

# Planned Commands

All are subject to change.

-   "navet!getzones" + an optional country code
    -   returns the available timezones
-   "navet!setzone" + a timezone string as returned by get timezones
    -   is specific to the user using it
-   "navet!price" + a prince in bells
    -   is specific to the user and the server
-   "navet!rate" + a price in bells
    -   is specific to the user and the server
-   "navet!board"
    -   is specific to the user and the server
    -   returns
        -   highest current price and the island's mayor name (including price ratio)
        -   highest recorded since user bought (including price ratio)
