/* ═══════════════════════════════════════════
   TERMINAL — Fake interactive terminal
   ═══════════════════════════════════════════ */

(function () {
  const body   = document.getElementById('terminalBody');
  const input  = document.getElementById('termInput');
  if (!body || !input) return;

  const COMMANDS = {
    help: () => [
      'Comandos disponibles:',
      '  help        — Muestra este mensaje',
      '  whoami      — Información del perfil',
      '  skills      — Lista de tecnologías',
      '  projects    — Ver proyectos',
      '  contact     — Información de contacto',
      '  github      — Abrir GitHub',
      '  clear       — Limpiar terminal',
      '  firmware    — Info sobre firmware',
      '  plc         — Info sobre PLCs',
    ],

    whoami: () => [
      '┌─ PERFIL ─────────────────────────────',
      '│  Nombre:     Nombre Apellido',
      '│  Carrera:    Ingeniería Mecatrónica',
      '│  Estado:     ✓ Disponible para proyectos',
      '│  Ubicación:  Argentina',
      '│  Stack:      C/C++ · STM32 · PLC · CAD',
      '└────────────────────────────────────────',
    ],

    skills: () => [
      '── FIRMWARE ──────────',
      '  STM32 (HAL/LL)  ████████████ 88%',
      '  C / C++         ██████████████ 95%',
      '  AVR ATmega      ████████████ 82%',
      '  USB CDC / DMA   ██████████  80%',
      '',
      '── AUTOMATIZACIÓN ────',
      '  PLC Schneider M340  ████████████ 85%',
      '  Unity Pro (EcoStr.) ████████████ 80%',
      '  Yaskawa Sigma-5     ██████████  72%',
      '',
      '── CAD & ELECTRÓNICA ─',
      '  CAD 3D (Fusion360)  ████████████ 88%',
      '  Diseño PCB          ██████████  75%',
    ],

    projects: () => [
      '── PROYECTOS ─────────────────────────',
      '  [1] Control de Posición STM32 (PID)',
      '  [2] Automatización Línea Schneider',
      '  [3] Brazo Robótico 3 DOF',
      '  [4] Data Logger USB CDC + OLED',
      '  [5] Tablero Eléctrico Industrial',
      '  [6] IoT IR + ESP01 WiFi',
      '',
      '  → Más detalles en la sección Proyectos',
    ],

    contact: () => [
      '── CONTACTO ──────────────────────────',
      '  Email:    tucorreo@email.com',
      '  GitHub:   github.com/tuusuario',
      '  LinkedIn: linkedin.com/in/tuusuario',
    ],

    github: () => {
      window.open('https://github.com/tuusuario', '_blank');
      return ['Abriendo GitHub...'];
    },

    firmware: () => [
      '── FIRMWARE EXPERIENCE ───────────────',
      '  MCU:   STM32F0/F1/F4, ATmega328/2560',
      '  IDE:   STM32CubeIDE, AVR-GCC',
      '  RTOS:  FreeRTOS (básico)',
      '  Periféricos:',
      '    · UART/USART (DMA, IDLE IRQ)',
      '    · I2C (OLED SSD1306, IMU MPU6050)',
      '    · SPI (pantallas, Flash)',
      '    · TIM (PWM, encoder, captura)',
      '    · ADC (DMA multicanal)',
      '    · USB CDC (VCP)',
      '    · ESP01 WiFi (AT commands)',
    ],

    plc: () => [
      '── PLC EXPERIENCE ────────────────────',
      '  Schneider M340:',
      '    · Unity Pro / EcoStruxure',
      '    · Ladder, FBD, ST',
      '    · Modbus TCP/IP',
      '    · HMI Magelis',
      '',
      '  Siemens Logo!:',
      '    · Logo! Soft Comfort',
      '    · Control de secuencias',
      '',
      '  Tableros eléctricos industriales',
      '  Yaskawa Sigma-5 (puesta en marcha)',
    ],

    clear: () => { body.innerHTML = ''; return []; },
  };

  function addLine(text, cls = 'term-output') {
    const line = document.createElement('div');
    line.className = 'term-line';
    const span = document.createElement('span');
    span.className = cls;
    span.textContent = text;
    line.appendChild(span);
    body.appendChild(line);
  }

  function addInput(text) {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = `<span class="term-prompt">$</span><span class="term-text">${text}</span>`;
    body.appendChild(line);
  }

  function run(cmd) {
    const trimmed = cmd.trim().toLowerCase();
    addInput(cmd);

    if (trimmed === '') {
      scrollBottom();
      return;
    }

    if (COMMANDS[trimmed]) {
      const out = COMMANDS[trimmed]();
      if (Array.isArray(out)) out.forEach(l => addLine(l));
    } else {
      addLine(`${trimmed}: comando no encontrado. Escribí 'help' para ver la lista.`, 'term-error');
    }
    scrollBottom();
  }

  function scrollBottom() {
    body.scrollTop = body.scrollHeight;
  }

  /* Initial message */
  ['Mechatron Terminal v1.0', 'Escribí "help" para ver los comandos.'].forEach(l => addLine(l));

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      run(val);
    }
  });

  /* Click on card focuses input */
  document.querySelector('.terminal-card')?.addEventListener('click', () => input.focus());
})();
