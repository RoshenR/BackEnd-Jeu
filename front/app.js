const API = "http://localhost:3001";
const LS_TOKEN = "maets_jwt";

const out = document.getElementById("out");
const apiUrlEl = document.getElementById("apiUrl");
const libraryList = document.getElementById("libraryList");

apiUrlEl.textContent = API;

function setOut(obj) {
    out.textContent = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
}

function getToken() {
    return localStorage.getItem(LS_TOKEN);
}

function setToken(token) {
    if (!token) localStorage.removeItem(LS_TOKEN);
    else localStorage.setItem(LS_TOKEN, token);
}

async function apiFetch(path, { method = "GET", body } = {}) {
    const headers = { "Content-Type": "application/json" };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let json;
    try { json = text ? JSON.parse(text) : null; }
    catch { json = { raw: text }; }

    if (!res.ok) {
        throw { status: res.status, statusText: res.statusText, body: json };
    }
    return json;
}

function escapeHtml(s) {
    return String(s ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function renderLibrary(items) {
    libraryList.innerHTML = "";
    (items || []).forEach((it) => {
        // selon ton controller, ça peut être direct un game, ou { game: {...} }
        const g = it?.game ?? it;

        const id = g?.id ?? it?.gameId ?? "?";
        const title = g?.title ?? "Jeu";
        const publisher = g?.publisher ?? "";
        const year = g?.year ? `• ${g.year}` : "";

        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
      <div class="title">
        <strong>${escapeHtml(title)}</strong>
        <span class="badge">id: ${escapeHtml(id)}</span>
      </div>
      <div class="muted small">${escapeHtml(publisher)} ${escapeHtml(year)}</div>
    `;
        libraryList.appendChild(div);
    });
}

// --------- Actions UI ----------

document.getElementById("btnRegister").onclick = async () => {
    try {
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPass").value;

        const r = await apiFetch("/auth/register", {
            method: "POST",
            body: { email, password },
        });

        setOut(r);
    } catch (e) {
        setOut(e);
    }
};

document.getElementById("btnLogin").onclick = async () => {
    try {
        const email = document.getElementById("logEmail").value.trim();
        const password = document.getElementById("logPass").value;

        const r = await apiFetch("/auth/login", {
            method: "POST",
            body: { email, password },
        });

        // ✅ IMPORTANT: adapte si ton controller renvoie un autre nom
        const token = r?.token || r?.accessToken || r?.jwt || r?.data?.token;
        if (!token) {
            setOut({ warning: "Login OK mais token introuvable dans la réponse", response: r });
            return;
        }

        setToken(token);
        setOut({ ok: true, tokenSaved: true, response: r });
    } catch (e) {
        setOut(e);
    }
};

document.getElementById("btnLogout").onclick = () => {
    setToken(null);
    setOut("✅ Logout: token supprimé.");
};

document.getElementById("btnMe").onclick = async () => {
    try {
        const r = await apiFetch("/auth/me");
        setOut(r);
    } catch (e) {
        setOut(e);
    }
};

document.getElementById("btnLibrary").onclick = async () => {
    try {
        const r = await apiFetch("/library");
        renderLibrary(r);
        setOut(r);
    } catch (e) {
        setOut(e);
    }
};

document.getElementById("btnAdd").onclick = async () => {
    try {
        const gameId = document.getElementById("libGameId").value.trim();
        const r = await apiFetch(`/library/${encodeURIComponent(gameId)}`, { method: "POST" });
        setOut(r);
    } catch (e) {
        setOut(e);
    }
};

document.getElementById("btnRemove").onclick = async () => {
    try {
        const gameId = document.getElementById("libGameId").value.trim();
        const r = await apiFetch(`/library/${encodeURIComponent(gameId)}`, { method: "DELETE" });
        setOut(r);
    } catch (e) {
        setOut(e);
    }
};
