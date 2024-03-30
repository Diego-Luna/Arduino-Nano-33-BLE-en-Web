const imgs = [
  '<img class="animacion-img" src="./img/agua.webp" alt="">',
  '<img class="animacion-img" src="./img/cloud.webp" alt="">',
  '<img class="animacion-img" src="./img/snow.webp" alt="">',
  '<img class="animacion-img" src="./img/sol.webp" alt="">'
];

let lastRandomNumber = null;

function getRandomBetween(min, max) {
  let randomNumber;
  do {
    randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (randomNumber === lastRandomNumber);

  lastRandomNumber = randomNumber; // Actualizar el último número generado
  return randomNumber;
}

// Función para crear y agregar una imagen aleatoria al DOM
function createRandomImage() {
  const imgString = imgs[getRandomBetween(0, imgs.length - 1)]; // Ajuste del índice para la matriz de imágenes
  const div = document.createElement('div');
  div.innerHTML = imgString;
  const imgElement = div.firstChild;
  imgElement.classList.add('animate-img');
  document.body.appendChild(imgElement);
  randomizePosition(imgElement);
}

// Función para posicionar la imagen de forma aleatoria en el eje X
function randomizePosition(imgElement) {
  const screenWidth = window.innerWidth;
  const imgWidth = imgElement.getBoundingClientRect().width;
  const randomX = getRandomBetween(0, screenWidth - imgWidth);

  console.log("->valor: " + randomX);
  imgElement.style.left = `${randomX}px`;
  imgElement.style.position = 'absolute';
}

// Escuchar el final de la animación para actualizar la posición y la imagen
document.addEventListener('animationend', function(e) {
  if (e.target.classList.contains('animate-img')) {
    e.target.remove(); // Eliminar la imagen antigua

    setTimeout(() => {
      createRandomImage(); // Crear y agregar las imágenes iniciales
    }, getRandomBetween(0, 5000));
  }
});

// Inicializar las imágenes al cargar la página
window.onload = function() {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      createRandomImage(); // Crear y agregar las imágenes iniciales
    }, getRandomBetween(200, 5000));
  }
};
