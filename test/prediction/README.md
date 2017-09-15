# Transaction Generation

1. Generate a mock host and guest user.
   * NOTE: In our model, one host owns every lot.
2. Generate mock lots.
    1. Use Google Places API to search nearby for places with a "parking" place type.
    2. Extract the name and address of the place.
3. Generate a random number of spots for each lot (from 1 to 30).
4. For every spot, generate a random number of transactions.
    1. Generate a random start time and end time for each transaction (from 0.0 to 24.0).
    2. Generate a price based on the reservation length and time of day.

## Price Generation

To model the data, we make the following assertions:
  1. The price will be highest during likely peak hours (work commute and nightlife).
  2. The price will dropoff slightly during the middle of the day.
  3. The model can be adjusted to fit real-world data.

Let
$$\text{instantaneous price} = f(t) = 2 + 3(\sin{(\frac{\pi}{24} t)} + 0.25\sin{(\frac{\pi}{8} t)})$$

$$ f(t) = 2 + 37 \sin{(\frac{\pi}{24} t)} + 0.75 \sin{(\frac{\pi}{8}t)}$$

![](figure1.png)

Therefore
$$ \text{reservation price} = \int_{a}^{b}f(t) \ {dt} = F(b) - F(a)$$
Where
$$F(t) = 2t - \frac{6}{\pi}cos(\frac{\pi}{24}t) - \frac{72}{\pi}cos(\frac{\pi}{8}t) + C$$
Then we can generate a random error term
$$ \epsilon = 2a \ \text{rand}() - a $$
Such that
$$-a \leq \epsilon \leq a$$
And combine it with our integral
$$F(b) - F(a) + \epsilon$$

