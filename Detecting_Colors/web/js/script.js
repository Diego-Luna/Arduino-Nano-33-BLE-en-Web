let rgbCharacteristic = null;

document.addEventListener('DOMContentLoaded', (event) => {

    const connectButton = document.getElementById('connect');
    const loadingElement = document.getElementById('loading');
    const containerElement = document.getElementById('connect-container');

    connectButton.addEventListener('click', function() {
        this.style.display = 'none';
        loadingElement.classList.remove('hidden');
        containerElement.classList.add('hidden');
        connectToBLEDevice();
    });
});

function connectToBLEDevice() {
    navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['12345678-1234-1234-1234-123456789abc'] // reemplazar con tu UUID de servicio
    })
    .then(device => {
        device.addEventListener('gattserverdisconnected', onDeviceDisconnected);

        console.log('Conectando a GATT Server...');
        return device.gatt.connect();
    })
    .then(server => {
        console.log('Obteniendo Servicio RGB...');
        return server.getPrimaryService('12345678-1234-1234-1234-123456789abc');
    })
    .then(service => {
        console.log('Obteniendo Característica RGB...');
        return service.getCharacteristic('abcdefab-cdef-abcd-efab-cdefabcdefab');
    })
    .then(characteristic => {
        rgbCharacteristic = characteristic;
        return rgbCharacteristic.startNotifications().then(_ => {
            console.log('Notificaciones iniciadas');
            rgbCharacteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
        });
    })
    .catch(error => {
        console.log('Error: ' + error);
    });
};

function handleCharacteristicValueChanged(event) {

    document.getElementById('loading').classList.add('hidden');
    document.getElementById('nano').classList.remove('hidden');

    let value = event.target.value;
    let rgbValue = new TextDecoder().decode(value);
    console.log(`Valor RGB: ${rgbValue}`);
    let RGB = rgbValue.split(',');

    document.getElementById('red-number').textContent = `${RGB[0]}`;
    document.querySelector('.red.circle').classList.add("scaling-animation");
    document.getElementById('verde-number').textContent = `${RGB[1]}`;
    document.querySelector('.verde.circle').classList.add("scaling-animation");
    document.getElementById('azul-number').textContent = `${RGB[2]}`;
    document.querySelector('.azul.circle').classList.add("scaling-animation");

    document.querySelector('.contorno.circle').classList.add("scaling-animation");

    let circle = document.querySelector('.resultado.circle');
    let circlealrededor = document.querySelector('.contorno.circle');
    let red = parseInt(RGB[0]);
    let green = parseInt(RGB[1]);
    let blue = parseInt(RGB[2]);

    console.log(`--> rgb(${red}, ${green}, ${blue})`);

    circle.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    circle.style.borderColor = `rgb(${red}, ${green}, ${blue})`;

    circlealrededor.style.borderColor = `rgb(${red}, ${green}, ${blue})`;

}

function onDeviceDisconnected(event) {
    console.log('Dispositivo BLE desconectado, recargando la página...');
    location.reload(); // Recargar la página
  }