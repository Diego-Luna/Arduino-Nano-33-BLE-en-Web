#include <Arduino_APDS9960.h>
#include <ArduinoBLE.h>


// UUIDs para el servicio y característica BLE
const char* serviceUuid = "12345678-1234-1234-1234-123456789abc";
const char* characteristicUuid = "abcdefab-cdef-abcd-efab-cdefabcdefab";

BLEService rgbService(serviceUuid);
BLEStringCharacteristic rgbCharacteristic(characteristicUuid, BLERead | BLENotify, 20); // 20 es el tamaño máximo de la cadena


// Factores de corrección calculados a partir de tus datos
const float redCorrection = 227.0 / 48;
const float greenCorrection = 182.0 / 47; // El valor más alto para el verde real
const float blueCorrection = 245.0 / 40; // El valor más alto para el azul real

void setup() {
  Serial.begin(9600);

  // Iniciar BLE
  if (!BLE.begin()) {
    Serial.println("Error initializing BLE.");
    while (1);
  }

  if (!APDS.begin()) {
    Serial.println("Error initializing APDS9960 sensor.");
  }

  APDS.setLEDBoost(1);

  // Configurar BLE
  BLE.setLocalName("Arduino RGB");
  BLE.setAdvertisedService(rgbService);
  rgbService.addCharacteristic(rgbCharacteristic);
  BLE.addService(rgbService);

  // Iniciar anuncio BLE
  BLE.advertise();
  Serial.println("Bluetooth device active, waiting for connections...");
}

void loop() {

  BLEDevice central = BLE.central();

  if (central) {
    Serial.print("Connected to central: ");
    Serial.println(central.address());

    while (central.connected()) {

      // check if a color reading is available
      while (! APDS.colorAvailable()) {
        delay(5);
      }

      digitalWrite(LEDR, LOW);
      digitalWrite(LEDG, LOW);
      digitalWrite(LEDB, LOW);

      int r, g, b;
      APDS.readColor(r, g, b);

      // Aplicar corrección
      r = min(255, int(r * redCorrection));
      g = min(255, int(g * greenCorrection));
      b = min(255, int(b * blueCorrection));

      // Imprimir los valores en el Serial para depuración
      Serial.print("Red: ");
      Serial.print(r);
      Serial.print(" Green: ");
      Serial.print(g);
      Serial.print(" Blue: ");
      Serial.println(b);

      // Enviar los valores por BLE
      char rgbStr[20];
      snprintf(rgbStr, sizeof(rgbStr), "%d,%d,%d", r, g, b);
      rgbCharacteristic.writeValue(rgbStr);

      // wait a bit before reading again
      delay(500);
    }

    Serial.println("Disconnected from central");
  }
}
