import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true,
  antialias: true
})

renderer.setClearColor(0x000000, 0)
scene.background = null

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = false
controls.enablePan = false
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.enabled = false

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.domElement.style.pointerEvents = 'auto'

//control
window.addEventListener('mousedown', (e) => {
  isDragging = true
  previousMouseX = e.clientX
})

window.addEventListener('pointerup', () => {
  isDragging = false

  if (model) {
    targetRotY = model.rotation.y
    baseRotation = model.rotation.y
  }
})

window.addEventListener('mousemove', (e) => {
  if (!isDragging || !model) return

  const deltaX = e.clientX - previousMouseX
  model.rotation.y += deltaX * 0.01

  previousMouseX = e.clientX
})

window.addEventListener('blur', () => {
  isDragging = false
})

window.addEventListener('mouseleave', () => {
  isDragging = false
})

window.addEventListener('pointercancel', () => {
  isDragging = false
})
//control

camera.position.set(0, 0, 1.05)

// lighting
const light = new THREE.DirectionalLight(0xffffff, 3)
light.position.set(5, 5, 5)
scene.add(light)

const ambient = new THREE.AmbientLight(0xffffff, 1.5)
scene.add(ambient)


// load model
const loader = new GLTFLoader()
let model
let isDragging = false
let previousMouseX = 0

let baseRotation = 0
let targetRotY = 0
loader.load('/public/logo-model.glb', (gltf) => {
  model = gltf.scene

  model.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set('#ffffff')
    }
  })

  scene.add(model)

  updateCamera()
  updateModel()
})

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

function animate() {
  requestAnimationFrame(animate)

  if (model) {
    if (!isDragging) {
      baseRotation += 0.005
      targetRotY = baseRotation
    }

    model.rotation.y += (targetRotY - model.rotation.y) * 0.1
  }

  renderer.render(scene, camera)
}

animate()
typeanimation()

function typeanimation() {
  const typed = document.querySelector('.typed')  // ← ganti select() jadi ini
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    })
  }
}

function updateCamera() {
  if (window.innerWidth < 768) {
    camera.position.set(0, 0, 1.5)
  } else {
    camera.position.set(0, 0, 1.05)
  }
}

function updateModel() {
  if (!model) return

  if (window.innerWidth < 768) {
    model.scale.set(1, 1, 1)
    model.position.set(0, 0, 0)
  }

  if (window.innerWidth < 1024) {
    model.scale.set(0.5, 0.5, 0.5)
    model.position.set(0.3, 0, 0)
  }
  
  else {
    model.scale.set(1, 1, 1)
    model.position.set(0.8, 0, 0)
  }
}

window.addEventListener('resize', () => {
  const width = window.innerWidth
  const height = window.innerHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)

  updateCamera()
  updateModel()
})

const isMobile = window.innerWidth < 768
controls.enabled = !isMobile