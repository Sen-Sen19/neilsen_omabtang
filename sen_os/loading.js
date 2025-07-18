  const bootPercent = document.getElementById("boot-percent"),
        bootLog = document.getElementById("boot-log"),
        bootScreen = document.getElementById("boot-screen"),
        desktop = document.getElementById("desktop"),
        progressFill = document.getElementById("progress-fill");

      const messages = [
        "[SYS] Totally not panicking about memory allocation...",
        "[CPU] 98% busy pretending to work.",
        "[GPU] Compiling shaders… again… because that worked last time...",
        "[AI] Slime neural network is definitely smarter than the user...",
        "[FILE] Pretending these folders are organized...",
        "[VR] Pretending this is immersive computing...",
        "[NET] Connecting to GitHub… and instantly regretting it...",
        "[OS] Now 20% more confused than last update!",
        "[SECURITY] Trusting this firewall like I trust public Wi-Fi.",
        "[SYNC] Syncing particles... because why not?",
        "[READY] Boot complete. Lower your expectations.",
        "[BOOT] Calibrating coffee dispenser… priorities, right?",
        "[CACHE] Clearing cache for emotional reasons...",
        "[MEMORY] RAM is full of regrets and temporary variables...",
        "[CORE] Multithreading like a caffeine-fueled spider...",
        "[HELP] Consulting ChatGPT because the rubber duck stopped replying...",
        "[NETWORK] So slow, I had time to reevaluate my life choices..",
        "[CORE] Spinning up threads like it’s a knitting competition...",
        "[NETWORK] Detecting alien WiFi... signal seems... suspicious.",
        "[DEVTOOLS] Copy-pasting expertise from StackOverflow...",
        "[SIGNAL] Getting strong bars from Area 51 guest network...",
        "[VRAM] Filling video memory with dreams and bad decisions...",
        "[INPUT] Aligning keyboard chakra. Namaste or whatever...",
        "[GPU] Flexing imaginary frame rates...",
        "[BOOT] Paying tribute to the syntax gods... again.",
        "[DEBUG] No errors... just undocumented features.",
        "[QUANTUM] Thinking in multiple realities to avoid responsibility...",
        "[SOUND] Reticulating waveforms that no one asked for...",
        "[BOOT] Honoring the sacred semicolon... or else...",
        "[DEVTOOLS] Definitely *not* copying from StackOverflow...",
        "[NETWORK] Downloading at one byte per century.",
        "[UPTIME] Bragging about not sleeping since last crash...",
        "[DEBUG] No bugs found... which is suspicious.",
        "[EGO] Inflating self-worth based on dark mode usage...",
        "[CREDITS] Giving thanks to absolutely no one...",
        "[API] Whispering to OpenAI because screaming doesn’t help...",
        "[FINALIZE] Polishing pixels for absolutely no reason...",
      ];

      let percent = 1;
      let loadingComplete = false;

      function bootStep() {
        percent += Math.floor(Math.random() * 5) + 1;
        if (percent >= 100) percent = 100;
        bootPercent.textContent = `Loading... ${percent}%`;
        progressFill.style.width = percent + "%";

        if (percent < 100) {
          setTimeout(bootStep, Math.random() * 300 + 100);
        } else {
          loadingComplete = true;
          bootLog.textContent = "[BOOT] Completed.";
          setTimeout(() => {
            bootScreen.style.display = "none";
            desktop.style.display = "block";
          }, 1000);
        }
      }

      setTimeout(bootStep, 1000);

      // 🌀 Random message cycling
      function cycleBootMessagesSlowly() {
        if (!loadingComplete) {
          const randomIndex = Math.floor(Math.random() * messages.length);
          bootLog.textContent = messages[randomIndex];
          setTimeout(cycleBootMessagesSlowly, 2000);
        }
      }

      cycleBootMessagesSlowly();