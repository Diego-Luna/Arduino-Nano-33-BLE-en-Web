#include <Arduino_APDS9960.h>

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  while (!Serial);

  if (!APDS.begin()) {
    Serial.println("Error initializing APDS9960 sensor.");
  }

}

void loop() {
  while (! APDS.colorAvailable()) {
    delay(5);
  }

  digitalWrite(LEDR, LOW);
  digitalWrite(LEDG, LOW);
  digitalWrite(LEDB, LOW);

  int r, g, b;
  APDS.readColor(r, g, b);

  // Imprimir los valores en el Serial para depuración
  Serial.print("Red: ");
  Serial.print(r);
  Serial.print(" Green: ");
  Serial.print(g);
  Serial.print(" Blue: ");
  Serial.println(b);

  // wait a bit before reading again
  delay(500);
}
