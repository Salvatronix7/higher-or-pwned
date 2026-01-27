import { useEffect, useMemo, useState } from "react";

const PASSWORD_POOL = [
  "123456",
  "password",
  "123456789",
  "qwerty",
  "12345678",
  "111111",
  "123123",
  "abc123",
  "12345",
  "admin",
  "letmein",
  "welcome",
  "monkey",
  "dragon",
  "football",
  "iloveyou",
  "sunshine",
  "princess",
  "password1",
  "qwerty123",
  "shadow",
  "master",
  "666666",
  "1234",
  "baseball",
  "trustno1",
  "superman",
  "pokemon",
  "asdfghjkl",
  "1q2w3e4r",
  "zaq12wsx",
  "login",
  "passw0rd",
  "654321"
];

const shuffle = (values) => {
  const array = [...values];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");

const sha1Hex = async (value) => {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-1", data);
  return toHex(digest).toUpperCase();
};

const fetchPwnedCount = async (password) => {
  const hash = await sha1Hex(password);
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);
  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${prefix}`
  );
  if (!response.ok) {
    throw new Error("No se pudo consultar el API de Pwned Passwords.");
  }
  const body = await response.text();
  const match = body
    .split("\n")
    .map((line) => line.trim().split(":"))
    .find(([hashSuffix]) => hashSuffix === suffix);
  return match ? Number.parseInt(match[1], 10) : 0;
};

const formatCount = (count) =>
  new Intl.NumberFormat("es-ES").format(count);

const buildCard = (password, count) => ({ password, count });

const drawPassword = async (pool) => {
  if (pool.length === 0) {
    return null;
  }
  const password = pool.pop();
  const count = await fetchPwnedCount(password);
  return buildCard(password, count);
};

export default function App() {
  const [unusedPasswords, setUnusedPasswords] = useState([]);
  const [leftCard, setLeftCard] = useState(null);
  const [rightCard, setRightCard] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState(0);
  const [champion, setChampion] = useState({ password: null, streak: 0 });

  const remainingCount = useMemo(
    () => unusedPasswords.length,
    [unusedPasswords]
  );

  const startGame = async () => {
    setStatus("loading");
    setError("");
    setReveal(false);
    setScore(0);
    setChampion({ password: null, streak: 0 });

    const pool = shuffle(PASSWORD_POOL);

    try {
      const first = await drawPassword(pool);
      const second = await drawPassword(pool);

      if (!first || !second) {
        setStatus("error");
        setError("No hay suficientes contraseñas disponibles.");
        return;
      }

      setLeftCard(first);
      setRightCard(second);
      setUnusedPasswords(pool);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err.message || "No se pudo iniciar el juego.");
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  const handleGuess = (choice) => {
    if (status !== "ready" || reveal) {
      return;
    }

    const chosen = choice === "left" ? leftCard : rightCard;
    const other = choice === "left" ? rightCard : leftCard;

    if (!chosen || !other) {
      return;
    }

    setReveal(true);

    if (chosen.count >= other.count) {
      setScore((prev) => prev + 1);
      setStatus("correct");
    } else {
      setStatus("game-over");
    }
  };

  const advanceRound = async () => {
    if (!leftCard || !rightCard) {
      return;
    }

    setStatus("loading");
    setReveal(false);

    const pool = [...unusedPasswords];
    const winner = leftCard.count >= rightCard.count ? leftCard : rightCard;
    const nextChampion =
      winner.password === champion.password
        ? { password: winner.password, streak: champion.streak + 1 }
        : { password: winner.password, streak: 1 };
    const shouldRotateWinner = nextChampion.streak >= 2;

    try {
      if (shouldRotateWinner) {
        const first = await drawPassword(pool);
        const second = await drawPassword(pool);

        if (!first || !second) {
          setStatus("game-over");
          return;
        }

        setChampion({ password: null, streak: 0 });
        setLeftCard(first);
        setRightCard(second);
        setUnusedPasswords(pool);
        setStatus("ready");
        return;
      }

      const next = await drawPassword(pool);
      if (!next) {
        setStatus("game-over");
        return;
      }

      setChampion(nextChampion);
      setLeftCard(winner);
      setRightCard(next);
      setUnusedPasswords(pool);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err.message || "No se pudo continuar la partida.");
    }
  };

  const resetLabel = status === "error" ? "Reintentar" : "Reiniciar";

  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Juego Higher or Lower</p>
        <h1>Higher or Pwned</h1>
        <p className="subtitle">
          ¿Qué contraseña ha sido comprometida más veces? Elige la opción más
          pwned para mantener la racha.
        </p>
      </header>

      <section className="scoreboard">
        <div>
          <span>Racha</span>
          <strong>{score}</strong>
        </div>
        <div>
          <span>Disponibles</span>
          <strong>{remainingCount}</strong>
        </div>
        <div>
          <span>Regla de rotación</span>
          <strong>2 turnos</strong>
        </div>
      </section>

      {status === "error" && (
        <div className="notice error">
          <h2>Ups</h2>
          <p>{error}</p>
          <button type="button" onClick={startGame}>
            {resetLabel}
          </button>
        </div>
      )}

      {(status === "ready" || status === "correct" || status === "game-over") && (
        <section className="cards">
          {[leftCard, rightCard].map((card, index) => (
            <article
              key={card?.password || index}
              className={
                status === "game-over" &&
                card &&
                card.count < (leftCard?.count ?? 0) &&
                card.count < (rightCard?.count ?? 0)
                  ? "card muted"
                  : "card"
              }
            >
              <h3>{card?.password ?? "Cargando..."}</h3>
              <p className="hint">¿Más pwned que la otra?</p>
              <div className="count">
                <span>Veces comprometida</span>
                <strong>
                  {reveal || status === "game-over"
                    ? formatCount(card?.count ?? 0)
                    : "???"}
                </strong>
              </div>
              {status === "ready" && (
                <button
                  type="button"
                  onClick={() => handleGuess(index === 0 ? "left" : "right")}
                >
                  Elegir esta
                </button>
              )}
            </article>
          ))}
        </section>
      )}

      {status === "correct" && (
        <div className="notice success">
          <h2>¡Acertaste!</h2>
          <p>
            Bien hecho. La contraseña más pwned continúa, salvo que gane 2
            turnos seguidos.
          </p>
          <button type="button" onClick={advanceRound}>
            Continuar
          </button>
        </div>
      )}

      {status === "game-over" && (
        <div className="notice error">
          <h2>Fin de la partida</h2>
          <p>
            La otra contraseña estaba más comprometida. Reinicia para jugar de
            nuevo con combinaciones nuevas.
          </p>
          <button type="button" onClick={startGame}>
            {resetLabel}
          </button>
        </div>
      )}

      {status === "loading" && (
        <div className="notice loading">
          <span className="spinner" aria-hidden="true" />
          Cargando datos desde Pwned Passwords...
        </div>
      )}

      <footer className="footer">
        <p>
          Usamos el API público de Pwned Passwords con k-anonymity para consultar
          las veces que una contraseña fue comprometida.
        </p>
      </footer>
    </div>
  );
}
