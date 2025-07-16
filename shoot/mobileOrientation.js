// mobileOrientation.js

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function checkOrientation() {
  const isPortrait = window.innerHeight > window.innerWidth;
  const overlay = document.getElementById('rotateOverlay');
  if (isTouchDevice() && isPortrait) {
    overlay.style.display = 'block';
  } else {
    overlay.style.display = 'none';
  }
}

function goFullscreenLandscape() {
  const el = document.documentElement;

  if (el.requestFullscreen) el.requestFullscreen();
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  else if (el.msRequestFullscreen) el.msRequestFullscreen();

  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock("landscape").catch(console.warn);
  }
}

function initMobileOrientation() {
  checkOrientation();
  window.addEventListener('resize', checkOrientation);
  window.addEventListener('orientationchange', checkOrientation);
  window.addEventListener('load', checkOrientation);
}
function setupJoystick(containerId, onMove, onEnd) {
  const container = document.getElementById(containerId);
  let knob = container.querySelector(containerId === 'rightJoystick' ? '.hook-icon' : '.knob');
  let origin = { x: 0, y: 0 };
  let dragging = false;

  container.addEventListener('touchstart', (e) => {
    dragging = true;
    const touch = e.touches[0];
    origin = { x: touch.clientX, y: touch.clientY };

    if (containerId === 'rightJoystick') {
      const cancelZone = container.querySelector('.cancel-zone');
      if (cancelZone) cancelZone.style.display = 'block';
      // ✅ Proper placement
      window.player && (window.player.isAiming = true);
    }
  });

  container.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const touch = e.touches[0];
    const dx = touch.clientX - origin.x;
    const dy = touch.clientY - origin.y;
    const maxDist = 40;
    const dist = Math.min(maxDist, Math.hypot(dx, dy));
    const angle = Math.atan2(dy, dx);
    const offsetX = Math.cos(angle) * dist;
    const offsetY = Math.sin(angle) * dist;
    knob.style.left = 50 + offsetX / 1.2 + '%';
    knob.style.top = 50 + offsetY / 1.2 + '%';
    onMove(offsetX / maxDist, offsetY / maxDist, touch.clientY);
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    dragging = false;
    knob.style.left = '50%';
    knob.style.top = '50%';

   if (containerId === 'rightJoystick') {
  const touchY = e.changedTouches[0].clientY;
  onEnd(touchY); // Let cancel or fire handle it

  // ✅ Only end aiming if not cancelled or shot
  setTimeout(() => {
    if (!window.player.canShoot) {
      window.player.isAiming = false;
      document.body.classList.remove('aiming');
    }
  }, 10);
}
 else {
      onEnd();
    }
  });
}


function initTouchControls(player, fireBullet, aimDirRef) {
  if (!isTouchDevice()) return;

  document.getElementById('leftJoystick').style.display = 'block';
  document.getElementById('rightJoystick').style.display = 'block';

  setupJoystick('leftJoystick',
    (dx, dy) => {
      player.ax = dx * player.speed;
      player.ay = dy * player.speed;
    },
    () => {
      player.ax = 0;
      player.ay = 0;
    }
  );

  setupJoystick('rightJoystick',
   (dx, dy, touchY) => {
  const dist = Math.hypot(dx, dy);
  if (dist > 0.2) {
    aimDirRef.value = { dx: dx / dist, dy: dy / dist }; // ← Normalize
  }

      const cancelZone = document.querySelector('#rightJoystick .cancel-zone');
      if (!cancelZone) return;
      cancelZone.style.display = 'block';
      const cancelRect = cancelZone.getBoundingClientRect();
      cancelZone.style.background = (touchY < cancelRect.bottom && touchY > cancelRect.top) ? '#ff0000' : '#ff4d4d';
    },
    (touchY) => {
      const cancelZone = document.querySelector('#rightJoystick .cancel-zone');
      if (!cancelZone) return;
      const cancelRect = cancelZone.getBoundingClientRect();

      if (touchY < cancelRect.bottom && touchY > cancelRect.top) {
        aimDirRef.value = null;
        player.canShoot = true;
        cancelZone.style.display = 'none';
        return;
      }

      if (!player.canShoot || !aimDirRef.value) return;
      fireBullet(aimDirRef.value.dx, aimDirRef.value.dy);
      cancelZone.style.display = 'none';
    }
  );
}

// Make global
window.goFullscreenLandscape = goFullscreenLandscape;
window.initMobileOrientation = initMobileOrientation;
window.initTouchControls = initTouchControls;
