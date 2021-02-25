# Robotics Lights

<!-- Github: [github.com/Firebird1029/KhanSolver](https://github.com/Firebird1029/KhanSolver) -->

**Stack:** C++

Here is some basic modular arithmetic to make the light patterns loop around and around:

```cpp
for (int lengthi = 0; lengthi < pulseLength; lengthi++) {
  leds[(pulseCodeIncrement1 + lengthi) % (SUPPORT_BAR_LENGTH + SUPPORT_BAR_1_START)] = chasedColor; // Set new pixel 'off'
  leds[(pulseCodeIncrement2 + lengthi) % (SUPPORT_BAR_LENGTH + SUPPORT_BAR_2_START)] = chasedColor; // Set new pixel 'off'
}

if (pulseCodeIncrement1 > 0) {
  // Set previous pixel 'on'
  if (pulseCodeIncrement1 == (SUPPORT_BAR_LENGTH + SUPPORT_BAR_1_START)) {
    leds[(SUPPORT_BAR_LENGTH + SUPPORT_BAR_1_START) - 1] = defaultColor;
  } else {
    leds[(pulseCodeIncrement1 % (SUPPORT_BAR_LENGTH + SUPPORT_BAR_1_START)) - 1] = defaultColor;
  }
}
```
