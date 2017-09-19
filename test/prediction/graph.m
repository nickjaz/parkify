x = 0:0.1:24;
y1fun = @(t) 2 + 3 * (sin((pi/24) * t) + 0.25 * sin((pi/8) * t));
y1 = 2 + 3 * (sin((pi/24) * x) + 0.25 * sin((pi/8) * x));
y2 = integral(y1fun, 8, 12);

figure
plot(x, y1, x, y2);
hold on;
title("Spot Price");
xlabel("hour of day");
ylabel("price ($)");
axis([0,24,0,15]);
print -dpng figure1.png;

y3 = (2 * x) - (72 / pi) * cos((pi / 24) * x) * cos