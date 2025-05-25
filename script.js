 const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const seviyeDisplay = document.getElementById("seviyeDisplay");
    const girisEkrani = document.getElementById("girisEkrani");
    const oynaBtn = document.getElementById("oynaBtn");

    const kurbaga = new Image();
    const cimen = new Image();
    const nehir = new Image();
    const odun = new Image();
    const zipla = new Audio("sounds/frog-quak-sound.mp3");

    kurbaga.src = "imgs/kurbaga.png";
    cimen.src = "imgs/cimen.png";
    nehir.src = "imgs/nehir.png";
    odun.src = "imgs/odun.png";

    const totalImages = 4;
    let imagesLoaded = 0;
//resimleri yükleyelim

    kurbaga.onload = cimen.onload = nehir.onload = odun.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
        oynaBtn.disabled = false;
      }
    };

    let frogs, gameState, odunlar, odunHizi, oyunBaslamaZamani;
    const oyunBaslamaGecikmesi = 3000;
    const ziplamaAraligi = 1500; //kurbağa kaç milisaniyede bir zıplayacak
    const ziplamaMesafesi = 30;// kurbağa bir zıplamada y ekseninde ne kadar birim alacak
    let sonZiplamaZamani, seviye, mesafe = 200; //kurbağaların arasındaki mesafe
//butona tıklayınca oyun başlasın
    oynaBtn.addEventListener("click", () => {
      girisEkrani.style.display = "none";
      canvas.style.display = "block";
      seviyeDisplay.style.display = "block";
      startGame();
    });
//oyyun seviye 1 ' den başlayacak
    function startGame() {
      seviye = 1;
      baslatSeviye(seviye);
    }
//seviye arttıkça kurbağa sayısı da artacak
    function baslatSeviye(seviyeSayisi) {
      frogs = [];
      for (let i = 0; i < seviyeSayisi; i++) {
        frogs.push({ x: 300 + i * mesafe, y: 30 });
      }
      gameState = "playing";
      odunlar = [{ x: 0, y: 270 }];
      odunHizi = 1;
      sonZiplamaZamani = Date.now();
      oyunBaslamaZamani = Date.now();
      seviyeDisplay.textContent = `Seviye: ${seviyeSayisi}`;
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, 850, 600);
      ctx.drawImage(cimen, 0, 0, 850, 600);
      ctx.drawImage(nehir, 0, 270, 850, 30);

      const simdi = Date.now();
//kurbağa odunun üzerine çıkınca odunla beraber yatay olarak ilerlesin
      for (let frog of frogs) {
        if (isKurbağaOdunÜstünde(frog)) frog.x += odunHizi;
      }

      for (let i = 0; i < odunlar.length; i++) {
        odunlar[i].x += odunHizi;
        ctx.drawImage(odun, odunlar[i].x, odunlar[i].y, 110, 30);
      }

      for (let frog of frogs) {
        ctx.drawImage(kurbaga, frog.x, frog.y, 30, 30);
      }
//kurbağa belli bir zaman aralığında zıplasın
      if (simdi - sonZiplamaZamani >= ziplamaAraligi && gameState === "playing") {
        for (let frog of frogs) {
          if (frog.y === 270) {
            frog.y += ziplamaMesafesi;
          } else if (frog.y < 270) {
            frog.y += ziplamaMesafesi;
          } else if (frog.y >= 300 && frog.y < 390) {
            frog.y += ziplamaMesafesi;
          } else if (frog.y >= 390) {
            gameState = "nextStage";
            setTimeout(startNextStage, 2000);
            return;
          }
        }
        zipla.play();
        sonZiplamaZamani = simdi;
      }

      let sonOdun = odunlar[odunlar.length - 1];
      if (sonOdun.x >= 210) odunlar.push({ x: 0, y: 270 }); //belli aralıklarla sürekli olarak yeni odunlar gelsin

      if ((simdi - oyunBaslamaZamani) > oyunBaslamaGecikmesi && gameState === "playing") {
        for (let frog of frogs) {
          if (frog.y >= 270 && frog.y < 300 && !isKurbağaOdunÜstünde(frog)) {
            gameOver();
            return;
          }
        }
      }

      requestAnimationFrame(draw);
    }

    function isKurbağaOdunÜstünde(frog) {
      for (let odun of odunlar) {
        if (
          frog.x < odun.x + 110 &&
          frog.x + 30 > odun.x &&
          frog.y + 30 > odun.y &&
          frog.y < odun.y + 30
        ) {
          return true;
        }
      }
      return false;
    }

    function startNextStage() {
      seviye++;
      if (seviye > 3) {
        alert("TEBRİKLER! TÜM SEVİYELERİ GEÇTİNİZ!");
        window.location.reload();
      } else {
        baslatSeviye(seviye);
      }
    }

    function gameOver() {
      alert("GAME OVER!!!");
      canvas.style.display = "none";
      seviyeDisplay.style.display = "none";
      girisEkrani.style.display = "flex";
    }

    document.addEventListener("keydown", e => {
      if (e.code === "Space") odunHizi = 3;
    });

    document.addEventListener("keyup", e => {
      if (e.code === "Space") odunHizi = 1;
    });
