#include <Arduino_HTS221.h>
#include <ArduinoBLE.h>

BLEService htsService("12345678-1234-1234-1234-123456789abc"); // UUID personalizado para el servicio
BLEFloatCharacteristic temperatureCharacteristic("23456789-1234-1234-1234-123456789abc", BLERead | BLENotify); // UUID personalizado para la temperatura
BLEFloatCharacteristic humidityCharacteristic("3456789a-1234-1234-1234-123456789abc", BLERead | BLENotify); // UUID personalizado para la humedad

float old_temp = 0;
float old_hum = 0;

void setup() {
  Serial.begin(9600);

  if (!BLE.begin()) {
    Serial.println("Starting BLE failed!");
    while (1);
  }

  if (!HTS.begin()) {
    Serial.println("Failed to initialize humidity temperature sensor!");
    while (1);
  }

  BLE.setLocalName("HTS Sensor");
  BLE.setAdvertisedService(htsService);
  htsService.addCharacteristic(temperatureCharacteristic);
  htsService.addCharacteristic(humidityCharacteristic);
  BLE.addService(htsService);
  BLE.advertise();

  Serial.println("Bluetooth device active, waiting for connections...");
}

void loop() {

  BLEDevice central = BLE.central();

  if (central) {
    Serial.print("Connected to central: ");
    Serial.println(central.address());

    while (central.connected()) {
      // read all the sensor values
      float temperature = HTS.readTemperature();
      float humidity    = HTS.readHumidity();

      // check if the range values in temperature are bigger than 0,5 ºC
      // and if the range values in humidity are bigger than 1%
      if (abs(old_temp - temperature) >= 0.5 || abs(old_hum - humidity) >= 1 )
      {
        old_temp = temperature;
        old_hum = humidity;
        // print each of the sensor values
        Serial.print("Temperature = ");
        Serial.print(temperature);
        Serial.println(" °C");
        Serial.print("Humidity    = ");
        Serial.print(humidity);
        Serial.println(" %");
        Serial.println();
      }

      // print each of the sensor values
      Serial.print("Temperature = ");
      Serial.print(temperature);
      Serial.println(" °C");

      Serial.print("Humidity    = ");
      Serial.print(humidity);
      Serial.println(" %");

      // print an empty line
      Serial.println();

      // wait 1 second to print again
      temperatureCharacteristic.writeValue(temperature);
      humidityCharacteristic.writeValue(humidity);
      delay(1000);
    }

    Serial.println("Disconnected from central");
  }
}
