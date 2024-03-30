document.addEventListener('DOMContentLoaded', (event) => {
  const connectButton = document.getElementById('connectButton');
  const loadingElement = document.getElementById('loading');
  const imgElement = document.getElementById('nano');

  connectButton.addEventListener('click', function() {
    this.style.display = 'none'; // Ocultar el botón
    loadingElement.classList.remove('hidden'); // Mostrar la animación de carga
    imgElement.classList.add('hidden'); // Mostrar la animación de carga
    connectToBLEDevice();
  });
});

function connectToBLEDevice() {
  navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: ['12345678-1234-1234-1234-123456789abc'] // UUID del servicio
  })
  .then(device => {
    // Agregar el controlador de eventos para la desconexión
    device.addEventListener('gattserverdisconnected', onDeviceDisconnected);

    return device.gatt.connect();
  })
  .then(server => server.getPrimaryService('12345678-1234-1234-1234-123456789abc')) // UUID del servicio
  .then(service => {
    return Promise.all([
      service.getCharacteristic('23456789-1234-1234-1234-123456789abc'), // UUID de la característica de temperatura
      service.getCharacteristic('3456789a-1234-1234-1234-123456789abc') // UUID de la característica de humedad
    ]);
  })
  .then(characteristics => {
    const temperatureCharacteristic = characteristics[0];
    const humidityCharacteristic = characteristics[1];

    temperatureCharacteristic.startNotifications().then(_ => {
      temperatureCharacteristic.addEventListener('characteristicvaluechanged', handleTemperatureChange);
    });

    humidityCharacteristic.startNotifications().then(_ => {
      humidityCharacteristic.addEventListener('characteristicvaluechanged', handleHumidityChange);
    });
  })
  .catch(error => {
    console.log('Error: ' + error);
  });
}

// Función para manejar la desconexión del dispositivo
function onDeviceDisconnected(event) {
  console.log('Dispositivo BLE desconectado, recargando la página...');
  location.reload(); // Recargar la página
}


function handleTemperatureChange(event) {
  let temperature = event.target.value.getFloat32(0, true).toFixed(2);

  document.getElementById('temperature').textContent = `${temperature}°C`;
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('nano').classList.remove('hidden');
}

function handleHumidityChange(event) {
  let humidity = event.target.value.getFloat32(0, true).toFixed(2);
  document.getElementById('humidity').textContent = `${humidity}%`;
}